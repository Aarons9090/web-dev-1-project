const defaultPath = '/api'

module.exports = {
  ROLES: {
    CUSTOMER: 'Customer',
    ADMIN: 'Admin',
  },
  Paths: {
    DefaultPath: defaultPath,
    UserPath: `${defaultPath}/users`,
    ProductPath: `${defaultPath}/products`,
    LoginPath: `${defaultPath}/login`,
    RegisterPath: `${defaultPath}/register`,
    RolePath: `${defaultPath}/role`,
    CartPath: `${defaultPath}/cart`,
    CartAddPath: `${defaultPath}/cart/add`,
    CartRemovePath: `${defaultPath}/cart/remove`,
    CartDeletePath: `${defaultPath}/cart/delete`,
    CartEmptyPath: `${defaultPath}/cart/empty`,
    PurchasesPath: `${defaultPath}/purchases`,
    PurchasesPathUser: `${defaultPath}/purchases/user`,
    CheckoutPath: `${defaultPath}/cart/checkout`,
    UserWithIdPath: /^\/api\/users\/[a-zA-Z0-9]+$/,
    ProductWithIdPath: /^\/api\/products\/[a-zA-Z0-9]+$/,
    AuthWithIdPath: /^\/api\/auth\/[a-zA-Z0-9]+$/,
  },
  ErrorMessages: {
    InvalidCredentials: 'Invalid username or password',
    UserNotFound: 'User not found',
    UserExists: 'User already exists',
    UserCreationError: 'Error creating user',
    InvalidToken: 'Token missing or invalid',
    ProductNotFound: 'Product not found',
    CartAddError: 'Error adding product to cart',
    CartDeleteError: 'Error deleting product from cart',
    CartNotFoundError: 'Cart not found',
    PurchasesNotFound: 'Purchases not found',
    PurchasesError: 'Error getting purchases',
    RoleNotFound: 'Role not found',
    NotFound: 'Not found',
  },
  WebTokenExpirationSeconds: 60 * 60,
}
