import jwt from 'jsonwebtoken'

const   generateToken = (id_users) => {
  return jwt.sign({ id_users }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export default generateToken
