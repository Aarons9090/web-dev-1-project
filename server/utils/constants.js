const defaultPath = '/api'

module.exports = {
  ROLES: {
    CUSTOMER: 'Customer',
    ADMIN: 'Admin',
  },
  DefaultPath: defaultPath,
  UserPath: `${defaultPath}/users`,
  UserWithIdPath: /^\/api\/users\/[a-zA-Z0-9]+$/,
}
