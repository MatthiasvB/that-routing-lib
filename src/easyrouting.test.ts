import {createApi} from './easyrouting.js';

describe("The client routing API", () => {
    it("Should generate URLs from plain, tree-like objects", () => {
        const routes = {
            root: {
                subRoutes: {
                    home: {
                        subRoutes: {
                            recent: {}
                        }
                    }
                }
            }
        }
        const api = createApi(routes)
        expect(api.root.home.recent()).toEqual("root/home/recent");
    })
})
