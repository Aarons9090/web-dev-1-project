const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

async function register() {
  try {
    const response = await fetchUrl(
      '/register',
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

    login()
  } catch (error) {
    console.log(error)
  }
}

document.getElementById('register').addEventListener('click', (event) => {
  event.preventDefault()
  register()
})
