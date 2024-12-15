<script setup>
import { computed, ref, watch } from 'vue';
import JSConfetti from 'js-confetti'
import Actions from './Actions.vue';


const emits = defineEmits(['results']);
const jsConfetti = new JSConfetti()

const num1 = ref(0);
const num2 = ref(0);
const userAnswer = ref([]);
const feedback = ref('');
const withCarry = ref(true); // Nueva opción para seleccionar sumas con llevadas
const operation = ref('addition'); // Nueva opción para seleccionar la operación (addition, subtraction)
const showUnicorns = ref(false);
const carries = ref([]); // Para almacenar los números llevados
const numDigits = ref(2); // Nueva opción para seleccionar el número de dígitos

const results = ref({
    correct: 0,
    total: 0,
})


function generateNoCarryNumbers(length) {
    let num1 = '';
    let num2 = '';

    for (let i = 0; i < length; i++) {
        // Generar dígitos para que la suma de ellos no supere 9
        const digit1 = Math.floor(Math.random() * 10); // Random digit (0-9)
        const digit2 = Math.floor(Math.random() * (10 - digit1)); // Asegurar que no hay llevada
        num1 += digit1;
        num2 += digit2;
    }

    if (num1 === 0 || num2 === 0) {
        return generateNoCarryNumbers(length);
    }

    return {
        num1: parseInt(num1, 10),
        num2: parseInt(num2, 10),
        sum: parseInt(num1, 10) + parseInt(num2, 10)
    };
}

function generateRandomCarriesNumbers(length) {
    let num1 = Array(length).fill(0);
    let num2 = Array(length).fill(0);
    let hasCarry = false; // Para rastrear si ya se generó una llevada

    for (let i = 0; i < length; i++) {
        const isLastDigit = (i === length - 1);

        if (!hasCarry && isLastDigit) {
            // Forzar llevada en la última posición si no se generó ninguna
            const digit1 = Math.floor(Math.random() * 9) + 1; // 1-9
            const digit2 = Math.floor(Math.random() * (10 - digit1)) + 10 - digit1; // Asegura suma >= 10
            num1[i] = digit1;
            num2[i] = Math.min(9, digit2);
            hasCarry = true;
        } else {
            const shouldCarry = Math.random() < 0.5 ; // Decide aleatoriamente si debe haber llevada

            if (shouldCarry) {
                // Generar una llevada
                const digit1 = Math.floor(Math.random() * 9) + 1; // 1-9
                const digit2 = Math.floor(Math.random() * (10 - digit1)) + 10 - digit1; // Asegura suma >= 10
                num1[i] = digit1;
                num2[i] = Math.min(9, digit2); // Asegura que digit2 está en el rango 0-9
                hasCarry = true;
            } else {
                // Generar sin llevada
                const digit1 = Math.floor(Math.random() * 10); // 0-9
                const digit2 = Math.floor(Math.random() * (10 - digit1)); // Asegura suma < 10
                num1[i] = digit1;
                num2[i] = digit2;
            }
        }
    }

    // Convertir los arrays en números
    const number1 = parseInt(num1.join(''), 10);
    const number2 = parseInt(num2.join(''), 10);

    if (num1 === 0 || num2 === 0) {
        return generateRandomCarriesNumbers(length);
    }

    return {
        num1: number1,
        num2: number2,
        sum: number1 + number2,
    };
}


