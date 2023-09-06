const linksContainer = document.getElementById('links-container')

async function populateLinks(roleName) {
  const isAdmin = roleName === 'Admin'
  const currentPath = window.location.pathname
  const homeLink = document.createElement('a')
  homeLink.href = '/'
  homeLink.textContent = 'Home'

  const productsLink = document.createElement('a')
  productsLink.href = '/products'
  productsLink.textContent = 'Products'

  const ordersLink = document.createElement('a')
  ordersLink.href = '/orders'

  // add current class tag if on current page
  if (currentPath === '/') {
    homeLink.classList.add('current')
  } else if (currentPath === '/products') {
    productsLink.classList.add('current')
  } else if (currentPath === '/orders') {
    ordersLink.classList.add('current')
  }

  linksContainer.appendChild(homeLink)
  linksContainer.appendChild(productsLink)

  if (isAdmin) {
    const usersLink = document.createElement('a')
    usersLink.href = '/users'
    usersLink.textContent = 'Users'
    if (currentPath === '/users') {
      usersLink.classList.add('current')
    }
    linksContainer.appendChild(usersLink)
    ordersLink.textContent = 'Orders'
  } else {
    const cartLink = document.createElement('a')
    cartLink.href = '/cart'
    cartLink.textContent = 'Cart'
    if (currentPath === '/cart') {
      cartLink.classList.add('current')
    }
    linksContainer.appendChild(cartLink)
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
