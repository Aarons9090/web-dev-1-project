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

async function displayOrders() {
  const orders = await fetchOrders()

  orderList.innerHTML = ''

  orders.forEach((order) => {
    const orderTemplate = document.querySelector('.order-template')
    const orderElement = document.importNode(orderTemplate.content, true)

    order.products.forEach((productData) => {
      const product = productData.product
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
      return total + item.product.price * item.quantity
    }, 0)
    orderElement.querySelector('.total').textContent = `Total: ${total} €`
    orderList.appendChild(orderElement)
  })
}

window.addEventListener('load', async () => {
  displayOrders()
})
