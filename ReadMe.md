**Root Navigation:** | [Tools & Technologies](#tools-technologies) | [API End Points](#user-end-points) | [How to Run the Application](#how-to-run-the-application) | [Constants](#constants) |

**User End Points** : [Register An user](#register-an-user) | [Register An user](#register-an-user) | [Login User](#login-user) | [Logout User](#logout-user) | [Refresh Access Token](#refresh-access-token) | [Update User](#update-user) | [Update Username]

# THE DN STORE 

## TOOLS & Technologies
![Postman](https://skillicons.dev/icons?i=postman,docker,nodejs,mongodb,express)

Download Postman: [https://www.postman.com/downloads](https://www.postman.com/downloads)\
Download Docker: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)\
Download Node.js: [https://nodejs.org/en/](https://nodejs.org/en/)\
Download MongoDB: [https://www.mongodb.com/](https://www.mongodb.com/)



## How to Run the Application
- Step 0 : `cd your-root-directory` Go to the root directory of project.
- Step 1 : `npm install` Install the dependencies.
- Step 2 : Setup `.env` file
- Step 2 : Configure and start the mongodb database.
- Step 3 : `npm run dev` Start the application locally. 

## Constants
`{{serverURL}}` : Default Server link for the api.\
     e.g. `http://localhost:3000/api/v1` to run locally.

## USER END POINTS

| Name| End Point | Method |
| -----| --------- | ------ |
|Register An User | `{{serverURL}}/user/register` | POST |
|Login User | `{{serverURI}}/user/login` | POST |
|Logout User | `{{serverURI}}/user/logout` | POST |
|Refresh Access Token | `{{serverURI}}/user/refresh-access-token` | GET |
|Update User | `{{serverURI}}/user/update-user` | PATCH |
|Update Username | `{{serverURI}}/user/update-username` | PATCH |



### Register An user
`Input: `   
| Key| Type | Value |
| ---| ---- | ----- |
| username | String | test_prity |
| name | String | Prity |
| email | String | prity@test.com |
| phoneNo | String | 9123456789 |
| gender | String | MALE |
| password | String | test123 |
| avatar | File | test.png |

`Output: `
```
{
    "statusCode": 200,
    "data": {
        "_id": "6717d02705a8877943698394",
        "username": "test_prity",
        "name": "Prity",
        "email": "prity@test.com",
        "phoneNo": "9123456789",
        "gender": "MALE",
        "roles": [
            2189
        ],
        "status": "ACTIVE",
        "createdAt": "2024-10-22T16:17:43.347Z",
        "updatedAt": "2024-10-22T16:17:43.347Z",
        "__v": 0
    },
    "message": "User registered Successfully",
    "success": true
}
```

### Login An User
`Input: `
```
{
    "username": "test_prity",
    "password": "test123"
}
```

`Output: `

``` 
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "6717d02705a8877943698394",
            "username": "test_prity",
            "password": "$2b$10$CP0rHhwlTpchkfk0uIRv4.AxdbX9v30CKg97CmgrDN7lx17mz4oCy",
            "name": "Prity",
            "email": "prity@test.com",
            "phoneNo": "9123456789",
            "gender": "MALE",
            "roles": [
                2189
            ],
            "status": "ACTIVE",
            "createdAt": "2024-10-22T16:17:43.347Z",
            "updatedAt": "2024-10-22T16:25:21.819Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3ZDAyNzA1YTg4Nzc5NDM2OTgzOTQiLCJlbWFpbCI6InByaXR5QHRlc3QuY29tIiwidXNlcm5hbWUiOiJ0ZXN0X3ByaXR5Iiwicm9sZXMiOnsiQ1VTVE9NRVIiOjIxODl9LCJpYXQiOjE3Mjk2MTQzMjEsImV4cCI6MTcyOTcwMDcyMX0.8abpWlQxJJuFg89z7KTW0sGE2xVdtOzKREYZoTznzhg",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3ZDAyNzA1YTg4Nzc5NDM2OTgzOTQiLCJpYXQiOjE3Mjk2MTQzMjEsImV4cCI6MTczMDQ3ODMyMX0.EDBPMXWfg9R6Ul__s1muBlJo6H12sbDRIiqqZnw3JDE"
    },
    "message": "User logged In Successfully",
    "success": true
}
```

### Logout User
**Requirements:** User Must be logged in.

`Output:`

```
{
    "statusCode": 200,
    "data": {},
    "message": "User logged out successfully",
    "success": true
}
```


### Refresh Access Token
**Requirements:** User Must be logged in. 

`Output:`
```
{
    "statusCode": 200,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3ZDAyNzA1YTg4Nzc5NDM2OTgzOTQiLCJlbWFpbCI6InByaXR5QHRlc3QuY29tIiwidXNlcm5hbWUiOiJ0ZXN0X3ByaXR5Iiwicm9sZXMiOnsiQ1VTVE9NRVIiOjIxODl9LCJpYXQiOjE3Mjk2MTQ3MzMsImV4cCI6MTcyOTcwMTEzM30.6FDwQA2p8tjoNFIQHSPscH6we2npnedEK0-FyTaQ1NA"
    },
    "message": "New Tokens generated succesfully",
    "success": true
}
```

### Update user
**Requirements:** User Must be logged in. \
**Updatable Fields:** Name, email, phone, gender, 

`Input: ` 
| Key| Type | Value | 
| ---| ---- | ----- | 
| name | String | Prity Jinta | Yes|
| email | String | prity2@test.in |
| phoneNo | String | 9123456780 |
| gender | String | FEMALE |

`Output: `

```
{
    "statusCode": 200,
    "data": {
        "_id": "6717d02705a8877943698394",
        "username": "test_prity",
        "password": "$2b$10$CP0rHhwlTpchkfk0uIRv4.AxdbX9v30CKg97CmgrDN7lx17mz4oCy",
        "name": "Prity Jinta",
        "email": "prity2@test.in",
        "phoneNo": "9123456780",
        "gender": "FEMALE",
        "roles": [
            2189
        ],
        "status": "ACTIVE",
        "createdAt": "2024-10-22T16:17:43.347Z",
        "updatedAt": "2024-10-22T16:42:14.159Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3ZDAyNzA1YTg4Nzc5NDM2OTgzOTQiLCJpYXQiOjE3Mjk2MTUyNDAsImV4cCI6MTczMDQ3OTI0MH0.zX1rRY7k1ysWfEi39IyTV3wRSDVuUYJCz-n_khSz2pU"
    },
    "message": "User updated successfully",
    "success": true
}
```


### Update Username
**Requirements:** User Must be logged in. 

`Input: `

| Key| Value |
| ---| ----- |
| username | preety |

`Output: `
```
{
    "statusCode": 200,
    "data": {
        "_id": "6717d02705a8877943698394",
        "username": "preety",
        "password": "$2b$10$CP0rHhwlTpchkfk0uIRv4.AxdbX9v30CKg97CmgrDN7lx17mz4oCy",
        "name": "Prity",
        "email": "prity2@test.in",
        "phoneNo": "9123456780",
        "gender": "FEMALE",
        "roles": [
            2189
        ],
        "status": "ACTIVE",
        "createdAt": "2024-10-22T16:17:43.347Z",
        "updatedAt": "2024-10-23T04:56:09.497Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3ZDAyNzA1YTg4Nzc5NDM2OTgzOTQiLCJpYXQiOjE3Mjk2NTkzNTMsImV4cCI6MTczMDUyMzM1M30.hj1E-o7d8pY4yTPLU6QgHashG4Z9aKL-ZOV2MGs6rOA"
    },
    "message": "User updated successfully",
    "success": true
} 
```