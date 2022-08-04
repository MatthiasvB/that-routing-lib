import {ExtractKeys} from './easyrouting';

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


type extractedKeys = ExtractKeys<typeof nestedObject>
