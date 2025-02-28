<script setup>
import {ref} from 'vue'
import { RouterLink, useRouter } from 'vue-router';
import { Analytics } from '@vercel/analytics/vue';

const tabs = ['sumar', 'restar', 'multiplicar'];

const results = ref({
    correct: 0,
    total: 0,
})


const router = useRouter();

const handleResult = (result) => {
    results.value.total++;
    if (result) {
        results.value.correct++;
    }
}

const childView = ref(null);

const checkAnswer = () => {
    childView.value.checkAnswer();
}

const resetResults = () => {
    results.value.correct = 0;
    results.value.total = 0;
}
</script>

<template>
    <Analytics />
  <div class="flex min-h-screen flex-col items-center bg-blue-100 p-4">
      <h1 class="mb-4 text-3xl font-bold text-pink-500">Mi ficha de repaso 🗒️</h1>
      <div class="flex justify-between mb-4 text-lg text-purple-500 ">
          <p class="mr-8">Matemáticas 🧮</p>
          <p>Aciertos:{{ results.correct }} / {{ results.total }}</p>
      </div>
      <p class="mb-2 text-lg text-green-500">Selecciona que quieres practicar</p>
      <div class="flex justify-center mb-4">
    <RouterLink
      v-for="tab in tabs"
      :key="tab"
      :to="`/${tab}`"
      v-slot="{ isActive }"
      
    >
      <div :class="[
        'px-6 py-3 mx-2 rounded-full text-lg font-bold shadow-md transition-transform transform hover:scale-105 text-white',
        isActive ? 'bg-purple-500' : 'bg-yellow-400'
      ]">{{ tab }}</div>
    </RouterLink>
  </div>
  <RouterView ref="childView" @results="handleResult" @reset="resetResults"/>

  </div>
    
</template>