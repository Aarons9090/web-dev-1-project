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
  const productElement = document.createElement('div')
  productElement.classList.add('product')
  productElement.textContent = `Name: ${product.name}, Price: ${product.price} ${product.description}`
  productInfoContainer.appendChild(productElement)
}

async function displayProducts() {
  const products = await fetchProducts()
  const isAdmin = await isUserAdmin()

  productInfoContainer.innerHTML = ''

  if (isAdmin) {
    createNewProductDiv()
  }

  products.forEach(async (product) => {
    const productElement = await createProductElement(product)
    const editContainer = createEditContainer(product)

    if (isAdmin) {
      const showEditContainerButton = createShowEditButton(editContainer)

      productElement
        .querySelector('.product-edit')
        .appendChild(showEditContainerButton)

      productElement
        .querySelector('.product-actions')
        .appendChild(editContainer)
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

  document.getElementById('new-product-container').appendChild(newProductDiv)
}

async function createProductElement(product) {
  const productTemplate = document.getElementById('product-template')
  const productElement = document.importNode(productTemplate.content, true)
  const productName = productElement.querySelector('.product-name')
  const productPrice = productElement.querySelector('.product-price')
  const productDescription = productElement.querySelector(
    '.product-description'
  )
  const editDiv = productElement.querySelector('.product-edit')
  if (!(await isUserAdmin())) {
    const buyButton = document.createElement('button')
    buyButton.textContent = 'Buy'
    editDiv.appendChild(buyButton)
  }

  productName.textContent = product.name
  productPrice.textContent = product.price
  productDescription.textContent = product.description

  return productElement
}

function createEditContainer(product) {
  const editContainer = document.createElement('div')
  editContainer.classList.add('edit-container')
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
  const showEditContainerButton = document.createElement('i')
  showEditContainerButton.classList.add('material-icons')
  showEditContainerButton.textContent = 'edit'
  showEditContainerButton.style.cursor = 'pointer'

  showEditContainerButton.onclick = () => {
    editContainer.style.display =
      editContainer.style.display === 'none' ? 'flex' : 'none'
    showEditContainerButton.textContent =
      showEditContainerButton.textContent === 'edit'
        ? 'keyboard_arrow_up'
        : 'edit'
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
