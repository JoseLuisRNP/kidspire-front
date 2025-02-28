<script setup>
import { ref, computed, watch } from 'vue';
import JSConfetti from 'js-confetti';
import Actions from './Actions.vue';


const emits = defineEmits(['results', 'reset']);
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
const isMultipleChoice = ref(false);
const multipleChoiceOptions = ref([]);

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
  const result = num1.value * num2.value;
  
  if (isMultipleChoice.value) {
    // Generate 3 wrong answers
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const wrong = result + Math.floor(Math.random() * 10) - 5;
      if (wrong !== result && wrong > 0) {
        wrongAnswers.add(wrong);
      }
    }
    multipleChoiceOptions.value = [...wrongAnswers, result]
      .sort(() => Math.random() - 0.5);
  } else {
    userAnswer.value = Array(result.toString().length).fill('');
  }
  feedback.value = '';
}

const reset = () => {
  results.value.correct = 0;
  results.value.total = 0;
  emits('reset');
};

function toggleTable(index) {
  reset();
  selectedTables.value[index] = !selectedTables.value[index];
  generateNewMultiplication();
}

const correctAnswer = computed(() => {
  return (num1.value * num2.value).toString();
});

const checkAnswer = async (selectedAnswer = null) => {
  results.value.total++;
  const answer = selectedAnswer !== null ? 
    selectedAnswer : 
    parseInt(userAnswer.value.join(''));
  
  if (answer === (num1.value * num2.value)) {
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

    <div class="mb-4">
      <button 
        @click="isMultipleChoice = !isMultipleChoice; generateNewMultiplication()"
        class="bg-purple-500 text-white px-4 py-2 rounded"
      >
        {{ isMultipleChoice ? 'Modo: Opciones' : 'Modo: Manual' }}
      </button>
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
      
      <div v-if="isMultipleChoice" class="grid grid-cols-2 gap-4">
        <button
          v-for="option in multipleChoiceOptions"
          :key="option"
          @click="checkAnswer(option)"
          class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-2xl font-bold"
        >
          {{ option }}
        </button>
      </div>

      <div v-else class="flex space-x-2 mb-4">
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