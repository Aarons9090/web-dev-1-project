const cartContainer = document.querySelector('.cart-container')
const cartItemList = document.querySelector('.cart-items')
async function fetchCart() {
  try {
    const res = await fetchUrl('/cart', 'GET')
    if (!res) {
      showNotification('Error fetching cart', 'error')
      return []
    }
    const cart = await res.json()
    return cart
  } catch (error) {
    return []
  }
}

async function displayCart() {
  const cart = await fetchCart()
  const cartItems = cart.error ? [] : cart.products
  const cartTotal = cartItems.reduce((total, item) => {
    if (!item.product) return total
    return total + item.product.price * item.quantity
  }, 0)

  cartItemList.innerHTML = ''

  cartContainer.querySelector(
    '.cart-total'
  ).textContent = `Total: ${cartTotal} €`

  // clear cart
  cartContainer.querySelector('.clear-cart').onclick = async () => {
    const res = await fetchUrl('/cart/empty', 'POST')
    if (!res) {
      showNotification('Error clearing cart', 'error')
      return
    }
    showNotification('Cart cleared!', 'success')
    await displayCart()
  }

  // checkout cart
  cartContainer.querySelector('.checkout').onclick = async () => {
    if (cartItems.length === 0) {
      showNotification('Cart is empty', 'error')
      return
    }
    const res = await fetchUrl('/cart/checkout', 'POST')

    if (!res) {
      showNotification('Error checking out', 'error')
      return
    }
    showNotification('Order completed!', 'success')
    await displayCart()
  }

  cartItems.forEach((productData) => {
    if (!productData.product) return
    const product = productData.product
    const productTemplate = document.querySelector('.cart-item-template')
    const productElement = document.importNode(productTemplate.content, true)

    productElement.querySelector('.cart-item-name').textContent = product.name
    productElement.querySelector(
      '.cart-item-price'
    ).textContent = `${product.price} €`
    productElement.querySelector('.cart-item-quantity').textContent =
      productData.quantity
    productElement.querySelector('.decrease-quantity').onclick = async () => {
      await fetchUrl('/cart/remove', 'POST', { productId: product.id })
      await displayCart()
    }
    productElement.querySelector('.increase-quantity').onclick = async () => {
      await fetchUrl('/cart/add', 'POST', { productId: product.id })
      await displayCart()
    }

    productElement.querySelector('.remove-from-cart').onclick = async () => {
      const res = await fetchUrl('/cart/delete', 'POST', {
        productId: product.id,
      })
      if (!res) {
        showNotification('Error removing from cart', 'error')
        return
      }

      await displayCart()
    }
    cartItemList.appendChild(productElement)
  })
}

window.addEventListener('load', async () => {
  await displayCart()
})
