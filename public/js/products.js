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
      productElement.appendChild(editContainer)
      productElement.appendChild(showEditContainerButton)
    }
    productListContainer.appendChild(productElement)
  })
}

function createNewProductDiv() {
  const addProductDiv = document.createElement('div')
  const productNameField = createInput('text', '')
  const productPriceField = createInput('text', '')
  const productDescriptionField = createInput('text', '')
  const addProductButton = document.createElement('button')
  addProductButton.textContent = 'Add'
  addProductButton.onclick = async () => {
    await fetchUrl('/products', 'POST', {
      name: productNameField.value,
      price: productPriceField.value,
      description: productDescriptionField.value,
    })
    displayProducts()
  }
  addProductDiv.innerHTML = '<h4>Add new product</h4>'

  addProductDiv.appendChild(document.createTextNode('name'))
  addProductDiv.appendChild(productNameField)
  addProductDiv.appendChild(document.createElement('br'))

  addProductDiv.appendChild(document.createTextNode('price'))
  addProductDiv.appendChild(productPriceField)
  addProductDiv.appendChild(document.createElement('br'))

  addProductDiv.appendChild(document.createTextNode('description'))
  addProductDiv.appendChild(productDescriptionField)
  addProductDiv.appendChild(document.createElement('br'))

  addProductDiv.appendChild(addProductButton)
  productListContainer.appendChild(addProductDiv)
}

function createProductElement(product) {
  const productElement = document.createElement('div')
  productElement.classList.add('product')
  productElement.innerHTML = `<p>Name: ${product.name}, Price: ${product.price}</p>`

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
