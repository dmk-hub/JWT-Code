<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const brand = 'EnglishStep'

const goals = [
  { label: 'IELTS', color: '#e8453c', icon: 'I' },
  { label: 'TOEIC', color: '#3b82f6', icon: 'T' },
  { label: 'Vocabulary', color: '#f4c95d', icon: 'V' },
  { label: 'Pronunciation', color: '#10d98c', icon: 'P' },
  { label: 'Grammar', color: '#a855f7', icon: 'G' },
  { label: 'Speaking', color: '#f97316', icon: 'S' },
  { label: 'Listening', color: '#06b6d4', icon: 'L' },
]

const features = [
  {
    tag: 'ADAPTIVE PRACTICE',
    title: 'Bài luyện tập theo đúng chỗ bạn còn yếu',
    text: 'Hệ thống theo dõi từ vựng và ngữ pháp bạn hay sai, rồi chọn đề tiếp theo để ôn đúng phần đó.',
    mock: 'quiz',
  },
  {
    tag: 'PRONUNCIATION',
    title: 'Sửa phát âm từng âm một',
    text: 'Đọc to một câu, xem âm nào chưa chuẩn và luyện lại ngay trong cùng bài học.',
    mock: 'speech',
  },
]

const track = ref(null)
const scrollGoals = (dir) => {
  track.value?.scrollBy({ left: dir * 320, behavior: 'smooth' })
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="font-sans bg-[#171a23] text-[#e8eaf2] min-h-screen">
    
    <!-- HERO SECTION -->
    <section class="min-h-[560px] bg-gradient-to-br from-[#3f5fd9] to-[#6a4bc9] px-4 md:px-10 pb-[70px]">
      <!-- Navbar -->
      <header class="flex justify-between items-center py-[22px] max-w-[1100px] mx-auto">
        <a class="flex items-center gap-[10px] cursor-pointer" @click="goToLogin">
          <span class="w-8 h-[30px] rounded-[10px_10px_10px_4px] bg-gradient-to-b from-white to-[#9cc4ff] block"></span>
          <span class="text-[26px] font-extrabold tracking-[-0.5px] text-white">{{ brand }}</span>
        </a>
        <div class="flex gap-[14px]">
          <button @click="goToLogin" class="hidden md:inline-flex items-center justify-center px-6 py-[10px] rounded-full font-bold text-[15px] border-2 border-[#3b3f55] bg-[#111] text-[#7fa4ff] hover:-translate-y-[1px] hover:brightness-110 transition">
            Learn for free
          </button>
          <button @click="goToLogin" class="inline-flex items-center justify-center px-6 py-[10px] rounded-full font-bold text-[15px] border-2 border-[#5d6bc4] text-white hover:-translate-y-[1px] hover:bg-white/10 transition">
            Log in
          </button>
        </div>
      </header>

      <!-- Hero Body -->
      <div class="max-w-[1100px] mx-auto mt-[30px] grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <h1 class="text-[36px] md:text-[52px] leading-[1.12] font-bold mb-6 text-white">Language skills for the conversations that count</h1>
          <p class="text-[18px] leading-relaxed max-w-[460px] mb-[30px] text-[#e8eaf2]">
            {{ brand }} hiểu bạn đã biết gì, hay vướng ở đâu và mục tiêu của bạn, để bạn sẵn sàng nói tiếng Anh tự tin.
          </p>
          <button @click="goToLogin" class="inline-flex items-center justify-center bg-[#3ddc97] text-[#0b2e22] w-full max-w-[290px] px-6 py-[18px] rounded-full text-[18px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-[1px] hover:brightness-110 transition">
            Learn for free
          </button>
          
          <div class="flex items-center gap-3 mt-[36px] pl-[18px] text-[18px] text-white">
            <span>Great</span>
            <span class="flex gap-[2px]">
              <i v-for="n in 5" :key="n" class="not-italic bg-[#73cf11] text-white w-6 h-6 grid place-items-center text-[16px]" :class="{ 'bg-gradient-to-r from-[#73cf11] from-80% to-[#dcdce6] to-80%': n === 5 }">★</i>
            </span>
            <a href="#" class="underline text-[15px]">19,967 reviews</a>
          </div>
        </div>

        <!-- Hero Art (Bản đồ & Bong bóng) -->
        <div class="relative h-[300px] md:h-[340px] max-w-[420px] mx-auto w-full">
          <div class="absolute inset-[40px_0_0_20px] bg-[#4a9cf0] opacity-70 rounded-[60%_40%_55%_45%/50%_60%_40%_50%]"></div>
          <div class="absolute rounded-full bg-[#cfe9f6] grid place-items-center font-extrabold text-[40px] text-[#2c3e73] w-[112px] h-[112px] left-0 top-[90px]">A</div>
          <div class="absolute rounded-full bg-[#d4ebfa] grid place-items-center font-extrabold text-[40px] text-[#2c3e73] w-[76px] h-[76px] left-[262px] top-[12px]">B</div>
          <div class="absolute rounded-full bg-[#d4ebfa] grid place-items-center font-extrabold text-[40px] text-[#2c3e73] w-[136px] h-[136px] right-0 top-[130px]">C</div>
          <div class="absolute rounded-full bg-[#f6dd8e] grid place-items-center font-extrabold text-[40px] text-[#2c3e73] w-[124px] h-[124px] left-[130px] bottom-0">D</div>
          
          <div class="absolute bg-white text-[#1d2340] font-bold px-4 py-2 rounded-[18px] text-[18px] left-[90px] top-[50px] shadow-sm">Bonjour!</div>
          <div class="absolute bg-white text-[#1d2340] font-bold px-4 py-2 rounded-[18px] text-[18px] left-[290px] top-[-26px] shadow-sm">Ciao!</div>
          <div class="absolute bg-white text-[#1d2340] font-bold px-4 py-2 rounded-[18px] text-[18px] left-[215px] top-[150px] shadow-sm">Hello!</div>
          <div class="absolute bg-white text-[#1d2340] font-bold px-4 py-2 rounded-[18px] text-[18px] right-0 top-[96px] shadow-sm">你好</div>
        </div>
      </div>
    </section>

    <!-- DARK SECTION -->
    <section class="px-6 py-[56px] pb-[100px] bg-[#171a23]">
      <h2 class="text-center text-[22px] mb-[28px] font-bold text-white">I want to learn</h2>

      <!-- Carousel -->
      <div class="flex items-center gap-[10px] max-w-[1100px] mx-auto">
        <button class="text-[#9aa1b8] text-[48px] leading-none px-2 hover:text-white transition" @click="scrollGoals(-1)">‹</button>
        <ul ref="track" class="flex gap-[30px] overflow-x-auto snap-x snap-mandatory flex-1 py-[6px] scrollbar-hide">
          <li v-for="g in goals" :key="g.label" class="flex-none w-[130px] snap-start flex flex-col items-center gap-[10px] cursor-pointer text-[#9aa1b8] font-bold hover:text-white transition">
            <span class="w-14 h-14 rounded-full grid place-items-center text-white font-extrabold text-[22px]" :style="{ background: g.color }">{{ g.icon }}</span>
            <span>{{ g.label }}</span>
          </li>
        </ul>
        <button class="text-[#9aa1b8] text-[48px] leading-none px-2 hover:text-white transition" @click="scrollGoals(1)">›</button>
      </div>

      <h2 class="text-center text-[30px] md:text-[38px] font-bold mt-[70px] md:mt-[110px] mb-[40px] md:mb-[70px] text-white">Why learn with {{ brand }}?</h2>

      <!-- Features -->
      <div class="max-w-[1100px] mx-auto space-y-[90px]">
        <article v-for="(f, i) in features" :key="f.tag" class="grid md:grid-cols-2 gap-10 md:gap-[80px] items-center" :class="{ 'md:[&>.mock-wrap]:order-2': i % 2 === 1 }">
          
          <!-- Mock UI -->
          <div class="bg-[#f4f6fb] rounded h-[330px] relative overflow-hidden text-[#1d2340] shadow-inner">
            <div v-if="f.mock === 'quiz'" class="relative w-full h-full">
              <div class="absolute left-[36px] top-[50px] w-[290px] bg-[#eef4fd] border-[3px] border-[#d7e3f4] rounded-[16px] p-[16px_20px] shadow-lg -rotate-[4deg]">
                <div class="text-center font-bold mb-3">Notifications</div>
                <div class="flex gap-3 items-center text-[15px]">
                  <span class="w-11 h-11 rounded-full bg-[#3a2d26] text-white grid place-items-center font-bold flex-none">K</span>
                  <span>Bài kế tiếp: 10 từ vựng bạn hay quên</span>
                </div>
              </div>
              <div class="absolute right-[28px] top-[150px] w-[300px] bg-[#f4f6fb] border-[3px] border-[#d7e3f4] rounded-[16px] p-[16px_20px] shadow-lg rotate-[3deg]">
                <p class="m-0 mb-2 text-[13px] text-[#6b7390] font-semibold">Choose the correct word</p>
                <p class="m-0 mb-[14px] text-[20px] font-semibold">She made a ____ to study every day.</p>
                <div class="flex flex-wrap gap-2">
                  <span class="border-2 border-[#d7e3f4] rounded-full px-3 py-1 text-[14px] font-semibold">decision</span>
                  <span class="border-2 border-[#10d98c] bg-[#e6fbf2] rounded-full px-3 py-1 text-[14px] font-semibold">commitment</span>
                  <span class="border-2 border-[#d7e3f4] rounded-full px-3 py-1 text-[14px] font-semibold">mistake</span>
                </div>
              </div>
            </div>
            <div v-else class="relative w-full h-full">
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[#f4f6fb] border-[3px] border-[#d7e3f4] rounded-[16px] p-[16px_20px] shadow-lg">
                <p class="m-0 mb-2 text-[13px] text-[#6b7390] font-semibold">Say it aloud</p>
                <p class="m-0 mb-[14px] text-[20px] font-semibold">Th<span class="text-[#e8453c] not-italic font-normal">i</span>rty th<span class="text-[#0fae6f] not-italic font-normal">ou</span>sand</p>
                <div class="flex items-center gap-1 h-9">
                  <i v-for="n in 18" :key="n" class="w-[5px] rounded-[3px] bg-[#4c4be6] block" :style="{ height: 8 + ((n * 7) % 24) + 'px' }"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Text -->
          <div>
            <p class="text-[13px] font-bold tracking-[0.5px] text-[#9aa1b8] mb-3">{{ f.tag }}</p>
            <h3 class="text-[28px] font-bold mb-4 text-white">{{ f.title }}</h3>
            <p class="text-[#e8eaf2]/85 leading-relaxed text-[17px] max-w-[460px]">{{ f.text }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Ẩn thanh cuộn cho carousel */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>