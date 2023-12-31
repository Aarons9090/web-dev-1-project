const productListContainer = document.getElementById('productList')
const productInfoContainer = document.getElementById('productInfo')
const productHeader = document.getElementById('product-header')

async function fetchProducts() {
  try {
    const res = await fetchUrl('/products', 'GET')
    if (!res) {
      showNotification('Error fetching products', 'error')
      return []
    }
    const products = await res.json()
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
  productHeader.style.display = 'none'
  document.getElementById('new-product-container').innerHTML = ''
  const productTemplate = document.getElementById('single-product-template')
  const productElement = document.importNode(productTemplate.content, true)
  productElement.querySelector('.product-name').textContent = product.name
  productElement.querySelector(
    '.product-price'
  ).textContent = `${product.price} €`
  productElement.querySelector('.product-description').textContent =
    product.description

  productElement.querySelector('.buy-button').onclick = async () => {
    const res = await fetchUrl('/cart/add', 'POST', { productId: product.id })
    if (!res) {
      showNotification('Error adding to cart', 'error')
      return
    }
    showNotification('Added to cart!', 'success')
    populateLinks()
  }

  productInfoContainer.appendChild(productElement)
}

async function displayProducts() {
  const products = await fetchProducts()
  const isAdmin = await isUserAdmin()

  productHeader.style.display = 'flex'
  productInfoContainer.innerHTML = ''
  productListContainer.innerHTML = ''

  if (isAdmin) {
    document.getElementById('new-product-container').innerHTML = ''
    createNewProductDiv()
  }

  products.forEach(async (product) => {
    const productElement = createProductElement(product, isAdmin)
    const editContainer = createEditContainer(product)

    if (isAdmin) {
      const showEditContainerButton = createShowEditButton(editContainer)

      productElement
        .querySelector('.product-action')
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
    const res = await fetchUrl('/products', 'POST', {
      name: newProductNameField.value,
      price: newProductPriceField.value,
      description: newProductDescriptionField.value,
    })

    if (!res) {
      showNotification('Error creating product', 'error')
      return
    }
    showNotification('Product created', 'success')
    displayProducts()
  }

  document.getElementById('new-product-container').appendChild(newProductDiv)
}

function createProductElement(product, isAdmin) {
  const productTemplate = document.getElementById('product-template')
  const productElement = document.importNode(productTemplate.content, true)
  const productName = productElement.querySelector('.product-name')
  const productPrice = productElement.querySelector('.product-price')
  const productDescription = productElement.querySelector(
    '.product-description'
  )
  const editDiv = productElement.querySelector('.product-action')
  if (!isAdmin) {
    const buyButton = document.createElement('button')
    buyButton.textContent = 'shopping_cart'
    buyButton.classList.add('buy-button-small')
    buyButton.classList.add('material-icons')
    buyButton.onclick = async () => {
      const res = await fetchUrl('/cart/add', 'POST', { productId: product.id })
      if (!res) {
        showNotification('Error adding to cart', 'error')
        return
      }
      showNotification('Added to cart!', 'success')
      populateLinks()
    }
    editDiv.appendChild(buyButton)
  }

  productName.textContent = product.name
  productPrice.textContent = `${product.price} €`
  productDescription.textContent = product.description
  productName.onclick = () => {
    window.history.pushState(product.id, '', `/products/${product.id}`)
    displaySingleProduct()
  }
  productPrice.onclick = () => {
    window.history.pushState(product.id, '', `/products/${product.id}`)
    displaySingleProduct()
  }
  productDescription.onclick = () => {
    window.history.pushState(product.id, '', `/products/${product.id}`)
    displaySingleProduct()
  }

  return productElement
}

function createEditContainer(product) {
  const editContainer = document.createElement('div')
  editContainer.classList.add('edit-container')
  editContainer.style.display = 'none'

  const editNameField = createInput('text', product.name)
  const editPriceField = createInput('number', product.price)
  const editDescriptionField = createInput('text', product.description)
  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.onclick = async () => {
    const res = await fetchUrl(`/products/${product.id}`, 'DELETE')
    if (!res) {
      showNotification('Error deleting product', 'error')
      return
    }
    showNotification('Product deleted', 'success')
    displayProducts()
  }

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
  editContainer.appendChild(deleteButton)

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
    const res = await fetchUrl(`/products/${product.id}`, 'PUT', {
      name: nameField.value,
      price: priceField.value,
      description: descriptionField.value,
    })
    if (!res) {
      showNotification('Error updating product', 'error')
      return
    }
    showNotification('Product updated', 'success')
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
