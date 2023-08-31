const userListContainer = document.getElementById('userList')

async function fetchUsers() {
  try {
    //Q: how do i add the authorization header?
    //A: add the header to the fetch call
    //Q: how do i get the token?
    //A: get the token from localStorage

    const response = await fetch('http://127.0.0.1:3000/api/users', {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('user')).token
        }`,
      },
    })
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
