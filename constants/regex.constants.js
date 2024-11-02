const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usernameRegex = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const phoneRegex = /^\d{10}$/;

module.exports = { emailRegex, usernameRegex, passwordRegex, nameRegex, phoneRegex};