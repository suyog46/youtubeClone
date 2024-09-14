class ApiResponse{
    constructor(data,statusCode,message="success" ){
        this.data=data;
        this.statusCode=statusCode;
        this.messgae=message;
        this.success=true
    }
}
export default ApiResponse