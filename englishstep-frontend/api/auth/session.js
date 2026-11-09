// GET /api/auth/session → trả người dùng hiện tại từ cookie phiên (frontend gọi khi tải trang)
import { parseCookies, readToken } from '../_lib/auth.js'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const s = readToken(parseCookies(req).session)
  if (!s) return res.status(401).json({ error: { code: 'SESSION_REVOKED', message: 'Chưa đăng nhập hoặc phiên đã hết hạn' } })
  const { id, email, name, picture, provider } = s
  res.status(200).json({ user: { id, email, name, picture, provider } })
}
