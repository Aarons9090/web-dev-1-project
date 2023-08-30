const productListContainer = document.getElementById('productList')

async function fetchProducts() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/products')
    const products = await response.json()
    return products
  } catch (error) {
    return []
  }
}

async function displayProducts() {
  const products = await fetchProducts()

  productListContainer.innerHTML = ''

  products.forEach((product) => {
    const productElement = document.createElement('div')
    productElement.classList.add('product')
    productElement.textContent = `Name: ${product.name}, Price: ${product.price}`
    productListContainer.appendChild(productElement)
  })
}

window.addEventListener('load', displayProducts)
