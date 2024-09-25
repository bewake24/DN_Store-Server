const ROLES_LIST = require("../config/rolesList");

const rolesArrayToObject = (roles) => {
  const rolesInSchemaForm = {};
  if (Array.isArray(roles)) {
    roles.forEach((roleValue) => {
      for (const roleName in ROLES_LIST) {
        if (ROLES_LIST[roleName] === roleValue) {
          rolesInSchemaForm[roleName] = roleValue;
        }
      }
    });
  }
  return rolesInSchemaForm;
};

module.exports = rolesArrayToObject;
