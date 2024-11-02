const invalidFieldMessage = (err) => {
    let message = {};
    Object.keys(err.errors).forEach((key) => {
        message[key] = err.errors[key].message;
    });
    return message;
}

module.exports = invalidFieldMessage;