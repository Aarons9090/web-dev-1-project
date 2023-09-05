const defaultPath = '/api'

module.exports = {
  ROLES: {
    CUSTOMER: 'Customer',
    ADMIN: 'Admin',
  },
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
  WebTokenExpirationSeconds: 60 * 60,
}
