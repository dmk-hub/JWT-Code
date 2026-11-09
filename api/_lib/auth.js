import { createHmac, timingSafeEqual } from 'node:crypto'

const secret = () => {
  if (!process.env.SESSION_SECRET) throw new Error('Thiếu biến môi trường SESSION_SECRET')
  return process.env.SESSION_SECRET
}
const sign = (data) => createHmac('sha256', secret()).update(data).digest('base64url')

// Token tự ký (HMAC-SHA256): dùng cho cookie phiên đăng nhập và cookie `state` chống CSRF
export function makeToken(payload, maxAgeSec) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSec })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function readToken(token) {
  const [body, sig] = (token ?? '').split('.')
  if (!body || !sig) return null
  const a = Buffer.from(sig)
  const b = Buffer.from(sign(body))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString())
    return data.exp > Date.now() / 1000 ? data : null
  } catch {
    return null
  }
}

export function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie ?? '').split(';').map((c) => c.trim().split(/=(.*)/s).slice(0, 2)).filter(([k]) => k)
  )
}

// httpOnly: JavaScript phía trình duyệt không đọc được; Lax: vẫn gửi khi được redirect về từ Google/Facebook
export const cookie = (name, value, maxAge) => `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
export const setCookies = (res, list) => res.setHeader('Set-Cookie', list)
