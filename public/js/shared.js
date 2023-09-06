/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const baseUrl = 'http://127.0.0.1:3000/api'

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

    if (!response.ok) {
      throw new Error(`${response.status} An error occurred`)
    }

    return response
  } catch (error) {
    console.log(error)
    return false
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

async function isUserAdmin() {
  const role = await getUserRole()
  return role.role === 'Admin'
}
