const rolesObjectToArray = (usersObject) => {
  if (Array.isArray(usersObject)) {
    return usersObject.map((userObject) => ({
      ...userObject,
      roles: Object.values(userObject.roles),
    }));
  } else {
    return {
      ...usersObject,
      roles: Object.values(usersObject.roles),
    };
  }
};

module.exports = rolesObjectToArray;
