export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // 1. Đổi code lấy access token từ Facebook
    const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.APP_URL}/api/auth/facebook/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`);
    const tokenData = await tokenRes.json();

    if (tokenData.error) throw new Error(tokenData.error.message);

    // 2. Lấy thông tin user từ Facebook
    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`);
    const userData = await userRes.json();

    // 3. Chuyển hướng về trang chủ kèm email
    res.redirect(`/login?next=/practice&email=${encodeURIComponent(userData.email || '')}`);
  } catch (error) {
    res.status(500).json({ error: 'Facebook Auth Failed: ' + error.message });
  }
}