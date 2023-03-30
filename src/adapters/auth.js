import { getUserByUsername } from "./database/views/user";
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const isPasswordValid = (passwordA, passwordB) => bcrypt.compareSync(passwordA, passwordB);

const generateJWT = payload => new Promise((resolve, reject) => {
  jwt.sign(
    payload,
    process.env.JWT_SECERT,
    { expiresIn: '1d' },
    (err, token) =>
      err ? reject('Error generating JWT') : resolve(token)
  )
});

export const loginUser = (username, password) => getUserByUsername(username)
  .then(user => user && user.status === "active" && isPasswordValid(password, user.password)
    ? user
    : Promise.reject(`Invalid credentials`))
  .then(dbUser => ({
    _id: dbUser._id,
    username: dbUser.username,
    accountId: dbUser.accountId
  }))
  .then(user => Promise.all([
    Promise.resolve(user),
    generateJWT(user)
  ]))
  .then(([user, jwt]) => ({ user, jwt }))

export const verifyToken = token => {
  if (!token) return Promise.reject("Missing Token");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECERT);
    return Promise.resolve(payload);
  } catch (error) {
    return Promise.reject("Invalid Token");
  }
}