function generateRandomBorrowNumbers(length) {
    let num1 = Array(length).fill(0);
    let num2 = Array(length).fill(0);
    let hasBorrow = false; // Para rastrear si ya se generó una llevada

    for (let i = 0; i < length; i++) {
        const isLastDigit = (i === length - 1);

        if (!hasBorrow && isLastDigit) {
            // Si es la última posición y no hay llevada, forzamos una llevada
            const digit2 = Math.floor(Math.random() * 9) + 1; // 1-9
            const digit1 = Math.floor(Math.random() * digit2); // Asegura que digit1 < digit2
            num1[i] = digit1;
            num2[i] = digit2;
            hasBorrow = true;
        } else {
            const shouldBorrow = Math.random() < 0.5; // Decide aleatoriamente si debe haber llevada

            if (shouldBorrow) {
                // Generar una llevada (borrow)
                const digit2 = Math.floor(Math.random() * 10); // 0-9
                const digit1 = Math.floor(Math.random() * digit2); // Asegura que digit1 < digit2
                num1[i] = digit1;
                num2[i] = digit2;
                hasBorrow = true;
            } else {
                // Generar sin llevada
                const digit1 = Math.floor(Math.random() * 10); // 0-9
                const digit2 = Math.floor(Math.random() * (digit1 + 1)); // Asegura que digit1 >= digit2
                num1[i] = digit1;
                num2[i] = digit2;
            }
        }
    }

    // Convertir los arrays en números
    const number1 = parseInt(num1.join(''), 10);
    const number2 = parseInt(num2.join(''), 10);

    if (number1 < number2 || number1 === 0 || number2 === 0) {
        return generateRandomBorrowNumbers(length);
        
    }

    return {
        num1: number1,
        num2: number2,
        difference: number1 - number2,
    };
}

function generateRandomNoBorrowNumbers(length) {
    let num1 = Array(length).fill(0);
    let num2 = Array(length).fill(0);

    for (let i = 0; i < length; i++) {
        // Generar dígitos asegurando que no haya llevadas (borrow)
        const digit2 = Math.floor(Math.random() * 10); // 0-9
        const digit1 = Math.floor(Math.random() * (10 - digit2)) + digit2; // Asegura que digit1 >= digit2
        num1[i] = digit1;
        num2[i] = digit2;
    }

    // Convertir los arrays en números
    const number1 = parseInt(num1.join(''), 10);
    const number2 = parseInt(num2.join(''), 10);

    if(number1 < number2 || number1 === 0 || number2 === 0) {
        return generateRandomNoBorrowNumbers(length);
    }

    return {
        num1: number1,
        num2: number2,
        difference: number1 - number2,
    };
}

const generateNewSum = () => {
    if (withCarry.value) {
            const { num1: newNum1, num2: newNum2 } = generateRandomCarriesNumbers(numDigits.value);
            num1.value = newNum1;
            num2.value = newNum2;
        } else {
            const { num1: newNum1, num2: newNum2 } = generateNoCarryNumbers(numDigits.value);
            num1.value = newNum1;
            num2.value = newNum2;
        }
    const maxLength = Math.max(
        num1.value.toString().length,
        num2.value.toString().length,
    );
    const resultLength = (num1.value + num2.value).toString().length;
    userAnswer.value = Array(Math.max(resultLength, maxLength)).fill('');
    carries.value = Array(resultLength).fill('');
    feedback.value = '';
    showUnicorns.value = false;
};

const correctAnswer = computed(() => {
    return (num1.value + num2.value).toString().padStart(userAnswer.value.length, '0');
});

const checkAnswer = async () => {
    if (userAnswer.value.join('') === correctAnswer.value) {
        emits('results', true);
        feedback.value = '¡Correcto!';
        results.value.correct++;

        await jsConfetti.addConfetti({
            emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
        })
        generateNewSum();
    } else {
        feedback.value = 'Incorrecto. ¡Inténtalo otra vez!';
        emits('results', false);

    }
};

const handleDrop = (event, index) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    userAnswer.value[index] = data;
    updateCarries();
};

const allowDrop = (event) => {
    event.preventDefault();
};

const handleDrag = (event) => {
    event.dataTransfer.setData('text', event.target.innerText);
};

const handleClick = (digit) => {
    const emptyIndex = userAnswer.value.lastIndexOf('');
    if (emptyIndex !== -1) {
        userAnswer.value[emptyIndex] = digit;
        updateCarries();
    }
};

