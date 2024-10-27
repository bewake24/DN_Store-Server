## ROLES END POINTS

| Name| End Point | Method |
| -----| --------- | ------ |
|Assign Roles | `{{serverURI}}/role/assign-roles/user-Id` | PATCH |
|Revoke Roles | `{{{serverURI}}/role/revoke-roles/user-Id` | GET |


### Assign Roles

**Requirements:** User assigning roles to a person must have admin previleges.

`Input: `
| Key| Type | Value |
| ---| ---- | ----- |
| roles | Number | 5134 |
| roles | Number | 2065 |

`Output:`
```json
{
    "statusCode": 200,
    "data": {
        "roles": [
            2189,
            5134,
            2065
        ],
        "_id": "6717d02705a8877943698394",
        "name": "Prity",
        "updatedAt": "2024-10-27T14:51:43.265Z"
    },
    "message": "User updated successfully",
    "success": true
}
```


### Revoke Roles

**Requirements:** User revoking roles to a person must have admin previleges.

`Input: `

| Key| Type | Value |
| ---| ---- | ----- |
| roles | Number | 5134 |
| roles | Number | 2065 |

`Output:`
```json
{
    "statusCode": 200,
    "data": {
        "roles": [
            2189
        ],
        "_id": "6717d02705a8877943698394",
        "name": "Prity",
        "updatedAt": "2024-10-27T14:57:50.671Z"
    },
    "message": "User role revoked successfully",
    "success": true
}
```