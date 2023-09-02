const linksContainer = document.getElementById('links-container')

async function populateLinks(roleName) {
  const isAdmin = roleName === 'Admin'

  const homeLink = document.createElement('a')
  homeLink.href = '/'
  homeLink.textContent = 'Home'

  const productsLink = document.createElement('a')
  productsLink.href = '/products'
  productsLink.textContent = 'Products'

  // add current class tag if on current page
  if (window.location.pathname === '/') {
    homeLink.classList.add('current')
  } else if (window.location.pathname === '/products') {
    productsLink.classList.add('current')
  }

  linksContainer.appendChild(homeLink)
  linksContainer.appendChild(productsLink)

  if (isAdmin) {
    const usersLink = document.createElement('a')
    usersLink.href = '/users'
    usersLink.textContent = 'Users'
    if (window.location.pathname === '/users') {
      usersLink.classList.add('current')
    }
    linksContainer.appendChild(usersLink)
  }
}

window.addEventListener('load', async () => {
  const role = await getUserRole()
  populateLinks(role.role)

  // display role name
  const linksContainer = document.getElementById('role-name')
  linksContainer.innerHTML = role.role
})
