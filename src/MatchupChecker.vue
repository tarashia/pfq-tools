<script setup>
import { onMounted, ref } from 'vue'
import { natureMatch, hasConflict } from './js/staticData.js'
import NatureDropdown from './components/NatureDropdown.vue'
import DeltaTypeDropdown from './components/DeltaTypeDropdown.vue'

const { dbHandle } = defineProps(['dbHandle']);
const matchup = ref({
    error: '(not run)'
});

let db;
onMounted(async () => {
    db = await dbHandle;
})

async function checkMatch() {
    const data = Object.fromEntries(new FormData(document.getElementById("matchupForm")));
    const pkmn1 = await db.dex.findOne(data.pkmn1).exec();
    const pkmn2 = await db.dex.findOne(data.pkmn2).exec();
    if(!pkmn1 || !pkmn2) {
        matchup.value.error = 'Error: Pokemon not found'; //todo improve error handling
        return;
    }
    matchup.value.error = '';
    matchup.value.pkmn1 = pkmn1.name;
    matchup.value.pkmn2 = pkmn2.name;

    if(pkmn1.formename) {
        matchup.value.pkmn1 += '/' + pkmn1.formename;
    }
    if(pkmn2.formename) {
        matchup.value.pkmn2 += '/' + pkmn2.formename;
    }

    /* EGG GROUP */
    if(
        (pkmn1.egggroup1 == 'Undiscovered' || pkmn2.egggroup1 == 'Undiscovered') ||
        (pkmn1.egggroup1 != pkmn2.egggroup1 &&
        pkmn1.egggroup1 != pkmn2.egggroup2 &&
        pkmn1.egggroup2 != pkmn2.egggroup1 &&
        pkmn1.egggroup2 != pkmn2.egggroup2)
    ) {
        matchup.value.error = 'Not compatible';
        return;
    }

    // Base compatibility = 20%
    let comp = 20;
    
    /* TYPES */
    if(
        pkmn1.types[0] == pkmn2.types[0] ||
        (pkmn2.types[1] != '' && pkmn1.types[0] == pkmn2.types[1]) ||
        (pkmn1.types[1] != '' && pkmn1.types[1] == pkmn2.types[0]) ||
        (pkmn1.types[1] != '' && pkmn2.types[1] != '' && pkmn1.types[1] == pkmn2.types[1])
    ) {
        comp += 8;
        matchup.value.type = 'Match +8%';
    }
    else if(hasConflict(pkmn1.types[0], pkmn1.types[1], pkmn2.types[0], pkmn2.types[1])) {
        matchup.value.type = 'Conflict 0%';
    }
    else {
        comp += 4;
        matchup.value.type = 'Neutral +4%';
    }

    /* BODY */
    if(pkmn1.bodytype == pkmn2.bodytype) {
        comp += 8;
        matchup.value.bodytype = '+8%';
    }
    else {
        matchup.value.bodytype = '0%';
    }

    /* SIZE */
    const heightDiff = Math.abs(pkmn1.size.height - pkmn2.size.height).toFixed(2);
    if(heightDiff > 0.8) {
        let heightPenalty = Math.floor((heightDiff - 0.8) / 0.4);
        if(heightPenalty > 15) {
            heightPenalty = 15;
        }
        comp -= heightPenalty;
        matchup.value.heightPenalty = '-' + heightPenalty + '%';
    }
    else {
        delete matchup.value.heightPenalty;
    }
    const weightDiff = Math.abs(pkmn1.size.weight - pkmn2.size.weight).toFixed(2);
    if(weightDiff > 100) {
        let weightPenalty = Math.floor((weightDiff - 100) / 20);
        if(weightPenalty > 10) {
            weightPenalty = 10;
        }
        comp -= weightPenalty;
        matchup.value.weightPenalty = '-' + weightPenalty + '%';
    }
    else {
        delete matchup.value.weightPenalty;
    }

    /* NATURE */
    const nat = natureMatch(data.nature1,data.nature2);
    if(nat == 3) {
        comp += 14;
        matchup.value.nature = 'Exact match +14%';
    }
    else if(nat == 2) {
        comp += 8;
        matchup.value.nature = 'Shares like +8%';
    }
    else if(nat == 1){
        comp += 4;
        matchup.value.nature = 'Shares dislike +4%';
    }
    else if(nat == 0) {
        matchup.value.nature = 'No match 0%';
    }
    else {
        delete matchup.value.nature;
    }

    /* TRADE */
    if('traded' in data && (data.traded===true || data.traded=='true' || data.traded=='on')) {
        comp += 20;
        matchup.value.traded = '+20%';
    }
    else {
        delete matchup.value.traded;
    }

    if(comp < 10) {
        comp = 10;
        matchup.value.clamping = 'Clamped to 10%';
    }
    else {
        delete matchup.value.clamping;
    }

    matchup.value.compatibility = comp;
}

</script>

<template>
    <p>This is the matchup checker</p>
    <form id="matchupForm">
        <div>
            <input placeholder="Dex ID 1" name="pkmn1" value="315">
            <NatureDropdown name="nature1" />
            <!--<DeltaTypeDropdown name="delta1" />-->
        </div>
        <div>
            <input placeholder="Dex ID 2" name="pkmn2" value="335">
            <NatureDropdown name="nature2" />
            <!--<DeltaTypeDropdown name="delta2" />-->
        </div>
        <div>
            <input type="checkbox" id="traded" name="traded"/> <label for="traded">Traded?</label>
        </div>
    </form>
    <div>
        <button @click="checkMatch">Check</button>
    </div>
    <div>
        <p>This checker assumes Pokemon are from separate evolutionary lines. <br>It will never include the species bonus, which can add 6, 8, or 10%.</p>
        <p v-if="matchup.error !=''">{{ matchup.error }}</p>
        <div v-else>
            <p>{{ matchup.pkmn1 }} + {{ matchup.pkmn2 }} = {{ matchup.compatibility }}% base</p>
            <ul>
                <li>Base: 20%</li>
                <li>Body type: {{ matchup.bodytype }}</li>
                <li>Type matchup: {{ matchup.type }}</li>
                <li v-if="Object.hasOwn(matchup, 'nature')">Nature matchup: {{ matchup.nature }}</li>
                <li v-if="Object.hasOwn(matchup, 'heightPenalty')">Height difference: {{ matchup.heightPenalty }}</li>
                <li v-if="Object.hasOwn(matchup, 'weightPenalty')">Weight difference: {{ matchup.weightPenalty }}</li>
                <li v-if="Object.hasOwn(matchup, 'traded')">Traded: {{ matchup.traded }}</li>
                <li v-if="Object.hasOwn(matchup, 'clamping')">Clamping: {{ matchup.clamping }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
</style>
