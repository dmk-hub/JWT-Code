<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { socialAuth } from '../api'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// View mode: 'signin' | 'signup'
const mode = ref('signin')

// Form Fields
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const mfaCode = ref('')
const formError = ref(
  route.query.error === 'config' ? 'Social sign-in is not configured yet.'
    : route.query.error ? 'Social sign-in failed. Please try again.' : ''
)

// Social Auth Modal State
const socialModal = ref(null) // 'google' | 'facebook' | null
const socialEmail = ref('')
const socialName = ref('')

function navigateAfterAuth() {
  const dest = String(route.query.next || '/practice')
  router.replace(dest)
}

async function handleSignIn() {
  formError.value = ''
  const res = await auth.login(email.value.trim(), password.value)
  if (res?.mfaRequired) {
    return
  }
  if (res?.success) {
    navigateAfterAuth()
  }
}

async function handleSignUp() {
  formError.value = ''
  if (!name.value.trim()) {
    formError.value = 'Please enter your full name.'
    return
  }
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }
  if (password.value.length < 6) {
    formError.value = 'Password must be at least 6 characters long.'
    return
  }

  const ok = await auth.register(email.value.trim(), password.value, name.value.trim())
  if (ok) {
    navigateAfterAuth()
  }
}

async function handleVerify2Fa() {
  formError.value = ''
  if (!mfaCode.value || mfaCode.value.trim().length !== 6) {
    formError.value = 'Please enter a valid 6-digit verification code.'
    return
  }

  const ok = await auth.verify2Fa(mfaCode.value.trim())
  if (ok) {
    navigateAfterAuth()
  }
}

function openSocialModal(provider) {
  formError.value = ''
  if (socialAuth.enabled) return auth.startSocialLogin(provider, String(route.query.next || '/practice'))
  socialModal.value = provider
  if (provider === 'google') {
    socialEmail.value = 'sarah.connor@gmail.com'
    socialName.value = 'Sarah Connor'
  } else {
    socialEmail.value = 'mark.fb@facebook.com'
    socialName.value = 'Mark Zuckerberg'
  }
}

async function confirmSocialLogin() {
  formError.value = ''
  const provider = socialModal.value
  socialModal.value = null
  let ok = false
  if (provider === 'google') {
    ok = await auth.loginWithGoogle(socialEmail.value.trim(), socialName.value.trim())
  } else {
    ok = await auth.loginWithFacebook(socialEmail.value.trim(), socialName.value.trim())
  }
  if (ok) navigateAfterAuth()
}

function switchToSignupWithEmail() {
  mode.value = 'signup'
  formError.value = ''
}

function cancel2Fa() {
  auth.mfaRequired = false
  auth.mfaToken = null
  mfaCode.value = ''
  formError.value = ''
}
</script>

