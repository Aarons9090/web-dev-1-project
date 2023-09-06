const userListContainer = document.getElementById('userList')

async function fetchUsers() {
  try {
    const res = await fetchUrl('/users', 'GET')
    if (!res) {
      showNotification('Error fetching users', 'error')
      return []
    }
    const users = await res.json()
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
      const res = await fetchUrl(`/users/${user.id}`, 'DELETE')
      if (!res) {
        showNotification('Error deleting user', 'error')
        return
      }
      showNotification('User deleted', 'success')
      displayUsers()
    })
    const isAdminCheckbox = userElement.querySelector('.isAdmin')
    isAdminCheckbox.checked = user.role.name === 'Admin'
    isAdminCheckbox.addEventListener('change', async () => {
      const res = await fetchUrl(`/users/${user.id}`, 'PUT', {
        role: isAdminCheckbox.checked ? 'Admin' : 'Customer', //TODO: constant
      })
      if (!res) {
        showNotification('Error updating user', 'error')
        return
      }
      showNotification('User updated', 'success')
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
