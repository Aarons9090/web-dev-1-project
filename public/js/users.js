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
    userElement.innerHTML = `
      <div>
        <h4>${user.username}</h4>
        <p>${user.role.name}</p>
      </div>
      <div>
        <input type="checkbox" class="isAdmin">Admin</input>
        <button class="delete">Delete</button>
      </div>
    `
    userListContainer.appendChild(userElement)

    const deleteButton = userElement.querySelector('.delete')
    deleteButton.addEventListener('click', async () => {
      await fetchUrl(`/users/${user.id}`, 'DELETE')
      displayUsers()
      //TODO: alert
    })
    const isAdminCheckbox = userElement.querySelector('.isAdmin')
    isAdminCheckbox.checked = user.role.name === 'Admin'
    isAdminCheckbox.addEventListener('change', async () => {
      await fetchUrl(`/users/${user.id}`, 'PUT', {
        role: isAdminCheckbox.checked ? 'Admin' : 'Customer', //TODO: constant
      })
      //TODO: alert
    })
  })
}

window.addEventListener('load', async () => {
  if (!(await isUserAdmin())) {
    window.location.href = '/'
    return
  }

  displayUsers()
})
