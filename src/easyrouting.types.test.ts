import {ContinueIterating, ExtractKeys} from './easyrouting';

type nestedObject = {
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
        bu: {
            be: 'bu'
        }
    }
};


type extractedKeys = ExtractKeys<nestedObject>;


const c: extractedKeys = 'lodo';

type X = ContinueIterating<5, typeof nestedObject.ho.hi>;

type GetChars1<S> = S extends `${infer Char}${infer Rest}` ? Char | GetChars1<Rest> : never;

type GetChars2<S, Acc = never> = S extends `${infer Char}${infer Rest}` ? GetChars2<Rest, Char | Acc> : Acc;

// type Chars1 = GetChars1<'auaecumaska.ctuomiouemkeuhktajkcekaceohktkcmkxdkmoseihsqj;suqaw/kmhkosjwaqsjuhtidodkxmxesbd.pcypcrikm.p.ikcihihkkic,p.jiocydh.yhdckhico.phkcjoig'>

type Chars2 = GetChars2<'auaecumaska.ctuomiouemkeuhktajkcekaceohktkcmkxdkmoseihsqj;suqaw/kmhkosjwaqsjuhtidodkxmxesbd.pcypcrikm.p.ikcihihkkic,p.jiocydh.yhdckhico.phkcjoig'>
