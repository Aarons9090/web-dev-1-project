const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

async function register() {
  const response = await fetchUrl(
    '/register',
    'POST',
    {
      username: usernameInput.value,
      password: passwordInput.value,
    },
    false
  )

  if (!response) {
    showNotification('Error registering. Username must be unique', 'error')
    return
  }

  login()
}

document.getElementById('register').addEventListener('click', (event) => {
  event.preventDefault()
  register()
})
