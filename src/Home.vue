<script setup>
import { onMounted, ref, watch } from 'vue'
import { updateDex } from './js/pfqApi.js'

const { dbHandle } = defineProps(['dbHandle']);
const apiKey = ref('');
const lastUpdated = ref('');

watch(apiKey, () => {
    if(apiKey.value && apiKey.value.trim() != '') {
        localStorage.setItem('x-api-key', apiKey.value);
    }
    else {
        console.log('Did not store empty API key');
    }
})

let db;
onMounted(async () => {
    db = await dbHandle;
    apiKey.value = localStorage.getItem('x-api-key');
    lastUpdated.value = localStorage.getItem('dex-updated');
})

async function runUpdate() {
    if(await updateDex(db)) {
        const dateStr = new Date().toLocaleString();
        localStorage.setItem('dex-updated', dateStr);
        lastUpdated.value = dateStr;
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
