<script setup>
    defineProps(['name'])
    // todo: load in the data from static data instead
</script>

<template>
    <select :name="name">
        <option selected value="">Nature</option>
        <option>Serious</option>
        <option>Lonely</option>
        <option>Adamant</option>
        <option>Naughty</option>
        <option>Brave</option>
        <option>Bold</option>
        <option>Hardy</option>
        <option>Impish</option>
        <option>Lax</option>
        <option>Relaxed</option>
        <option>Modest</option>
        <option>Mild</option>
        <option>Bashful</option>
        <option>Rash</option>
        <option>Quiet</option>
        <option>Calm</option>
        <option>Gentle</option>
        <option>Careful</option>
        <option>Docile</option>
        <option>Sassy</option>
        <option>Timid</option>
        <option>Hasty</option>
        <option>Jolly</option>
        <option>Naïve</option>
        <option>Quirky</option>
    </select>
</template>

<style scoped>
</style>