<template>
  <!-- Background giống game với trời xanh -->
  <div class="min-h-[75vh] flex items-center justify-center p-4 bg-gradient-to-b from-[#87CEEB] to-[#98FB98] font-sans relative overflow-hidden">
    
    <!-- Mây trang trí (có thể thay bằng ảnh thật của bạn) -->
    <div class="absolute top-10 left-10 text-6xl opacity-70 animate-pulse">☁️</div>
    <div class="absolute top-20 right-20 text-7xl opacity-50">☁️</div>

    <!-- Social OAuth Dialog Modal (Phong cách hộp thoại game) -->
    <div v-if="socialModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="socialModal = null">
      <div class="bg-[#222] border-4 border-[#444] rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <div class="text-center mb-6">
          <div class="flex justify-center mb-4">
            <!-- Google Icon -->
            <div v-if="socialModal === 'google'" class="bg-white p-3 rounded-full shadow-lg">
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <!-- Facebook Icon -->
            <div v-else class="bg-white p-3 rounded-full shadow-lg">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-white text-2xl font-bold">{{ socialModal === 'google' ? 'Sign in with Google' : 'Sign in with Facebook' }}</h3>
          <p class="text-gray-400 text-sm mt-2">
            Direct Single Sign-On: Authenticate with your existing {{ socialModal === 'google' ? 'Google' : 'Facebook' }} account.
          </p>
        </div>

        <div class="bg-[#2a2a2a] border border-[#444] rounded-xl p-4 mb-6 space-y-4">
          <label class="block">
            <span class="text-gray-300 text-sm font-semibold mb-1 block">Account Name</span>
            <input v-model="socialName" type="text" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-lg p-2 text-white outline-none focus:border-blue-500" />
          </label>
          <label class="block">
            <span class="text-gray-300 text-sm font-semibold mb-1 block">{{ socialModal === 'google' ? 'Google Email' : 'Facebook Email' }}</span>
            <input v-model="socialEmail" type="email" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-lg p-2 text-white outline-none focus:border-blue-500" />
          </label>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" class="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors" @click="socialModal = null">Cancel</button>
          <button type="button" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_4px_0_rgb(37,99,235)] active:shadow-none active:translate-y-1 transition-all" @click="confirmSocialLogin">
            Continue as {{ socialName.split(' ')[0] || 'User' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 2FA Verification Mode (Phong cách Game) -->
    <section v-if="auth.mfaRequired" class="bg-[#222] border-4 border-[#444] rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10">
      <div class="text-center mb-6">
        <div class="text-5xl mb-2">🛡️</div>
        <h1 class="text-white text-2xl font-bold">Two-Factor Auth</h1>
        <p class="text-gray-400 text-sm mt-1">Enter the 6-digit code to continue your journey.</p>
      </div>

      <div class="bg-blue-900/30 border border-blue-500/50 rounded-xl p-3 mb-6 flex justify-between items-center text-sm text-blue-300">
        <span>Test 2FA Code: <strong>{{ auth.tempCodeHint || '123456' }}</strong></span>
        <button type="button" class="text-blue-400 hover:text-white font-bold underline" @click="mfaCode = auth.tempCodeHint || '123456'">Auto-Fill</button>
      </div>

      <form @submit.prevent="handleVerify2Fa" class="space-y-4">
        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Verification Code</span>
          <input
            v-model="mfaCode"
            type="text"
            maxlength="6"
            placeholder="123456"
            class="w-full text-center text-2xl tracking-[0.5em] font-mono bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-green-500 transition-colors"
            autocomplete="one-time-code"
            autofocus
            required
          />
        </label>

        <p v-if="auth.error || formError" class="text-red-400 text-sm font-semibold text-center bg-red-900/20 p-2 rounded-lg border border-red-500/30">
          {{ auth.error || formError }}
        </p>

        <button type="submit" class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-1 transition-all" :disabled="auth.busy">
          {{ auth.busy ? 'Verifying…' : 'Verify & Start Game' }}
        </button>

        <button type="button" class="w-full text-gray-400 hover:text-white text-sm font-semibold mt-2" @click="cancel2Fa">
          ← Cancel and return
        </button>
      </form>
    </section>

    <!-- Normal Sign In / Sign Up Mode (Phong cách Game) -->
    <section v-else class="bg-[#222] border-4 border-[#444] rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10">
      <!-- Tab Header -->
      <div class="flex border-b-2 border-[#444] mb-6">
        <button
          type="button"
          :class="['flex-1 pb-3 font-bold text-lg transition-colors', mode === 'signin' ? 'text-pink-400 border-b-4 border-pink-400' : 'text-gray-500 hover:text-gray-300']"
          @click="mode = 'signin'; formError = ''"
        >
          Sign In
        </button>
        <button
          type="button"
          :class="['flex-1 pb-3 font-bold text-lg transition-colors', mode === 'signup' ? 'text-pink-400 border-b-4 border-pink-400' : 'text-gray-500 hover:text-gray-300']"
          @click="mode = 'signup'; formError = ''"
        >
          Register
        </button>
      </div>

      <div class="text-center mb-6">
        <h1 class="text-white text-3xl font-bold" style="text-shadow: 2px 2px 0px #000;">
          {{ mode === 'signin' ? 'Welcome back!' : 'Join the adventure' }}
        </h1>
        <p class="text-gray-400 text-sm mt-1">
          {{ mode === 'signin' ? 'Enter your details to continue.' : 'Create an account to start learning.' }}
        </p>
      </div>

      <!-- Social Logins -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button type="button" class="flex items-center justify-center gap-2 py-2 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl shadow-[0_4px_0_#ccc] active:shadow-none active:translate-y-1 transition-all" :disabled="auth.busy" @click="openSocialModal('google')">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google
        </button>

        <button type="button" class="flex items-center justify-center gap-2 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-[0_4px_0_#0e54a0] active:shadow-none active:translate-y-1 transition-all" :disabled="auth.busy" @click="openSocialModal('facebook')">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <div class="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider mb-6">
        <div class="flex-1 border-b border-[#444]"></div>
        <span class="px-3">or with email</span>
        <div class="flex-1 border-b border-[#444]"></div>
      </div>

      <!-- Sign In Form -->
      <form v-if="mode === 'signin'" @submit.prevent="handleSignIn" class="space-y-4">
        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Email address</span>
          <input v-model="email" type="email" autocomplete="username" placeholder="name@example.com" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Password</span>
          <input v-model="password" type="password" autocomplete="current-password" placeholder="••••••••" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <div v-if="auth.error || formError" class="bg-red-900/20 border border-red-500/50 p-3 rounded-xl text-center">
          <p class="text-red-400 text-sm font-semibold m-0">{{ auth.error || formError }}</p>
          <button v-if="auth.error && auth.error.includes('Create Account')" type="button" class="text-blue-400 hover:text-white font-bold text-sm mt-2 underline" @click="switchToSignupWithEmail">
            → Register Now
          </button>
        </div>

        <button type="submit" class="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl shadow-[0_4px_0_#4338ca] active:shadow-none active:translate-y-1 transition-all mt-2" :disabled="auth.busy">
          {{ auth.busy ? 'Signing in…' : 'Sign In' }}
        </button>

        <p class="text-center text-gray-400 text-sm mt-4">
          Don't have an account?
          <button type="button" class="text-blue-400 hover:text-white font-bold underline ml-1" @click="switchToSignupWithEmail">Create one</button>
        </p>
      </form>

      <!-- Sign Up Form -->
      <form v-else @submit.prevent="handleSignUp" class="space-y-4">
        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Full Name</span>
          <input v-model="name" type="text" placeholder="Alex Johnson" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Email address</span>
          <input v-model="email" type="email" autocomplete="username" placeholder="name@example.com" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Password</span>
          <input v-model="password" type="password" autocomplete="new-password" placeholder="At least 6 characters" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <label class="block">
          <span class="text-gray-300 font-semibold mb-1 block">Confirm Password</span>
          <input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="••••••••" required class="w-full bg-[#1a1a1a] border-2 border-[#555] rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
        </label>

        <div v-if="auth.error || formError" class="bg-red-900/20 border border-red-500/50 p-3 rounded-xl text-center">
          <p class="text-red-400 text-sm font-semibold m-0">{{ auth.error || formError }}</p>
        </div>

        <button type="submit" class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all mt-2" :disabled="auth.busy">
          {{ auth.busy ? 'Creating account…' : 'Create Account' }}
        </button>

        <p class="text-center text-gray-400 text-sm mt-4">
          Already have an account?
          <button type="button" class="text-blue-400 hover:text-white font-bold underline ml-1" @click="mode = 'signin'; formError = ''">Sign in here</button>
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
/* Import font chữ giống game */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap');

.font-sans {
  font-family: 'Nunito', sans-serif;
}
</style>