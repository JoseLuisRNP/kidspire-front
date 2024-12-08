<script setup>
import { computed, ref, watch } from 'vue';

const title = ref('Maths Component');
const message = ref(
    'Welcome to the Maths component using Vue 3 Composition API!',
);
const num1 = ref(0);
const num2 = ref(0);
const userAnswer = ref([]);
const feedback = ref('');
const withCarry = ref(true); // Nueva opción para seleccionar sumas con llevadas
const operation = ref('addition'); // Nueva opción para seleccionar la operación (addition, subtraction)
const showUnicorns = ref(false);
const carries = ref([]); // Para almacenar los números llevados
const numDigits = ref(2); // Nueva opción para seleccionar el número de dígitos

const generateNewSum = () => {
    const maxNumber = Math.pow(10, numDigits.value) - 1;
    const minNumber = Math.pow(10, numDigits.value - 1);

    if (operation.value === 'addition') {
        if (withCarry.value) {
            // Generar números que garanticen llevadas
            num1.value =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
            num2.value =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
        } else {
            num1.value = Math.floor(Math.random() * (maxNumber / 2));
            num2.value = Math.floor(Math.random() * (maxNumber / 2));
        }
    } else if (operation.value === 'subtraction') {
        if (withCarry.value) {
            // Generar números que garanticen llevadas
            num1.value =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
            num2.value =
                Math.floor(Math.random() * (num1.value - minNumber + 1)) +
                minNumber;
        } else {
            num1.value = Math.floor(Math.random() * maxNumber);
            num2.value = Math.floor(Math.random() * num1.value); // Ensure num2 is not greater than num1
        }
    }
    const maxLength = Math.max(
        num1.value.toString().length,
        num2.value.toString().length,
    );
    const resultLength = (
        operation.value === 'addition'
            ? num1.value + num2.value
            : num1.value - num2.value
    ).toString().length;
    userAnswer.value = Array(resultLength).fill('');
    carries.value = Array(resultLength).fill('');
    feedback.value = '';
    showUnicorns.value = false;
};

const correctAnswer = computed(() => {
    let result;
    if (operation.value === 'addition') {
        result = (num1.value + num2.value).toString();
    } else if (operation.value === 'subtraction') {
        result = (num1.value - num2.value).toString();
    }
    return result.padStart(userAnswer.value.length, '0');
});

const checkAnswer = () => {
    if (userAnswer.value.join('') === correctAnswer.value) {
        feedback.value = 'Correct!';
        showUnicorns.value = true;
        setTimeout(() => {
            generateNewSum();
        }, 2000); // Espera 2 segundos antes de generar una nueva suma
    } else {
        feedback.value = `Incorrect. The correct answer was ${correctAnswer.value}.`;
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
    if (operation.value === 'addition') {
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
    } else if (operation.value === 'subtraction') {
        let borrow = 0;
        for (let i = userAnswer.value.length - 1; i >= 0; i--) {
            let diff =
                parseInt(
                    num1.value
                        .toString()
                        .padStart(userAnswer.value.length, '0')[i],
                ) -
                borrow -
                parseInt(
                    num2.value
                        .toString()
                        .padStart(userAnswer.value.length, '0')[i],
                );
            if (diff < 0) {
                borrow = 1;
                carries.value[i] = borrow.toString();
            } else {
                borrow = 0;
            }
        }
    }
};

// Observa el cambio en withCarry, operation y numDigits y genera una nueva suma
watch([withCarry, operation, numDigits], generateNewSum);

generateNewSum();
</script>

<template>
    <div class="flex min-h-screen flex-col items-center bg-blue-100 p-4">
        <h1 class="mb-4 text-3xl font-bold text-pink-500">{{ title }}</h1>
        <p class="mb-4 text-lg text-purple-500">{{ message }}</p>
        <p class="mb-2 text-xl text-green-500">Solve the following problem:</p>
        <div
            class="sum-container mb-4 rounded-lg bg-white p-4 text-center text-4xl leading-loose shadow-lg"
        >
            <div class="flex justify-center space-x-2">
                <div
                    v-for="(carry, index) in carries"
                    :key="'carry-' + index"
                    class="w-12 text-center text-sm text-gray-500"
                >
                    <span
                        v-if="
                            userAnswer[
                                index + (operation === 'addition' ? 1 : 0)
                            ] !== ''
                        "
                        >{{ carry }}</span
                    >
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
                    <span>{{ digit }}</span>
                </div>
            </div>
            <div class="relative flex justify-center space-x-2">
                <div class="absolute -left-6 w-12 text-center">
                    {{ operation === 'addition' ? '+' : '-' }}
                </div>
                <div
                    v-for="(digit, index) in num2
                        .toString()
                        .padStart(userAnswer.length, '0')"
                    :key="'num2-' + index"
                    class="w-12 text-center"
                >
                    {{ digit }}
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
        <div class="numbers-container mb-4 flex justify-center">
            <div
                v-for="n in 10"
                :key="n"
                class="number m-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-2xl text-white"
                draggable="true"
                @dragstart="handleDrag"
                @click="() => handleClick(n - 1)"
            >
                {{ n - 1 }}
            </div>
        </div>
        <button
            @click="checkAnswer"
            class="rounded-full bg-yellow-400 px-6 py-2 text-xl text-white"
        >
            Check Answer
        </button>
        <p
            class="mt-4 text-2xl"
            :class="{
                'text-green-500': feedback === 'Correct!',
                'text-red-500': feedback !== 'Correct!',
            }"
        >
            {{ feedback }}
        </p>
        <div class="mt-4">
            <label class="text-lg text-purple-500">
                <input type="checkbox" v-model="withCarry" class="mr-2" />
                Allow carries in sums
            </label>
        </div>
        <div class="mt-4">
            <label class="text-lg text-purple-500">
                <input
                    type="radio"
                    v-model="operation"
                    value="addition"
                    class="mr-2"
                />
                Addition
            </label>
            <label class="ml-4 text-lg text-purple-500">
                <input
                    type="radio"
                    v-model="operation"
                    value="subtraction"
                    class="mr-2"
                />
                Subtraction
            </label>
        </div>
        <div class="mt-4">
            <label class="text-lg text-purple-500">
                Number of digits:
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
</style>
