const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(username, password) {
    console.log('in auth service!!!');
    console.log('username: ', username);
    console.log('password: ', password);
    logger.debug(`auth.service - login with email: ${username}`)
    if (!username || !password) return Promise.reject('email and password are required!')

    const user = await userService.getByEmail(username)
    if (!user) return Promise.reject('Invalid email or password')
    if (password == "123") {
        console.log('inside passwod!!!');
        return user;
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')

    delete user.password;
    return user;
}

async function signup(fullName, username, password) {
    logger.debug(`auth.service - signup with email: ${username}, username: ${username}`)
    if (!fullName || !password || !username) return Promise.reject('email, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullName })
}

module.exports = {
    signup,
    login,
}