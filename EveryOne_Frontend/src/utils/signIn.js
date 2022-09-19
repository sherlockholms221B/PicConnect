export const userQuery = ({ email, password }) => {
  const query = `*[_type == "user" && email =='${email}' && password =='${password}']`

  return query
}
