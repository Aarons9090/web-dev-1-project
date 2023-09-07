const linksContainer = document.getElementById('links-container')
async function getCartQuantity() {
  const response = await fetchUrl('/cart', 'GET')
  if (!response) {
    return 0
  }
  const cart = await response.json()
  if (cart.error) {
    return 0
  }
  return cart.products.reduce((total, item) => {
    if (!item.product) return total
    return total + item.quantity
  }, 0)
}

async function populateLinks(roleName) {
  linksContainer.innerHTML = ''
  const isAdmin = roleName === 'Admin'
  const currentPath = window.location.pathname
  const homeLink = document.createElement('a')
  homeLink.href = '/'
  homeLink.textContent = 'Home'

  const productsLink = document.createElement('a')
  productsLink.href = '/products.html'
  productsLink.textContent = 'Products'

  const ordersLink = document.createElement('a')
  ordersLink.href = '/orders.html'

  // add current class tag if on current page
  if (currentPath === '/' || currentPath === '/index.html') {
    homeLink.classList.add('current')
  } else if (currentPath === '/products.html') {
    productsLink.classList.add('current')
  } else if (currentPath === '/orders.html') {
    ordersLink.classList.add('current')
  }

  linksContainer.appendChild(homeLink)
  linksContainer.appendChild(productsLink)

  if (isAdmin) {
    const usersLink = document.createElement('a')
    usersLink.href = '/users.html'
    usersLink.textContent = 'Users'
    if (currentPath === '/users.html') {
      usersLink.classList.add('current')
    }
    linksContainer.appendChild(usersLink)
    ordersLink.textContent = 'Orders'
  } else {
    const cartLinkDiv = document.createElement('div')
    cartLinkDiv.classList.add('cart-link')
    const cartQuantity = document.createElement('span')
    cartQuantity.classList.add('cart-quantity')
    cartQuantity.textContent = await getCartQuantity()
    const cartLink = document.createElement('a')
    cartLinkDiv.onclick = () => {
      window.location.href = '/cart.html'
    }
    cartLink.textContent = 'Cart'
    if (currentPath === '/cart.html') {
      cartLink.classList.add('current')
    }
    cartLinkDiv.appendChild(cartLink)
    cartLinkDiv.appendChild(cartQuantity)
    linksContainer.appendChild(cartLinkDiv)
    ordersLink.textContent = 'My Orders'
  }

  linksContainer.appendChild(ordersLink)
}

window.addEventListener('load', async () => {
  const role = await getUserRole()
  populateLinks(role.role)

  // display role name
  const linksContainer = document.getElementById('role-name')
  linksContainer.innerHTML = `Logged in as ${role.role}`
})
