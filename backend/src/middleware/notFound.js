// 404 handler for unmatched routes.
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `Không tìm thấy route: ${req.method} ${req.originalUrl}` },
  })
}

export default notFound
