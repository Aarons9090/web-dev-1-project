const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

async function register() {
  console.log('register')
  try {
    const response = await fetch('http://127.0.0.1:3000/api/register', {
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
    localStorage.setItem('user', JSON.stringify(user))
    window.location.href = '/'
  } catch (error) {
    console.log(error)
  }
}

document.getElementById('register').addEventListener('click', (event) => {
  event.preventDefault()
  register()
})
