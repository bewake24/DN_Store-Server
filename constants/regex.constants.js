const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usernameRegex = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const phoneRegex = /^\d{10}$/;

const cityRegex = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/

const addressRegex = /^\d{1,6}(?:[a-zA-Z]|\s?[A-Za-z])?(?:\s[a-zA-Z\u0080-\u024F0-9.,'-]+)*(?:\s(?:Apt|Suite|Unit|#)\s?\d{0,4}[A-Za-z]?)?(?:,\s?[A-Za-z\u0080-\u024F\s]+)?(?:,\s?[A-Za-z]{2,})?(?:\s\d{5}(-\d{4})?)?$/

const pincodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;

module.exports = { emailRegex, usernameRegex, passwordRegex, nameRegex, phoneRegex, addressRegex, cityRegex, pincodeRegex };