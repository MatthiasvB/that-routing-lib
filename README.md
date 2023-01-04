# easyrouting
## Intro
This library provides an easy-to-use API to build URLs in your JS/TS-project. Creating a URL-string that links to a given location becomes a simple as

```typescript
// /articles/4/edit
const editArticle3 = routesApi.articles.$articleId("4").edit();
```
while providing full Typescript support.

`easyrouting` has been designed with the Angular router in mind, but the client side functionality can be used to construct URLs for any setting.

## Why use this lib?
Whenever we need a URL in our projects, we can typically choose to either
- Write the URL out as a string 
- Use predefined constants for given URLs

The first method is prone to typos and difficult to adjust should things change eventually. The latter method is safe with regard to these problems, but poses the question which part of a URL to safe as constants? The entire URL? Or each segment separately? Saving the entire URL, as in `/topics/cooking/soup` is easy to use, but requires a lot of variables for each possible URL, such as `/topics/cooking/fish` and `/topics/travel/spain`. When saving each segment, we avoid this combinatory hell, but have no way of knowing whether `topics + '/' + fish + '/' + spain` is a valid URL or not. And what about route parameters as in `/topics/travel/articles/4`?

What need a scheme that allows us to
- centrally define all routes to avoid typos
- preserve the structure of route segments and URL params
- easily refactor code
- access URLs easily with minimal risk of mistakes

`easyrouting` helps you in fulfilling all these requirements, by allowing you to specify your routes with minimal effort in a tree-like structure and providing functions to turn this data into function objects with a super nifty developer experience.

## How to define your URL tree
In the simplest case, your URLs are defined as follows

```typescript
import {createApi} from './easyrouting';

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

const routesApi = createApi(routesDefinition);
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

Unfortunately, with any segment of the API being a function, there are a few reseved keywords which can not be used, because they are either readonly (such as a function's `name`) or should not be overwritten (like `bind`). When you try to create the API object with input that contains these keys, an error will be thrown.

Since it is quite likely that strings like `name` will be part of a URL, you can overwrite the string associated with a given URL segment with the `segmentName` property:

```typescript
import {createApi} from './easyrouting';

const routesDefiniton = {
    user: {
        subRoutes: {
            $userId: {
                subRoutes: {
                    uname: {
                        segmentName: "name"
                    }
                }
            }
        }
    }
};

const routesApi = createApi(routesDefiniton);

// "user/78537/name"
const nameUrl = routesApi.user.$userId("78357").uname();
```
this can also be useful to append slashes, entire domain names, or insert chars that would require string notation for keys when used directly:

```typescript
import {createApi} from './easyrouting';

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

const routesApi = createApi(routesDefiniton);

// "https://my-analytics.com/page-navigation/etkceaua/aetaeo"
const navigationAnalyticsUrl = routesApi.analytics.pageNavigation.$fromPageId("etkceaua").$toPageId("aetaeo")()
```
Note: You can not use `segmentName` to overwrite `$parameter`s, because no reserved keyword starts with a `$`, and there is no other reason why you'd want to do this for parameters.

## Creating URL strings for the Angular router
When you use routing in Angular, you have to define which Component is to be shown under which route. Of course, you'll want to have a single source of thruth, so your `routesInput` must be able to produce those route definitions as well.

Two requirements have to be fulfilled for this to work:
- Route params have to be printed with the colon syntax `acticles/:articleId`
- Routes can be nested. Instead of `parentRoute/childRoute` you'll have to be able to produce `parentRoute` and `childRoute` separately



## Gotchas
- Due to Typescript technicalities, the maximum depth of your URLs is 30ish segments. That's because a recursive type has to be used, and the stack-size that TS allows is very limited. It's possible that this limit will be increased eventually.

