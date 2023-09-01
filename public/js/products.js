const productListContainer = document.getElementById('productList')
const productInfoContainer = document.getElementById('productInfo')

async function fetchProducts() {
  try {
    const response = await fetchUrl('/products', 'GET')
    const products = await response.json()
    return products
  } catch (error) {
    return []
  }
}

async function fetchProduct() {
  try {
    const productId = window.history.state
    const response = await fetchUrl(`/products/${productId}`, 'GET')
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
  const isAdmin = await isUserAdmin()
  productListContainer.innerHTML = ''
  productInfoContainer.innerHTML = ''

  if (isAdmin) {
    createNewProductDiv()
  }

  products.forEach(async (product) => {
    const productElement = createProductElement(product)
    if (isAdmin) {
      const editContainer = createEditContainer(product)
      const showEditContainerButton = createShowEditButton(editContainer)
      productElement.querySelector('.product').appendChild(editContainer)
      productElement
        .querySelector('.product')
        .appendChild(showEditContainerButton)
    }
    productListContainer.appendChild(productElement)
  })
}

function createNewProductDiv() {
  const newProductTemplate = document.getElementById('new-product-form')
  const newProductDiv = document.importNode(newProductTemplate.content, true)
  const newProductButton = newProductDiv.querySelector('button')
  const newProductNameField = newProductDiv.getElementById('name')
  const newProductPriceField = newProductDiv.getElementById('price')
  const newProductDescriptionField = newProductDiv.getElementById('description')

  newProductButton.onclick = async () => {
    await fetchUrl('/products', 'POST', {
      name: newProductNameField.value,
      price: newProductPriceField.value,
      description: newProductDescriptionField.value,
    })
    displayProducts()
  }

  productListContainer.appendChild(newProductDiv)
}

function createProductElement(product) {
  const productTemplate = document.getElementById('product-template')
  const productElement = document.importNode(productTemplate.content, true)
  const productName = productElement.querySelector('.product-name')
  const productPrice = productElement.querySelector('.product-price')
  const productDescription = productElement.querySelector(
    '.product-description'
  )

  productName.textContent = product.name
  productPrice.textContent = product.price
  productDescription.textContent = product.description

  return productElement
}

function createEditContainer(product) {
  const editContainer = document.createElement('div')
  editContainer.style.display = 'none'

  const editNameField = createInput('text', product.name)
  const editPriceField = createInput('text', product.price)
  const editDescriptionField = createInput('text', product.description)

  const editButton = createEditButton(
    product,
    editNameField,
    editPriceField,
    editDescriptionField
  )

  editContainer.appendChild(editNameField)
  editContainer.appendChild(editPriceField)
  editContainer.appendChild(editDescriptionField)
  editContainer.appendChild(editButton)

  return editContainer
}

function createInput(type, value) {
  const input = document.createElement('input')
  input.type = type
  input.value = value
  return input
}

function createEditButton(product, nameField, priceField, descriptionField) {
  const editButton = document.createElement('button')
  editButton.textContent = 'Save'

  editButton.onclick = async () => {
    await fetchUrl(`/products/${product.id}`, 'PUT', {
      name: nameField.value,
      price: priceField.value,
      description: descriptionField.value,
    })
    displayProducts()
  }

  return editButton
}

function createShowEditButton(editContainer) {
  const showEditContainerButton = document.createElement('button')
  showEditContainerButton.textContent = 'Edit'

  showEditContainerButton.onclick = () => {
    editContainer.style.display =
      editContainer.style.display === 'none' ? 'block' : 'none'
    showEditContainerButton.textContent =
      showEditContainerButton.textContent === 'Edit' ? 'Hide' : 'Edit'
  }

  return showEditContainerButton
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
