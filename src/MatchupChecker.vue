<script setup>
import { onMounted, ref } from 'vue'
import { natureMatch, hasConflict } from './js/staticData.js'
import NatureDropdown from './components/NatureDropdown.vue'
import DeltaTypeDropdown from './components/DeltaTypeDropdown.vue'

const { dbHandle } = defineProps(['dbHandle']);
const output = ref('(not run)');

let db;
onMounted(async () => {
    db = await dbHandle;
})

async function checkMatch() {
    //const data = new FormData(document.getElementById("matchupForm"));
    const data = Object.fromEntries(new FormData(document.getElementById("matchupForm")));
    const pkmn1 = await db.dex.findOne(data.pkmn1).exec();
    const pkmn2 = await db.dex.findOne(data.pkmn2).exec();
    if(!pkmn1 || !pkmn2) {
        output.value = 'Error: Pokemon not found'; //todo imporve error handling
    }
    let matchup = {
        pkmn1: pkmn1.name,
        pkmn2: pkmn2.name
    };
    if(pkmn1.formename) {
        matchup.pkmn1 += '/' + pkmn1.formename;
    }
    if(pkmn2.formename) {
        matchup.pkmn2 += '/' + pkmn2.formename;
    }

    /* EGG GROUP */
    if(
        (pkmn1.egggroup1 == 'Undiscovered' || pkmn2.egggroup1 == 'Undiscovered') ||
        (pkmn1.egggroup1 != pkmn2.egggroup1 &&
        pkmn1.egggroup1 != pkmn2.egggroup2 &&
        pkmn1.egggroup2 != pkmn2.egggroup1 &&
        pkmn1.egggroup2 != pkmn2.egggroup2)
    ) {
        output.value = 'Not compatible';
    }

    // Base compatibility = 20%
    let comp = 20;
    
    /* TYPES */
    if(
        pkmn1.type1 == pkmn2.type1 ||
        (pkmn1.type1 == pkmn2.type2 && pkmn2.type2 != null) ||
        (pkmn1.type2 == pkmn2.type1 && pkmn1.type2 != null) ||
        (pkmn1.type2 == pkmn2.type2 && pkmn1.type2 != null && pkmn2.type2 != null)
    ) {
        comp += 8;
        matchup.type = 'match +8%';
    }
    else if(hasConflict(pkmn1.type1, pkmn1.type2, pkmn2.type1, pkmn2.type2)) {
        matchup.type = 'conflict 0%';
    }
    else {
        comp += 4;
        matchup.type = 'neutral +4%';
    }

    /* BODY */
    if(pkmn1.bodytype == pkmn2.bodytype) {
        comp += 8;
        matchup.bodytype = 'match +8%';
    }
    else {
        matchup.bodytype = 'no match 0%';
    }

    /* SIZE */
    const heightDiff = Math.abs(pkmn1.size.height - pkmn2.size.height).toFixed(2);
    if(heightDiff > 0.8) {
        let heightPenalty = Math.floor((heightDiff - 0.8) / 0.4);
        if(heightPenalty > 15) {
            heightPenalty = 15;
        }
        comp -= heightPenalty;
        matchup.heightPenalty = '-' + heightPenalty + '%';
    }
    const weightDiff = Math.abs(pkmn1.size.weight - pkmn2.size.weight).toFixed(2);
    if(weightDiff > 100) {
        let weightPenalty = Math.floor((weightDiff - 100) / 20);
        if(weightPenalty > 10) {
            weightPenalty = 10;
        }
        comp -= weightPenalty;
        matchup.weightPenalty = '-' + weightPenalty + '%';
    }

    /* NATURE */
    if('nature1' in data && 'nature2' in data) {
        const nat = natureMatch(data.nature1,data.nature2);
        if(nat == 3) {
            comp += 14;
            matchup.nature = 'exact match +14%';
        }
        else if(nat == 2) {
            comp += 8;
            matchup.nature = 'shares like +8%';
        }
        else if(nat == 1){
            comp += 4;
            matchup.nature = 'shares dislike +4%';
        }
        else {
            matchup.nature = 'no match 0%';
        }
    }
    else {
        matchup.nature = 'not provided';
    }

    /* TRADE */
    if('traded' in data && (data.traded===true || data.traded=='true' || data.traded=='on')) {
        comp += 20;
        matchup.traded = 'true +20%';
    }

    if(comp < 10) {
        comp = 10;
        matchup.clamping = 'clamped to 10%';
    }
    matchup.compatibility = comp;

    output.value = JSON.stringify(matchup);
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
        <p>{{ output }}</p>
    </div>
</template>

<style scoped>
</style>
