import {createApi} from './easyrouting.js';

const testRoutes = {
    "nest": {
        segmentName: "https://exciting-world.com/nest",
        isParent: true,
        subRoutes: {
            "plaetze-feature": {
                isParent: true,
                subRoutes: {
                    "$gebaeude_id": {
                        subRoutes: {
                            "$geschoss_id": {}
                        }
                    }
                }
            },
            "mitarbeiter-feature": {
                subRoutes: {
                    "add-mitarbeiter": {
                        subRoutes: {
                            "$team-id": {}
                        }
                    },
                    "edit-mitarbeiter": {
                        subRoutes: {
                            "$mitarbeiter_id": {}
                        }
                    },
                    "add-team": {},
                    "edit-team": {
                        subRoutes: {
                            "$team_id": {}
                        }
                    }
                }
            },
            "admin-feature": {},
        }
    },
    "test": {}
} as const;

// @ts-ignore
const routes = createApi(testRoutes);

console.log(routes);
// @ts-ignore
console.log(routes.nest['plaetze-feature']())
