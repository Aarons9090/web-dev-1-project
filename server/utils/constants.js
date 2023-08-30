const defaultPath = '/api'

module.exports = {
  ROLES: {
    CUSTOMER: 'Customer',
    ADMIN: 'Admin',
  },
  DefaultPath: defaultPath,
  UserPath: `${defaultPath}/users`,
  ProductPath: `${defaultPath}/products`,
  UserWithIdPath: /^\/api\/users\/[a-zA-Z0-9]+$/,
  ProductWithIdPath: /^\/api\/products\/[a-zA-Z0-9]+$/,
}
