import { createRxDatabase } from 'rxdb';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';

const pkmnSchema = {
    title: 'pkmn schema',
    version: 0,
    primaryKey: 'formeid',
    type: 'object',
    properties : {
        formeid: { 
            type: 'string',
            maxLength: 20 
        },
        region_name: { type: 'string' },
        name: { type: 'string' },
        formename: { type: 'string' },
        types: {
            type: 'array',
            items: { type: 'string' }
        },
        hasegg: { type: 'boolean' },
        genders: { type: 'string' },
        expToHatch: { type: 'number' },
        expGroup: { type: 'string' },
        egggroup: { type: 'string' },
        colors: {
            type: 'array',
            items: { type: 'string' }
        },
        size: {
            type: 'object',
            properties: {
                height: { type: 'number' },
                weight: { type: 'number' }
            }
        },
        bodytype: { type: 'string' }
    }
};

export async function initDatabase() {
    const db = await createRxDatabase({
        name: 'dexdb',
        storage: getRxStorageLocalstorage(),
        multiInstance: true,
        eventReduce: true
    });
  
    await db.addCollections({
        dex: {
            schema: pkmnSchema
        }
    });
  
    return db;
}

