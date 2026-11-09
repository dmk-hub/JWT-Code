// POST /api/auth/logout → xóa cookie phiên
import { cookie, setCookies } from '../_lib/auth.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  setCookies(res, [cookie('session', '', 0)])
  res.status(200).json({ ok: true })
}
