const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usernameRegex = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const phoneRegex = /^\d{10}$/;

const cityRegex =
  /^[a-zA-Z\u0080-\u024F]+(?:[.\-'\s]*[a-zA-Z\u0080-\u024F]+)*$/;

const addressRegex = /^(\d+\s)?[A-Za-z0-9\s,.-]+$/;

const pincodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;

const productNameRegex = /^[a-zA-Z0-9\s\-,:'./()&‑]+$/;

module.exports = {
  emailRegex,
  usernameRegex,
  passwordRegex,
  nameRegex,
  phoneRegex,
  addressRegex,
  cityRegex,
  pincodeRegex,
  productNameRegex,
};
