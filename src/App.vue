<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { initDatabase } from './js/rxDB.js'
import Home from './Home.vue'
import MatchupChecker from './MatchupChecker.vue'
import NotFound from './NotFound.vue'

const routes = {
    '/': Home,
    '/matchup': MatchupChecker
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})

let db;
onBeforeMount(() => {
    db = initDatabase();
})
</script>

<template>
    <a href="#/">Home</a> |
    <a href="#/matchup">Matchup Checker</a> |
    <a href="#/non-existent-path">Broken Link</a>
    <component :is="currentView" :dbHandle="db" />
</template>
