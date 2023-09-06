/* eslint-disable no-unused-vars */

function showNotification(message, type) {
  var notification = document.getElementById('notification')
  notification.innerHTML = message
  notification.className = 'notification ' + type
  notification.style.display = 'block'
  setTimeout(function () {
    notification.style.display = 'none'
  }, 3000)
}
