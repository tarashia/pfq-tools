<script setup>
    defineProps(['name'])
    // todo: load in the data from static data instead
</script>

<template>
    <select :name="name">
        <option selected value="">Delta?</option>
        <option value="">None</option>
        <option>Normal</option>
        <option>Fire</option>
        <option>Water</option>
        <option>Electric</option>
        <option>Grass</option>
        <option>Ice</option>
        <option>Fighting</option>
        <option>Poison</option>
        <option>Ground</option>
        <option>Flying</option>
        <option>Psychic</option>
        <option>Bug</option>
        <option>Rock</option>
        <option>Ghost</option>
        <option>Dragon</option>
        <option>Dark</option>
        <option>Steel</option>
        <option>Fairy</option>
    </select>
</template>

<style scoped>
</style>
