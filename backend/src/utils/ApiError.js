// Operational error carrying an HTTP status code and optional field details.
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
  }

  static badRequest(message = 'Yêu cầu không hợp lệ', details) {
    return new ApiError(400, message, details)
  }
  static unauthorized(message = 'Chưa xác thực') {
    return new ApiError(401, message)
  }
  static forbidden(message = 'Không có quyền truy cập') {
    return new ApiError(403, message)
  }
  static notFound(message = 'Không tìm thấy') {
    return new ApiError(404, message)
  }
  static conflict(message = 'Dữ liệu đã tồn tại') {
    return new ApiError(409, message)
  }
}

export default ApiError
