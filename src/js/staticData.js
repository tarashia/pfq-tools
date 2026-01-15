export const natures = {
    "Serious" : { "up": "any", "down": "any" },
    "Lonely" : { "up": "spicy", "down": "sour" },
    "Adamant" : { "up": "spicy", "down": "dry" },
    "Naughty" : { "up": "spicy", "down": "bitter" },
    "Brave" : { "up": "spicy", "down": "sweet" },
    "Bold" : { "up": "sour", "down": "spicy" },
    "Hardy" : { "up": "any", "down": "any" },
    "Impish" : { "up": "sour", "down": "dry" },
    "Lax" : { "up": "sour", "down": "bitter" },
    "Relaxed" : { "up": "sour", "down": "sweet" },
    "Modest" : { "up": "dry", "down": "spicy" },
    "Mild" : { "up": "dry", "down": "sour" },
    "Bashful" : { "up": "any", "down": "any" },
    "Rash" : { "up": "dry", "down": "bitter" },
    "Quiet" : { "up": "dry", "down": "sweet" },
    "Calm" : { "up": "bitter", "down": "spicy" },
    "Gentle" : { "up": "bitter", "down": "sour" },
    "Careful" : { "up": "bitter", "down": "dry" },
    "Docile" : { "up": "any", "down": "any" },
    "Sassy" : { "up": "bitter", "down": "sweet" },
    "Timid" : { "up": "sweet", "down": "spicy" },
    "Hasty" : { "up": "sweet", "down": "sour" },
    "Jolly" : { "up": "sweet", "down": "dry" },
    "Naïve" : { "up": "sweet", "down": "bitter" },
    "Quirky" : { "up": "any", "down": "any" }
}

export const types = {
    "normal" : {
        "weak" : ["fighting"],
        "resist" : ["ghost"]
    },
    "fire" : {
        "weak" : ["ground","rock","water"],
        "resist" : ["bug","grass","steel","ice","fairy"]
    },
    "water" : {
        "weak" : ["grass","electric"],
        "resist" : ["fire","ice","steel"]
    },
    "electric" : {
        "weak" : ["ground"],
        "resist" : ["flying","steel"]
    },
    "grass" : {
        "weak" : ["flying","poison","bug","fire","ice"],
        "resist" : ["ground","water","electric"]
    },
    "ice" : {
        "weak" : ["fighting","rock","fire","steel"],
        "resist" : []
    },
    "fighting" : {
        "weak" : ["flying","psychic","fairy"],
        "resist" : ["rock","bug","dark"]
    },
    "poison" : {
        "weak" : ["ground","psychic"],
        "resist" : ["fighting","grass","bug","fairy"]
    },
    "ground" : {
        "weak" : ["water","grass","ice"],
        "resist" : ["poison","rock","electric"]
    },
    "flying" : {
        "weak" : ["rock","electric","ice"],
        "resist" : ["fighting","bug","grass","ground"]
    },
    "psychic" : {
        "weak" : ["bug","ghost","dark"],
        "resist" : ["fighting"]
    },
    "bug" : {
        "weak" : ["flying","rock","fire"],
        "resist" : ["fighting","ground","grass"]
    },
    "rock" : {
        "weak" : ["fighting","ground","water","grass","steel"],
        "resist" : ["normal","flying","poison","fire"]
    },
    "ghost" : {
        "weak" : ["dark"],
        "resist" : ["poison","bug","normal","fighting"]
    },
    "dragon" : {
        "weak" : ["ice","fairy"],
        "resist" : ["fire","water","grass","electric"]
    },
    "dark" : {
        "weak" : ["fighting","bug","fairy"],
        "resist" : ["ghost","psychic"]
    },
    "steel" : {
        "weak" : ["fighting","ground","fire"],
        "resist" : ["normal","flying","rock","bug","grass","psychic","ice","dragon","fairy","poison"]
    },
    "fairy" : {
        "weak" : ["poison","steel"],
        "resist" : ["fighting","bug","dark","dragon"]
    }
}

export function natureMatch(nature1, nature2) {
    if(nature1 == nature2) {
        return 3;
    }
    else if(natures[nature1]['up'] == natures[nature2]['up']) {
        return 2;
    }
    else if(natures[nature1]['down'] == natures[nature2]['down']) {
        return 1;
    }
    else {
        return 0;
    }
}

export function isWeak(type1, type2, attack) {
    // check if either type is weak to this attack
    let weak = types[type1]['weak'].includes(attack);
    if(type2) {
        weak = weak || types[type2]['weak'].includes(attack);
    }

    // check if either type resists this attack
    let resist = types[type1]['resist'].includes(attack);
    if(type2) {
        resist = resist || types[type2]['resist'].includes(attack);
    }
    
    // if the weakness is not countered, return true
    return isWeak && !resist;
}

export function hasConflict(pkmn1Type1, pkmn1Type2, pkmn2Type1, pkmn2Type2) {
    if(
        isWeak(pkmn1Type1.toLowerCase(), pkmn1Type2.toLowerCase(), pkmn2Type1.toLowerCase()) ||
        isWeak(pkmn1Type1.toLowerCase(), pkmn1Type2.toLowerCase(), pkmn2Type2.toLowerCase()) ||
        isWeak(pkmn2Type1.toLowerCase(), pkmn2Type2.toLowerCase(), pkmn1Type1.toLowerCase()) ||
        isWeak(pkmn2Type1.toLowerCase(), pkmn2Type2.toLowerCase(), pkmn1Type2.toLowerCase())
    ) {
        return true;
    }
    return false;
}
