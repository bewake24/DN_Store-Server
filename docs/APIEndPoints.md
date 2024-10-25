## API ENDPOINTS

## USER END POINTS

| Name| End Point | Method |
| -----| --------- | ------ |
|Register An User | `{{serverURL}}/user/register` | POST |
|Login User | `{{serverURI}}/user/login` | POST |
|Logout User | `{{serverURI}}/user/logout` | POST |
|Refresh Access Token | `{{serverURI}}/user/refresh-access-token` | GET |
|Update User | `{{serverURI}}/user/update-user` | PATCH |
|Update Username | `{{serverURI}}/user/update-username` | PATCH |
|Get All User | `{{serverURI}}/user/get-all-users` | GET |
|Get Users By Roles | `{{serverURI}}/user/get-users?roles=role-1,role-2` | GET |


## Address End Points

| Name| End Point | Method |
| -----| --------- | ------ |
|Add An Address | `{{serverURI}}/user/add-an-address` | POST |
|Get User Addresses | `{{serverURI}}/address/get-user-addresses` | GET |
|Update An Address | `{{serverURI}}/address/update/address-Id` | PATCH |
|Delete An Address | `{{serverURI}}/address/delete/address-Id` | DELETE |

## Roles End Points

| Name| End Point | Method |
| -----| --------- | ------ |
|Assign Roles | `{{serverURI}}/role/assign-roles/user-Id` | PATCH |
|Revoke Role | `{{serverURI}}/role/revoke-roles/user-Id` | PATCH |