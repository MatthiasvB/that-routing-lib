# that-routing-lib
*Stop worrying about those URLs*
## Intro
This library provides an easy-to-use API to build URLs in your JS/TS-project. Creating a URL-string that links to a given location becomes as simple as

```typescript
// "/articles/4/edit"
const editArticle4 = routesApi.articles.$articleId("4").edit();
```
with full Typescript support.

`that-routing-lib` has been designed with the Angular router in mind, but the client side functionality can be used to construct URLs for any setting.

## Why use this lib?
Whenever we need a URL in our projects, we can typically choose to either
- Write the URL out as a string 
- Use predefined constants for given URLs

The first method is prone to typos and difficult to adjust should things change eventually. The latter method is safe with regard to these problems, but poses the question of which parts of a URL to save as constants. The entire URL? Or each segment separately? Saving the entire URL, as in `/topics/cooking/soup` is easy to use, but requires a lot of variables for each possible URL, such as `/topics/cooking/fish` and `/topics/travel/spain`. When saving each segment, we avoid having one constant per leaf in our routes tree, but have no way of knowing whether `TOPICS + '/' + FISH + '/' + SPAIN` is a valid URL or not. And what about route parameters as in `/topics/travel/articles/4`?

We need a scheme that allows us to
- centrally define all routes to avoid typos
- preserve the structure of route segments and URL params
- easily refactor code
- access URLs easily with minimal risk of mistakes

`that-routing-lib` helps you in fulfilling all these requirements, by allowing you to specify your routes with minimal effort in a tree-like structure and providing functions to turn this data into function objects with a super nifty developer experience.

## How to define your URL tree
In the simplest case, your URLs are defined as follows

```typescript
import {buildRoutes} from './that-routing-lib';

const routesDefinition = {
    home: {},
    topics: {
        subRoutes: {
            cooking: {
                subRoutes: {
                    soup: {},
                    fish: {}
                }
            },
            travel: {
                subRoutes: {
                    spain: {},
                    articles: {
                        subRoutes: {
                            $articleId: {}
                        }
                    }
                }
            }
        }
    }
};

const routesApi = buildRoutes(routesDefinition);
```
The strings of the keys which you use are directly turned into the strings of your URL segments. URL params are prefixed with a dollar sign `$`, which will make the resulting API prompt for a string parameter when you construct an actual instance of the URL.

## Reserved keywords
Under the hood, the library constructs a nested function object. That's why, at any point along your route, you can either call the function to return the string, or continue to build a URL that is nested more deeply:
```typescript
// "topics/travel"
const routeToTravel = routesApi.topics.travel()

// "topics/travel/acticles/5
const routeToTravelArticle = routesApi.topics.travel.articles.$articleId("5")()
```

Unfortunately, with any segment of the API being a function, there are a few reserved keywords which can not be used, because they are either readonly (such as a function's `name`) or should not be overwritten (like `bind`). When you try to create the API object with input that contains these keys, an error will be thrown.

Reserved keywords are
```typescript
['name', 'arguments', 'length', 'caller', 'prototype', 'bind']
```

Since it is quite likely that strings like `name` will be part of a URL, you can overwrite the string associated with a given URL segment with the `segmentName` property:

```typescript
import {buildRoutes} from './that-routing-lib';

const routesDefiniton = {
    user: {
        subRoutes: {
            $userId: {
                subRoutes: {
                    uname: {
                        segmentName: "name" // overwrite
                    }
                }
            }
        }
    }
};

const routesApi = buildRoutes(routesDefiniton);

// "user/78357/name"
const nameUrl = routesApi.user.$userId("78357").uname();
```
this can also be useful to prepend slashes, entire domain names, or insert chars that would require string notation for keys when used directly:

```typescript
import {buildRoutes} from './that-routing-lib';

const routesDefiniton = {
    sameOrigin: {
        segmentName: "", // leads to a leading '/'
        subRoutes: {
            home: {},
            articles: {}
        }
    },
    analytics: {
        segmentName: "https://my-analytics.com",
        subRoutes: {
            pageEnter: {
                // avoid routesApi.analytics['page-enter'].$pageId("3")()
                segmentName: "page-enter",
                subRoutes: {
                    $pageId: {}
                }
            },
            pageNavigation: {
                segmentName: "page-navigation",
                subRoutes: {
                    $fromPageId: {
                        subRoutes: {
                            $toPageId: {}
                        }
                    }
                }
            }
        }
    }
}

const routesApi = buildRoutes(routesDefiniton);

// "https://my-analytics.com/page-navigation/etkceaua/aetaeo"
const navigationAnalyticsUrl = routesApi.analytics.pageNavigation.$fromPageId("etkceaua").$toPageId("aetaeo")()
```
**Note:** You can not use `segmentName` to overwrite `$parameter`s, because no reserved keyword starts with a `$`, and there is no other reason why you'd want to do this for parameters.

## Creating URL strings for the Angular router
When you use routing in Angular, you have to define which component is to be shown under which route. Of course, you'll want to have a single source of truth, so your `routesInput` must be able to produce those route definitions as well.

Two requirements have to be fulfilled for this to work:
- Route params have to be printed with the colon syntax `acticles/:articleId`
- Routes can be nested. Instead of `parentRoute/childRoute` you'll have to be able to produce `parentRoute` and `childRoute` separately

The router API works exactly the same as the client API, except that now you don't have to pass a string to parameter segments. To signal that a given route is a parent route, you add the key `isParent: true` to the object:

```typescript
import {buildRoutesForAngularRouter} from './that-routing-lib';

const routesDefinition = {
    topics: {
        subRoutes: {
            travel: {
                isParent: true as const,
                subRoutes: {
                    articles: {},
                    spain: {}
                }
            },
            otherParent: {
                isParent: true as const,
                subRoutes: {
                    $parameter: {}
                }
            }
        }
    }
};

const routesApi = buildRoutesForAngularRouter(routesDefinition);

// "topics/travel
const urlForParentForRouter = routesApi.topics.travel();
// "articles"
const urlForChildForRouter = routesApi.topics.travel.articles();
// ":parameter"
const urlForParameterChildForRouter = routesApi.topics.otherParent.$parameter();
```

## Gotchas
- Due to Typescript technicalities, the maximum depth of your URLs is 30ish segments. That's because a recursive type has to be used, and the stack-size that TS allows is very limited. It's possible that this limit will be increased eventually.

## Open issues
- No support for query params

