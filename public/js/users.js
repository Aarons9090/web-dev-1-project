const userListContainer = document.getElementById('userList')

async function fetchUsers() {
  try {
    const response = await fetchUrl('/users', 'GET')
    const users = await response.json()
    return users
  } catch (error) {
    return []
  }
}

async function displayUsers() {
  const users = await fetchUsers()

  userListContainer.innerHTML = ''

  users.forEach((user) => {
    const userElement = document.createElement('div')
    userElement.classList.add('user')
    userElement.textContent = `Username: ${user.username}, Role: ${user.role.name}`
    userListContainer.appendChild(userElement)
  })
}

window.addEventListener('load', displayUsers)
