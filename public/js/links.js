const linksContainer = document.getElementById('links-container')

async function populateLinks(roleName) {
  const isAdmin = roleName === 'Admin'

  if (isAdmin) {
    linksContainer.innerHTML = `
      <a href="/">Home</a>
      <a href="/users">Users</a>
      <a href="/products">Products</a>
    `
  } else {
    linksContainer.innerHTML = `
      <a href="/">Home</a>
      <a href="/products">Products</a>
    `
  }
}

window.addEventListener('load', async () => {
  const role = await getUserRole()
  populateLinks(role.role)

  // display role name
  const linksContainer = document.getElementById('role-name')
  linksContainer.innerHTML = role.role
})
