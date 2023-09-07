const logoutButton = document.getElementById('logout')

logoutButton.addEventListener('click', (event) => {
  event.preventDefault()
  localStorage.removeItem('user')
  window.location.href = '/login.html'
})

window.addEventListener('load', () => {
  //check if user is logged in
  if (!localStorage.getItem('user')) {
    window.location.href = '/login.html'
    return
  }
})
