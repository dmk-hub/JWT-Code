<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useLearningStore } from './stores/learning'

const auth = useAuthStore()
const learn = useLearningStore()
const route = useRoute()
const router = useRouter()

auth.init()
onMounted(() => learn.init())

// Session expired or revoked -> redirect to /login
watch(() => auth.loggedIn, (ok) => {
  if (!ok && route.path !== '/login') router.push({ path: '/login', query: { next: route.fullPath } })
  if (ok) learn.flushQueue()
})

// Offline and sync status banner in clear English
const banner = computed(() => {
  if (!learn.online) return `You are currently offline. ${learn.queue.length} completed items saved locally will sync when reconnected. Your streak is protected.`
  if (learn.syncing) return 'Synchronizing results and rewards…'
  if (learn.hasStaleQueue) return 'Some pending items are older than 24 hours and might not count toward your daily streak.'
  if (learn.queue.length) return `${learn.queue.length} item(s) pending synchronization.`
  return ''
})
</script>

<template>
  <!-- Thanh Header phong cách Game -->
  <header class="bg-[#1a1a1a] border-b-4 border-[#333] px-6 py-4 flex flex-wrap items-center justify-between text-white font-sans shadow-lg relative z-50">
    <span class="text-2xl font-black text-pink-400 tracking-wide" style="text-shadow: 2px 2px 0px #000;">
      EnglishStep
    </span>
    
    <nav v-if="auth.loggedIn" aria-label="Main Navigation" class="flex items-center gap-4 text-sm font-bold mt-2 sm:mt-0">
      <RouterLink to="/practice" class="hover:text-yellow-400 transition-colors">Practice</RouterLink>
      <RouterLink to="/profile" class="hover:text-yellow-400 transition-colors">Profile</RouterLink>
      <RouterLink to="/payment" class="hover:text-yellow-400 transition-colors">Plans</RouterLink>
      
      <RouterLink to="/jwt-console" class="bg-indigo-900 text-indigo-200 px-3 py-1 rounded-lg border border-indigo-700 hover:bg-indigo-800 transition-all">
        🛡 JWT
      </RouterLink>

      <button
        type="button"
        class="bg-red-900/50 text-red-300 border border-red-700 px-3 py-1 rounded-lg hover:bg-red-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="learn.queue.length > 0"
        :title="learn.queue.length ? 'Please sync pending items before signing out' : ''"
        @click="auth.logout()"
      >Sign Out</button>
    </nav>
  </header>

  <!-- Banner thông báo (Offline/Sync) -->
  <p v-if="banner" class="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-semibold border-b border-yellow-300" role="status">
    {{ banner }}
  </p>

  <!-- Nội dung chính -->
  <main class="bg-[#87CEEB] min-h-screen">
    <RouterView />
  </main>
</template>

<style scoped>
/* Chúng ta có thể để trống phần style này vì đã dùng Tailwind CSS ở trên */
</style>