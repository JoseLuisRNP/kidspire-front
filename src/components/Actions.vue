<script setup>

const emits = defineEmits(['clickNumber', 'checkAnswer', 'clearAnswer']);
const props = defineProps(['feedback']);
</script>
<template>
    <div>
        <div class="numbers-container mb-4 flex flex-wrap justify-center">
            <div
                v-for="n in 10"
                :key="n"
                class="number m-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-2xl text-white"
                draggable="true"
                @dragstart="handleDrag"
                @click="() => emits('clickNumber', n - 1)"
            >
                {{ n - 1 }}
            </div>
        </div>
        <div class="flex justify-center mb-4">
            <button
            @click="emits('checkAnswer')"
            class="rounded-full bg-yellow-400 px-6 py-2 text-xl text-white mx-2"
        >
            Resolver
        </button>
        <button
            @click="emits('clearAnswer')"
            class="rounded-full bg-red-400 px-6 py-2 text-xl text-white mx-2"
        >
            Borrar
        </button>
        </div>
        
        <p
            class="mt-4 text-2xl flex justify-center"
            :class="{
                'text-green-500': feedback === '¡Correcto!',
                'text-red-500': feedback !== '¡Correcto!',
            }"
        >
            {{ feedback }}
        </p>
    </div>
</template>