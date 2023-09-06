async function login() {
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')

  const response = await fetchUrl(
    '/login',
    'POST',
    {
      username: usernameInput.value,
      password: passwordInput.value,
    },
    false
  )

  if (!response) {
    showNotification('Error logging in', 'error')
    return
  }

  const user = await response.json()

  localStorage.setItem('user', JSON.stringify(user))
  window.location.href = '/'
}

document.getElementById('login').addEventListener('click', (event) => {
  event.preventDefault()
  login()
})
