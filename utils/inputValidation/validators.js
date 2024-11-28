const validateUsername = (input) => {
  const pattern = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;
  console.log(input);
  const trimmedUsername = input.trim();
  return pattern.test(trimmedUsername) ? trimmedUsername : false;
};

module.exports = {
  validateUsername,
};