const updateCarries = () => {
    carries.value = Array(userAnswer.value.length).fill('');
    let carry = 0;
        for (let i = userAnswer.value.length - 1; i >= 0; i--) {
            const sum =
                parseInt(
                    num1.value
                        .toString()
                        .padStart(userAnswer.value.length, '0')[i],
                ) +
                parseInt(
                    num2.value
                        .toString()
                        .padStart(userAnswer.value.length, '0')[i],
                ) +
                carry;
            if (sum >= 10) {
                carry = 1;
                if (i > 0) {
                    carries.value[i - 1] = carry.toString();
                } else {
                    carries.value[0] = carry.toString();
                }
            } else {
                carry = 0;
            }
        }
};

// Observa el cambio en withCarry, operation y numDigits y genera una nueva suma
watch([withCarry, operation, numDigits], generateNewSum);

generateNewSum();

function clearUserAnswer() {
  userAnswer.value.forEach((_, index) => {
    userAnswer.value[index] = '';
  });
}
</script>

<template>
    <div class="flex flex-col items-center bg-blue-100 p-4">
        <div
            class="relative sum-container mb-4 rounded-lg bg-white p-4 text-center text-4xl leading-loose shadow-lg"
        >
        <div class="flex justify-center space-x-2">
            <div class="flex justify-center space-x-2">
    <div
      v-for="(carry, index) in carries"
      :key="'carry-' + index"
      class="w-12 text-center text-sm text-gray-500"
    >
    <Transition name="slide-fade" v-if="operation !== 'addition'">        
        <div
            class="transition-transform transform translate-y-[3.6rem] -translate-x-[3.5rem]" 
          v-show="userAnswer[index + 1] !== ''"
        >
          {{ carry }}
      </div>
      </Transition>
      <div v-else
          v-show="userAnswer[index + 1] !== ''"
        >
          {{ carry }}
      </div>
    </div>
  </div>
  </div>

            <div class="relative flex justify-center space-x-2">
                <div
                    v-for="(digit, index) in num1
                        .toString()
                        .padStart(userAnswer.length, '0')"
                    :key="'num1-' + index"
                    class="w-12 text-center"
                >
                <span v-show="digit !== '0' || digit === '0' && index !== 0 ">{{ digit }}</span>
                </div>
            </div>
            <div class="absolute -left-2 w-12 text-center">
                    +
                </div>
            <div class="relative flex justify-center space-x-2">
                
                <div
                    v-for="(digit, index) in num2
                        .toString()
                        .padStart(userAnswer.length, '0')"
                    :key="'num2-' + index"
                    class="w-12 text-center"
                >
                <span v-show="digit !== '0' || digit === '0' && index !== 0 ">{{ digit }}</span>
            </div>
            </div>
            <hr class="my-2 border-t-2 border-black" />
        </div>
        <div class="drop-area mb-4 flex space-x-2">
            <div
                v-for="(digit, index) in userAnswer"
                :key="index"
                class="flex h-12 w-12 items-center justify-center rounded-lg border bg-white p-2 text-center text-2xl"
                @drop="(event) => handleDrop(event, index)"
                @dragover="allowDrop"
            >
                {{ digit }}
            </div>
        </div>
        
        <Actions :feedback="feedback" @checkAnswer="checkAnswer" @clearAnswer="clearUserAnswer" @clickNumber="handleClick"/>
        <div class="mt-4">
            <label class="text-lg text-purple-500">
                <input type="checkbox" v-model="withCarry" class="mr-2" />
                Con llevadas
            </label>
        </div>
    
        <div class="mt-4">
            <label class="text-lg text-purple-500">
                Número de digitos:
                <select v-model="numDigits" class="ml-2 rounded border p-1">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
            </label>
        </div>
    </div>
</template>

<style scoped>
.sum-container {
    text-align: right;
    font-size: 2em;
    line-height: 1.5em;
}
.sum-container hr {
    margin: 0.5em 0;
}
.number {
    user-select: none;
}

.slide-fade-enter-active {
  transition: all 1.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 1.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px) translateX(-20px);
  opacity: 0;
}
</style>
