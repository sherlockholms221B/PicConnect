export default {
  name: 'user',
  titil: 'User',
  type: 'document',
  fields: [
    { name: 'firstName', title: 'FirstName', type: 'string' },
    { name: 'lastName', title: 'lastName', type: 'string' },
    { name: 'email', title: 'Emial', type: 'string' },
    { name: 'password', title: 'Password', type: 'string' },
    { name: 'repeatPassword', title: 'Repeat Password', type: 'string' },
    {
      name: 'image',
      title: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'backgoundImage',
      title: 'backgoundImage',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
