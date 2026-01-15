<script setup>
import { onMounted, ref, watch } from 'vue'
import { updateDex } from './js/pfqApi.js'

const { dbHandle } = defineProps(['dbHandle']);
const apiKey = ref('');
const lastUpdated = ref('');

watch(apiKey, () => {
    localStorage.setItem("x-api-key", apiKey.value);
})

let db;
onMounted(async () => {
    db = await dbHandle;
    apiKey.value = localStorage.getItem("x-api-key");
    lastUpdated.value = localStorage.getItem("dex-updated");
})

async function runUpdate() {
    if(updateDex(db)) {
        const dateStr = new Date().toLocaleString();
    }
}

</script>

<template>
    <main>
        <p>This is the home page</p>
        <div>
            <label for="apiKey">Enter your API key: </label>
            <input placeholder="API Key" id="apiKey" name="apiKey" v-model="apiKey" size="32">
        </div>
        <div>
            <p>Dex updated: {{ lastUpdated ? lastUpdated : 'Never' }}</p>
            <button @click="runUpdate">Update Now</button>
        </div>
    </main>
</template>

<style scoped>
</style>
