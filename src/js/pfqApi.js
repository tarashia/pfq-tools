async function fetchDex(apiKey) {
    const url = 'https://api.pokefarm.com/v1/pokemon/dex?components=101,102,103,104,105,106,107';
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': apiKey
            }
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

function transformSchema(apiData) {
    let dexData = [];
    for(const region in apiData) {
        for(const pkmn in apiData[region].pokemon) {
            let pkmnEntry = structuredClone(apiData[region].pokemon[pkmn]);
            pkmnEntry.region_name = apiData[region].region_name;
            pkmnEntry.hasegg = pkmnEntry.eggdesc !== null;
            delete pkmnEntry.eggdesc;
            delete pkmnEntry.pkmndesc;
            if(pkmnEntry.types.length == 1) {
                pkmnEntry.types[1] = '';
            }
            dexData.push(pkmnEntry);
        }
    }
    return dexData;
}

// todo: better error handling? throw for vue functions to catch?
export async function updateDex(db) {
    const fetchedData = await fetchDex(apiKey.value);
    if(fetchedData) {
        const result = await db.dex.bulkUpsert(transformSchema(fetchedData));
        if(!result || result.error.length > 0) {
            console.error('Failed to update RxDB');
            console.log(result);
        }
        else {
            console.log('Updated dex DB');
            return true;
        }
    }
    else {
        console.error('Failed to fetch dex from API');
    }
    return false;
}
