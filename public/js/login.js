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

document.getElementById('login').addEventListener('click', (event) => {
  event.preventDefault()
  login()
})
