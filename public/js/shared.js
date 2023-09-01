const baseUrl = 'http://127.0.0.1:3000/api'

async function login() {
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')
  try {
    const response = await fetchUrl(
      '/login',
      'POST',
      {
        username: usernameInput.value,
        password: passwordInput.value,
      },
      false
    )

    const user = await response.json()

    if (user.error) {
      console.log(user.error)
      return
    }

    localStorage.setItem('user', JSON.stringify(user))
    window.location.href = '/'
  } catch (error) {
    console.log(error)
  }
}

async function fetchUrl(url, method, body = null, isAuthenticated = true) {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: isAuthenticated
          ? `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          : '',
      },
      body: body ? JSON.stringify(body) : null,
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

async function getUserRole() {
  try {
    const response = await fetchUrl('/role', 'GET')
    const role = await response.json()
    if (role.error) {
      console.log(role.error)
      return
    }
    return role
  } catch (error) {
    console.log(error)
  }
}
