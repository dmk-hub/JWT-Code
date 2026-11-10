<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-sans overflow-hidden">
    
    <!-- Thanh Header -->
    <header class="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="bg-white text-blue-600 font-black text-2xl px-2 py-1 rounded-lg">E</div>
        <span class="text-2xl font-bold tracking-tight text-pink-400">EnglishStep</span>
      </div>
      
      <!-- Nút bấm bên phải -->
      <div class="flex items-center gap-4">
        <button @click="goToLogin" class="bg-[#14d178] text-white px-6 py-2 rounded-full font-bold shadow-[0_4px_0_#0f9e5a] hover:translate-y-1 hover:shadow-[0_2px_0_#0f9e5a] transition-all">
          Learn for free
        </button>
        <button @click="goToLogin" class="border-2 border-white/50 text-white px-6 py-2 rounded-full font-semibold hover:bg-white/10 transition">
          Log in
        </button>
      </div>
    </header>

    <!-- Nội dung chính -->
    <main class="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
      
      <!-- Cột trái: Chữ và nút -->
      <div class="md:w-1/2 mb-12 md:mb-0 z-10">
        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style="text-shadow: 2px 2px 0px #000;">
          Học tiếng Anh theo cách <br/> thú vị nhất!
        </h1>
        <p class="text-lg md:text-xl text-blue-100 mb-10 max-w-lg">
          EnglishStep hiểu bạn biết gì, bạn bị kẹt ở đâu và mục tiêu của bạn là gì – để bạn sẵn sàng tự tin giao tiếp bằng tiếng Anh.
        </p>
        <button @click="goToLogin" class="bg-[#14d178] text-white text-xl font-bold px-10 py-4 rounded-full shadow-[0_8px_0_#0f9e5a] hover:translate-y-1 hover:shadow-[0_4px_0_#0f9e5a] transition-all">
          Bắt đầu học ngay
        </button>
      </div>

      <!-- Cột phải: Hình ảnh minh họa (Có thể thay bằng ảnh của bạn) -->
      <div class="md:w-1/2 relative flex justify-center">
        <!-- Bạn có thể thay src bằng đường dẫn ảnh thật của bạn -->
        <img 
          src="https://illustrations.popsy.co/blue/student-going-to-school.svg" 
          alt="Illustration" 
          class="w-full max-w-lg object-contain relative z-10 drop-shadow-2xl"
        />
        
        <!-- Các bong bóng chat trang trí -->
        <div class="absolute top-10 right-10 bg-white text-black font-bold px-4 py-2 rounded-2xl rounded-bl-none shadow-lg animate-bounce">Hello!</div>
        <div class="absolute top-32 left-10 bg-white text-black font-bold px-4 py-2 rounded-2xl rounded-br-none shadow-lg animate-pulse">Xin chào!</div>
        <div class="absolute bottom-20 right-20 bg-white text-black font-bold px-4 py-2 rounded-2xl rounded-bl-none shadow-lg">Let's go!</div>
      </div>

    </main>
  </div>
</template>