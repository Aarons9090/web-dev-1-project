const orderList = document.getElementById('order-list')

async function fetchOrders() {
  try {
    const response = await fetchUrl('/purchases/user', 'GET')
    const orders = await response.json()
    return orders
  } catch (error) {
    return []
  }
}

async function fetchAllOrders() {
  try {
    const response = await fetchUrl('/purchases', 'GET')
    const orders = await response.json()
    return orders
  } catch (error) {
    return []
  }
}

async function displayOrders() {
  const isAdmin = await isUserAdmin()
  let orders = []
  if (isAdmin) {
    orders = await fetchAllOrders()
  } else {
    orders = await fetchOrders()
  }

  orderList.innerHTML = ''

  if (orders.length === 0) {
    const noOrders = document.createElement('h3')
    noOrders.textContent = 'No orders'
    orderList.appendChild(noOrders)
    return
  }

  orders.forEach((order) => {
    const orderTemplate = document.querySelector('.order-template')
    const orderElement = document.importNode(orderTemplate.content, true)
    if (isAdmin) {
      const userTitle = document.createElement('h4')
      userTitle.textContent = `
      User ID: ${order.user.id}
      Username: ${order.user.username}
      `
      orderElement.querySelector('.order-info').appendChild(userTitle)
    }
    order.products.forEach((productData) => {
      let product = productData.product

      if (!product) {
        product = {
          name: 'Removed product',
          price: 0,
        }
      }
      const orderItemTemplate = document.querySelector('.order-item-template')
      const orderItemElement = document.importNode(
        orderItemTemplate.content,
        true
      )

      orderItemElement.querySelector('.order-item-name').textContent =
        product.name

      orderItemElement.querySelector(
        '.order-item-price'
      ).textContent = `${product.price} €`
      orderItemElement.querySelector('.order-item-quantity').textContent =
        productData.quantity

      orderElement.querySelector('.order-info').appendChild(orderItemElement)
      //if not last order item element, add a separator
      if (order.products.indexOf(productData) !== order.products.length - 1) {
        const separator = document.createElement('hr')
        orderElement.querySelector('.order-info').appendChild(separator)
      }
    })
    const total = order.products.reduce((total, item) => {
      return total + item.product ? item.product.price * item.quantity : 0
    }, 0)
    orderElement.querySelector('.total').textContent = `Total: ${total} €`
    orderList.appendChild(orderElement)
  })
}

window.addEventListener('load', async () => {
  displayOrders()
})
