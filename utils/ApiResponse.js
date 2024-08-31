class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 //If Api is sending response this means status code is between 100-399
    }
}

module.exports = ApiResponse