import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import LoginView from './views/LoginView.vue'
import PracticeView from './views/PracticeView.vue'
import ProfileView from './views/ProfileView.vue'
import PaymentView from './views/PaymentView.vue'
import JwtConsoleView from './views/JwtConsoleView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/practice' },
    { path: '/login', component: LoginView },
    { path: '/practice', component: PracticeView },
    { path: '/profile', component: ProfileView },
    { path: '/payment', component: PaymentView },
    { path: '/jwt-console', component: JwtConsoleView }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 1. KIỂM TRA TOKEN TRÊN URL (Dành cho trường hợp Google/Facebook redirect về)
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    // Lưu token vào localStorage ngay lập tức
    localStorage.setItem('token', tokenFromUrl);
    
    // Nếu đang ở trang login, chuyển thẳng vào trang practice
    if (to.path === '/login') {
      return '/practice';
    }
  }

  // 2. LOGIC CŨ CỦA BẠN (Giữ nguyên)
  if (!auth.ready) await auth.restore()
  if (!auth.loggedIn && to.path !== '/login') return { path: '/login', query: { next: to.fullPath } }
  if (auth.loggedIn && to.path === '/login') return '/practice'
})

export default router