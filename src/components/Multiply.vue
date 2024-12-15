<script setup>
import { ref, computed, watch } from 'vue';
import JSConfetti from 'js-confetti';
import Actions from './Actions.vue';


const emits = defineEmits(['results']);
const jsConfetti = new JSConfetti();
const selectedTables = ref(Array(10).fill(false)); // Array of 10 booleans
const num1 = ref(0);
const num2 = ref(0);
const userAnswer = ref([]);
const feedback = ref('');
const results = ref({
  correct: 0,
  total: 0,
});

// Get array of selected table numbers
const activeTables = computed(() => 
  selectedTables.value
    .map((isSelected, index) => isSelected ? index + 1 : null)
    .filter(n => n !== null)
);

function generateNewMultiplication() {
  if (activeTables.value.length === 0) {
    feedback.value = 'Selecciona al menos una tabla';
    return;
  }
  
  // Random table from selected ones
  const randomIndex = Math.floor(Math.random() * activeTables.value.length);
  num1.value = activeTables.value[randomIndex];
  num2.value = Math.floor(Math.random() * 10) + 1;
  const result = (num1.value * num2.value).toString();
  userAnswer.value = Array(result.length).fill('');
  feedback.value = '';
}

function toggleTable(index) {
  selectedTables.value[index] = !selectedTables.value[index];
  generateNewMultiplication();
}

const correctAnswer = computed(() => {
  return (num1.value * num2.value).toString();
});

const checkAnswer = async () => {
  results.value.total++;
  if (userAnswer.value.join('') === correctAnswer.value) {
    emits('results', true);
    feedback.value = '¡Correcto!';
    results.value.correct++;
    await jsConfetti.addConfetti({
      emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
    });
    generateNewMultiplication();
  } else {
    emits('results', false);
    feedback.value = 'Incorrecto. ¡Inténtalo otra vez!';
  }
};

function clearUserAnswer() {
  userAnswer.value = userAnswer.value.map(() => '');
}

// Initialize with first table selected
selectedTables.value[0] = true;
generateNewMultiplication();

const handleNumberClick = (n) => {
          const firstEmpty = userAnswer.value.findIndex(x => x === '');
          if (firstEmpty !== -1) userAnswer.value[firstEmpty] = (n).toString();
        }


</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-blue-100 p-4">    
    <!-- Table selector buttons -->
    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        v-for="n in 10"
        :key="n"
        @click="toggleTable(n-1)"
        :class="[
          'w-12 h-12 rounded-full font-bold text-xl transition-colors',
          selectedTables[n-1] 
            ? 'bg-purple-500 text-white shadow-lg transform scale-105' 
            : 'bg-gray-200 text-gray-600 hover:bg-purple-200'
        ]"
      >
        {{ n }}
      </button>
    </div>

    <div class="flex justify-between mb-4 text-lg text-purple-500">
      <p class="mr-8">Matemáticas 🧮</p>
      <p>Aciertos: {{ results.correct }} / {{ results.total }}</p>
    </div>

    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div class="flex justify-end mb-4">
        <div class="text-2xl font-bold">
          {{ num1 }}
        </div>
      </div>
      <div class="flex justify-end mb-4">
        <span class="mr-4 text-2xl">×</span>
        <div class="text-2xl font-bold">
          {{ num2 }}
        </div>
      </div>
      <hr class="border-t-2 border-black mb-4" />
      <div class="flex space-x-2 mb-4">
        <div
          v-for="(digit, index) in userAnswer"
          :key="index"
          class="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold"
          @drop="(event) => handleDrop(event, index)"
          @dragover.prevent
        >
          {{ digit }}
        </div>
      </div>
    </div>

    <Actions 
      :feedback="feedback"
      @clickNumber="handleNumberClick"
      @checkAnswer="checkAnswer"
      @clearAnswer="clearUserAnswer"
    />
  </div>
</template>