class ApiResponse{
    constructor(data,statusCode,message="success" ){
        this.data=data;
        this.statusCode=statusCode;
        this.messgae=message;
        this.success=statusCode <400
    }
}
export default ApiResponse