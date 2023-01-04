import {createAngularRouterApi, createApi} from './easyrouting.js';

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
            },
            parentRoute: {
                isParent: true as const,
                subRoutes: {
                    childRoute: {}
                }
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
    });
});

describe("The router routing API", () => {
    it("Should generate URLs from plain, tree-like objects", () => {
        const routerApi = createAngularRouterApi(routes);
        expect(routerApi.root.home.recent()).toEqual("root/home/recent");
    });

    it("Prints route params with the colon syntax", () => {
        const routerApi = createAngularRouterApi(routes);
        expect(routerApi.root.articles.$articleId()).toEqual("root/articles/:articleId");
    });

    it("Allows overriding segment names for long or reserved strings", () => {
        const api = createAngularRouterApi(routes);
        expect(api.root.override()).toEqual("root/actual");
    });

    it("Throws an error if a reserved name is used for a route segment", () => {
        expect(() => createApi({ name: {} })).toThrow(/You have used the reserved keywords "name" in your route/);
    });

    it("Correctly treats parent and child routes", () => {
        const api = createAngularRouterApi(routes);
        expect(api.root.parentRoute()).toEqual("root/parentRoute");
        expect(api.root.parentRoute.childRoute()).toEqual("childRoute");
    })
});
