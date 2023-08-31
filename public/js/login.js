const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

async function login() {
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
    console.log('🚀 ~ login ~ user:', user)

    localStorage.setItem('user', JSON.stringify(user))
    //window.location.href = '/'
  } catch (error) {
    console.log(error)
  }
}

document.getElementById('login').addEventListener('click', (event) => {
  event.preventDefault()
  login()
})
