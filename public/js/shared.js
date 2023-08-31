//Q: my linter thinks that this is not being used even though it is being used in other js files
//A: I think it's because it's being used in the html files, not the js files

async function login() {
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')
  try {
    const response = await fetch('http://127.0.0.1:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    })

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
