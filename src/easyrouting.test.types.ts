import {ExtractKeys} from './easyrouting.js';

const nestedObject = {
    ho: {
        hi: {
            ha: {
                hu: 'hu'
            }
        },
        di: {
            do: {
                du: 'du'
            }
        }
    },
    bo: {
        bu: 'bu'
    }
}


type extractedKeys = ExtractKeys<typeof nestedObject>;
