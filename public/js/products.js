const productListContainer = document.getElementById('productList')
const productInfoContainer = document.getElementById('productInfo')
//TODO: put the fetch calls in a separate file
async function fetchProducts() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/products', {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('user')).token
        }`,
      },
    })
    const products = await response.json()
    return products
  } catch (error) {
    return []
  }
}

async function fetchProduct() {
  try {
    const productId = window.history.state
    const response = await fetch(
      `http://127.0.0.1:3000/api/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('user')).token
          }`,
        },
      }
    )
    const product = await response.json()
    return product
  } catch (error) {
    return {}
  }
}

async function displaySingleProduct() {
  const product = await fetchProduct()

  productInfoContainer.innerHTML = ''
  productListContainer.innerHTML = ''
  const productElement = document.createElement('div')
  productElement.classList.add('product')
  productElement.textContent = `Name: ${product.name}, Price: ${product.price} ${product.description}`
  productInfoContainer.appendChild(productElement)
}

async function displayProducts() {
  const products = await fetchProducts()

  productListContainer.innerHTML = ''
  productInfoContainer.innerHTML = ''

  products.forEach((product) => {
    const productElement = document.createElement('div')
    productElement.classList.add('product')
    productElement.onclick = (event) => {
      event.preventDefault()
      window.history.pushState(product.id, '', `/products/${product.id}`)
      displaySingleProduct()
    }
    productElement.textContent = `Name: ${product.name}, Price: ${product.price}`
    productListContainer.appendChild(productElement)
  })
}

window.addEventListener('popstate', (event) => {
  if (event.state) {
    displaySingleProduct()
  } else {
    displayProducts()
  }
})

function render() {
  if (window.history.state) {
    displaySingleProduct()
  } else {
    displayProducts()
  }
}

window.addEventListener('load', () => {
  window.history.replaceState(null, '', '')
  render()
})
