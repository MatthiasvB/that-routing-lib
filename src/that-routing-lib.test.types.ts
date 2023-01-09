import {ParametersObject} from './that-routing-lib.js';

const nestedObject = {
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

type extractedObject = ParametersObject<typeof nestedObject>;

