import {buildRoutesForAngularRouter, buildRoutes, extractParameters} from './that-routing-lib.js';

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
                    childRoute: {},
                    $parameterChild: {}
                }
            }
        }
    }
};

describe("The client routing API", () => {
    it("Should generate URLs from plain, tree-like objects", () => {
        const api = buildRoutes(routes);
        expect(api.root.home.recent()).toEqual("root/home/recent");
    });

    it("Processes route params", () => {
        const api = buildRoutes(routes);
        expect(api.root.articles.$articleId("7")()).toEqual("root/articles/7")
        expect(api.root.articles.$articleId("7").edit()).toEqual("root/articles/7/edit")
    });

    it("Allows overriding segment names for long or reserved strings", () => {
        const api = buildRoutes(routes);
        expect(api.root.override()).toEqual("root/actual");
    });

    it("Throws an error if a reserved name is used for a route segment", () => {
        expect(() => buildRoutes({ name: {} })).toThrow(/You have used the reserved keywords "name" in your route/);
    });
});

describe("The router routing API", () => {
    it("Should generate URLs from plain, tree-like objects", () => {
        const routerApi = buildRoutesForAngularRouter(routes);
        expect(routerApi.root.home.recent()).toEqual("root/home/recent");
    });

    it("Prints route params with the colon syntax", () => {
        const routerApi = buildRoutesForAngularRouter(routes);
        expect(routerApi.root.articles.$articleId()).toEqual("root/articles/:articleId");
    });

    it("Allows overriding segment names for long or reserved strings", () => {
        const api = buildRoutesForAngularRouter(routes);
        expect(api.root.override()).toEqual("root/actual");
    });

    it("Throws an error if a reserved name is used for a route segment", () => {
        expect(() => buildRoutes({ name: {} })).toThrow(/You have used the reserved keywords "name" in your route/);
    });

    it("Correctly treats parent and child routes", () => {
        const api = buildRoutesForAngularRouter(routes);
        expect(api.root.parentRoute()).toEqual("root/parentRoute");
        expect(api.root.parentRoute.childRoute()).toEqual("childRoute");
        expect(api.root.parentRoute.$parameterChild()).toEqual(":parameterChild");
    });
});

describe("The parameter extraction routine", () => {
   it("Extracts parameters from the route definitons", () => {
       const params = extractParameters(routes);
       expect(params.$articleId).toEqual("articleId");
   });
});
