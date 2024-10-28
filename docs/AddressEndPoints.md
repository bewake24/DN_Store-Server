## ADDRESSES

### Constants
**ADDRESS_ID**: ID of the address in collection

### ENUMS
**addressType:** `HOME`, `WORK`


### ADDRESS END POINTS

| Name| End Point | Method |
| -----| --------- | ------ |
|Add An Address | `{{serverURI}}/address/add-an-address` | POST |
|Get User Addresses | `{{serverURI}}/address/get-user-addresses` | GET |
|Update An Address | `{{serverURI}}/address/update/ADDRESS_ID` | PUT |
|Delete An Address | `{{serverURI}}/address/delete/ADDRESS_ID` | DELETE |

### Add An Address

Body type: x-www-form-urlencoded

`Input: `
| Key| Type | Value |
| ---| ---- | ----- |
| name | String | Prity |
| phoneNo | String | 9123456789 |
| pinCode | String | 110001 |
| address | String | 123, ABC Street |
| city | String | Delhi |
| addressState | String | Delhi |

`Output: `
```json
{
    "statusCode": 200,
    "data": {
        "userId": "6717d02705a8877943698394",
        "name": "Prity",
        "phoneNo": "912345678",
        "pinCode": "110001",
        "address": "123, ABC street",
        "city": "Delhi",
        "addressState": "Delhi",
        "addressType": "HOME",
        "isDefault": true,
        "_id": "671f10dd6cb6756997abf430",
        "createdAt": "2024-10-28T04:19:41.213Z",
        "updatedAt": "2024-10-28T04:19:41.213Z",
        "__v": 0
    },
    "message": "Address added successfully",
    "success": true
}
```


### Get User Addresses
**Requirements:** User Must be logged in.

`Output: `
```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "671f10dd6cb6756997abf430",
            "name": "Prity",
            "phoneNo": "912345678",
            "pinCode": "110001",
            "address": "123, ABC street",
            "city": "Delhi",
            "addressState": "Delhi",
            "addressType": "HOME",
            "isDefault": true,
            "__v": 0
        }
    ],
    "message": "All addresses for user Prity fetched successfully",
    "success": true
}
```

### Update An Address

**Requirements:** User Must be logged in. \
**Updatable Fields:** name, phoneNo, pinCode, address, city, addressState, addressType, isDefault \
**Body type:** x-www-form-urlencoded

`Input: `
| Key| Type | Value |
| ---| ---- | ----- |
| name | String | Prity Jinta|
| addressType | Enum  | WORK |

`Output: `
```json
{
    "statusCode": 200,
    "data": {
        "_id": "671f10dd6cb6756997abf430",
        "userId": "6717d02705a8877943698394",
        "name": "Preety",
        "phoneNo": "912345678",
        "pinCode": "110001",
        "address": "123, ABC street",
        "city": "Delhi",
        "addressState": "Delhi",
        "addressType": "WORK",
        "isDefault": true,
        "createdAt": "2024-10-28T04:19:41.213Z",
        "updatedAt": "2024-10-28T04:42:05.642Z",
        "__v": 0
    },
    "message": "Address updated successfully",
    "success": true
}
```

### Delete An Address

**Requirements:** User Must be logged in.

`Output: `
```json
{
    "statusCode": 200,
    "data": {
        "_id": "671f10dd6cb6756997abf430",
        "userId": "6717d02705a8877943698394",
        "name": "Preety",
        "phoneNo": "912345678",
        "pinCode": "110001",
        "address": "123, ABC street",
        "city": "Delhi",
        "addressState": "Delhi",
        "addressType": "WORK",
        "isDefault": true,
        "createdAt": "2024-10-28T04:19:41.213Z",
        "updatedAt": "2024-10-28T04:42:05.642Z",
        "__v": 0
    },
    "message": "Address deleted successfully",
    "success": true
}
```