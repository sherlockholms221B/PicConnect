export const user = () => {
  const user = JSON.parse(localStorage.getItem('profile'))

  return user
}
