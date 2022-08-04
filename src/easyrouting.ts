import {objectMap} from './shared/utils';

const isParent = 'isParent';
const parameters = 'parameters';
const forRouter = 'forRouter';

type Empty = Record<string, never>;

/**
 * Type for route segment with no sub-route. Empty for now, but could become more complex later on
 */
type ProtoLeafSegment = Empty;


/**
 * Type for route segment with sub-routes
 */
type ProtoCoreSegment = { [isParent]?: true, subRoutes: { [key: string]: ProtoSegment } };

/**
 * Type for any route segment
 */
type ProtoSegment = ProtoCoreSegment | ProtoLeafSegment;

/**
 * Type for raw object that is input for API generation
 */
type ProtoRoutesWrapper = { [key: string]: ProtoSegment };

/**
 * Type that a parameter key as to conform to be recognized as such
 */
type Parameter = `$${string}`;

/**
 * Recursively extracts a Union of all keys out of a nested object structure up to a
 * maximum depth of approx 32, the maximum that the compiler allows
 */
type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
type ExtractKeys<T, N extends number> = N extends 0 ? never : (T extends object ? keyof T | ExtractKeys<T[keyof T], Decr[N]> : never);

/**
 * Extracts all keys that are parameters out of a nested object structure up to a
 * maximum depth of approx 32, the maximum that the compiler allows
 */
type ExtractParameters<T> = Extract<ExtractKeys<T, 32>, Parameter>;

/**
 * Type of function that can be called to resolve a path
 */
type RouteCallable = () => string;

/**
 * Type of the function object that exists at each segment of the (client part of the) API object
 */
type RouteFunctionObject<T extends ProtoSegment> =
  RouteCallable
  & (T extends ProtoCoreSegment ? ClientRouterApi<T['subRoutes']> : Empty)
  & { [isParent]?: true };

/**
 * Type of the function object that exists at each segment of the forRouter part of the API object
 */
type ForRouterFunctionObject<T extends ProtoSegment> =
  RouteCallable &
  (T extends ProtoCoreSegment ? { [key in keyof T['subRoutes']]: ForRouterFunctionObject<T['subRoutes'][key]> } : Empty)

/**
 * Describes the API generated for a subroute. `T` is an object with child route names as keys, and their descriptions
 * as values
 */
type ClientRouterApi<T extends ProtoRoutesWrapper> =
  { [key in keyof T]: (key extends `$${string}` ? (parameter: string) => RouteFunctionObject<T[key]> : RouteFunctionObject<T[key]>) }

// There is something which would I call a bug, here.
// Typescript knows, that T extends ProtoRoutesWrapper, which is a Recursive type - yet of course not infinite in reality.
// It therefore gives a "TS2589: Type instantiation is excessively deep and possibly infinite." error
// Had we not specified that T extends ProtoRoutesWrapper, it could very well still have been initialized with an infinite type
// Yet, in that case, we would not have any issues here, now.
// However, we need to enforce ProtoRoutesWrapper, so that users don't pass Bullsh1t!
/**
 * Creates a Type that is an object that has all parameter keys found in `T` both as key and value.
 * Keys are extracted up to a maximum depth of approx 32, the maximum that the compiler allows
 */
type ParametersObject<T extends ProtoRoutesWrapper> = { [key in ExtractParameters<T>]: ParameterString<key> };
type ParameterString<T extends string> = T extends `$${infer U}` ? U : T;

/**
 * Type of the API object
 */
type RouterApi<T extends ProtoRoutesWrapper> =
  ClientRouterApi<T> &
  {
    [parameters]: ParametersObject<T>,
    [forRouter]: { [key in keyof T]: ForRouterFunctionObject<T[key]> },
  };

/**
 * Creates the router API object
 * @param routes an object forming a tree of routes and subroutes
 */
export function createApi<T extends ProtoRoutesWrapper>(routes: T): RouterApi<T> {
  return {
    ...objectMap(routes, (route, key) => createClientApi(route, '/' + key)) as ClientRouterApi<T>,
    [forRouter]: {
      ...objectMap(routes, (route, key) => createForRouterApi(route, key, undefined)) as { [key in keyof T]: ForRouterFunctionObject<T[key]> }
    },
    [parameters]: extractParameters(routes)
  }
}

/**
 * Generates a parameter object
 * @param proto the object from which to extract the parameters
 */
function extractParameters<T extends ProtoRoutesWrapper>(proto: T) {
  return Object.fromEntries(extractHelper(proto).filter(key => key[0] === '$').map(key => [key, key.substring(1)])) as ParametersObject<T>;
}

/**
 * Recursively extracts parameters from an object into an array of strings
 * @param obj the object from which to extract the parameters
 */
function extractHelper(obj: ProtoRoutesWrapper | ProtoSegment): string[] {
  return Object.entries(obj).map(([key, val]) => [key, ...extractHelper(val)]).reduce((acc, curr) => [...acc, ...curr], []);
}

/**
 * This function recursively creates the forRouter part of the API object
 * @param proto the current element that is converted to a function object
 * @param segment the key under which the current element was found (= the route segment to the current object)
 * @param parentRoute optional callback that gives the forRouter string of the parent segment
 * @param isChild whether or not this is a child route
 */
function createForRouterApi<T extends ProtoSegment>(proto: T, segment: string, parentRoute?: RouteCallable, isChild?: true | undefined) {
  return (function iife(): ForRouterFunctionObject<T> {
    segment = segment[0] === '$' ? ':' + segment.substring(1) : segment;
    const routerFn = () => (!isChild && parentRoute ? `${parentRoute()}/` : '') + segment;
    return Object.assign(
      routerFn,
      {
        ...objectMap(
          'subRoutes' in proto ? proto.subRoutes : {},
          (child, key) => createForRouterApi(child, key, routerFn, 'isParent' in proto ? proto.isParent : undefined)
        )
      }
    ) as ForRouterFunctionObject<T>;
  })();
}

/**
 * Creates the client part of the router API
 * @param proto the current sub-route of the input element
 * @param segment the key under which the current element is found (= the path segment)
 * @param parentPathFn a callback that gives the forRouter path of the parent segment
 */
function createClientApi<T extends ProtoSegment, S extends string>(
  proto: T,
  segment: S,
  parentPathFn?: () => string,
): ClientRouterApi<T['subRoutes']> {
  const api = (segment[0] !== '$' ? // proto is normal segment
    (function nest() {
      const pathFn = () => (parentPathFn ? `${parentPathFn()}/` : '') + (segment);
      return Object.assign(
        pathFn,
        {
          ...objectMap('subRoutes' in proto ? proto.subRoutes : {}, (seg, key) => createClientApi(seg, key, pathFn)) as (T extends ProtoCoreSegment ? ClientRouterApi<T['subRoutes']> : Empty)
        }
      )
    })() : // proto is parameter segment
    (parameter: string) => {
      const pathFn = () => (parentPathFn ? `${parentPathFn()}/` : '') + (parameter);
      return Object.assign(
        pathFn,
        {
          ...objectMap('subRoutes' in proto ? proto.subRoutes : {}, (seg, key) => createClientApi(seg, key, pathFn)) as (T extends ProtoCoreSegment ? ClientRouterApi<T['subRoutes']> : Empty)
        }
      )
    });
  return api as ClientRouterApi<T['subRoutes']>;
}
