// GET /api/auth/google/login      → chuyển sang Google
// GET /api/auth/google/callback   → nhận code, đổi token, tạo phiên (tương tự cho facebook)
import { randomBytes } from 'node:crypto'
import { cookie, makeToken, parseCookies, readToken, setCookies } from '../../_lib/auth.js'

const WEEK = 7 * 24 * 3600

const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
    extra: { prompt: 'select_account' },
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    toProfile: (j) => ({ id: j.sub, email: j.email_verified ? j.email : null, name: j.name, picture: j.picture })
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    userUrl: 'https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.type(large)',
    scope: 'email,public_profile',
    extra: {},
    clientId: () => process.env.FACEBOOK_APP_ID,
    clientSecret: () => process.env.FACEBOOK_APP_SECRET,
    toProfile: (j) => ({ id: j.id, email: j.email ?? null, name: j.name, picture: j.picture?.data?.url })
  }
}

// Chỉ cho phép quay về đường dẫn nội bộ (tránh open redirect)
const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : '/')

export default async function handler(req, res) {
  const { provider, action } = req.query
  const p = PROVIDERS[provider]
  if (!p || req.method !== 'GET') return res.status(404).end()

  // redirect_uri phải khớp từng ký tự với URI đã đăng ký ở Google/Facebook → dùng APP_URL cố định
  const redirectUri = `${(process.env.APP_URL ?? '').replace(/\/$/, '')}/api/auth/${provider}/callback`

  if (action === 'login') {
    if (!p.clientId() || !p.clientSecret() || !process.env.APP_URL) return res.redirect(302, '/login?error=config')
    const state = randomBytes(16).toString('hex')
    setCookies(res, [cookie('oauth_state', makeToken({ state, provider, next: safeNext(req.query.next) }, 600), 600)])
    const q = new URLSearchParams({ client_id: p.clientId(), redirect_uri: redirectUri, response_type: 'code', scope: p.scope, state, ...p.extra })
    return res.redirect(302, `${p.authUrl}?${q}`)
  }

  if (action === 'callback') {
    const saved = readToken(parseCookies(req).oauth_state)
    const clearState = cookie('oauth_state', '', 0)
    const fail = () => {
      setCookies(res, [clearState])
      return res.redirect(302, '/login?error=oauth_failed')
    }
    const { code, state } = req.query
    if (!code || !saved || saved.state !== state || saved.provider !== provider) return fail() // chống CSRF

    try {
      // client secret chỉ được dùng ở đây, trên server
      const tokenRes = await fetch(p.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({ code, client_id: p.clientId(), client_secret: p.clientSecret(), redirect_uri: redirectUri, grant_type: 'authorization_code' })
      })
      const tok = await tokenRes.json()
      if (!tokenRes.ok || !tok.access_token) return fail()

      const userRes = await fetch(p.userUrl, { headers: { Authorization: `Bearer ${tok.access_token}` } })
      const profile = p.toProfile(await userRes.json())
      if (!userRes.ok || !profile.id) return fail()

      const user = { id: `${provider}:${profile.id}`, email: profile.email, name: profile.name, picture: profile.picture, provider }
      setCookies(res, [clearState, cookie('session', makeToken(user, WEEK), WEEK)])
      return res.redirect(302, saved.next)
    } catch {
      return fail()
    }
  }

  return res.status(404).end()
}
