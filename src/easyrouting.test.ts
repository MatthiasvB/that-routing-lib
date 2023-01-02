import {createApi} from './easyrouting.js';

const routes = {
    root: {
        subRoutes: {
            home: {
                subRoutes: {
                    recent: {}
                }
            },
            articles : {
                subRoutes: {
                    $articleId: {
                        subRoutes: {
                            edit: {}
                        }
                    }
                }
            },
            override: {
                segmentName: "actual",
            }
        }
    }
};

describe("The client routing API", () => {
    it("Should generate URLs from plain, tree-like objects", () => {
        const api = createApi(routes);
        expect(api.root.home.recent()).toEqual("root/home/recent");
    });

    it("Processes route params", () => {
        const api = createApi(routes);
        expect(api.root.articles.$articleId("7")()).toEqual("root/articles/7")
        expect(api.root.articles.$articleId("7").edit()).toEqual("root/articles/7/edit")
    });

    it("Allows overriding segment names for long or reserved strings", () => {
        const api = createApi(routes);
        expect(api.root.override()).toEqual("root/actual");
    });

    it("Throws an error if a reserved name is used for a route segment", () => {
        expect(() => createApi({ name: {} })).toThrow(/You have used the reserved keywords "name" in your route/);
    })
})
