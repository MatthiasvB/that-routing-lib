import {objectMap} from './shared/utils.js';

const isParent = 'isParent';
const segmentName = 'segmentName';

const reservedKeysList = ['name', 'arguments', 'length', 'caller', 'prototype', 'bind', 'call', 'apply', 'constructor', 'hasOwnProperty', 'isPrototypeOf', 'length', 'toString', 'propertyIsEnumerable', 'toLocaleString', 'valueOf'] as const;
const reservedKeys: Set<string> = new Set(reservedKeysList);

/**
 * Type for route segment with no sub-route. Empty for now, but could become more complex later on
 */
type ProtoLeafSegment = {
    /** Used to override the string associated with this route. For example for long strings and reserved keywords such as `name` */
    [segmentName]?: string
};


/**
 * Type for route segment with sub-routes
 */
type ProtoCoreSegment = ProtoLeafSegment & {
    /**
     * Indicates that this route is a parent route in your router configuration (if applicable).
     *
     * Your router could be configured as
     * ```typescript
     * {
     *     "parentRoute/childRoute": ChildComponent,
     *     "parentRoute/otherChildRoute": OtherChildComponent
     * }
     * ```
     * or
     * ```typescript
     * {
     *     "parentRoute": { children: {
     *         "childRoute": ChildComponent,
     *         "otherChildRoute": OtherChildComponent
     *     }}
     * }
     * ```
     * The latter case would require the API to spit out different strings for the router configuration (again,
     * if that is how you are using this package). For it to know that a route has children, specify `isParent: true`
     */
    [isParent]?: boolean,
    /** Specify all children of this route under this key. Keys you use in this object will become the strings used for the routes */
    subRoutes: {
        [key: string]: ProtoSegment
    },
};

/**
 * Type for any route segment
 */
type ProtoSegment = ProtoCoreSegment | ProtoLeafSegment;

/**
 * Type for raw object that is input for API generation
 */
export type ProtoRoutesWrapper = { [key: string]: ProtoSegment };

/**
 * Type that a parameter key as to conform to, to be recognized as such
 */
type Parameter = `$${string}`;

/**
 * Decrementing numbers in the type system. Hacky, but ingenious
 */
type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999];

/**
 * Recursively extracts a Union of all keys out of a nested object structure up to a
 * maximum depth of approx 100, the maximum that the compiler allows
 */
type ExtractKeys<T, N extends number, Acc = never> = N extends 0 ? never : (T extends object ? (keyof T extends never ? Acc : ExtractKeys<T[keyof T], Decr[N], keyof T | Acc>) : Acc)

/**
 * Type of function that can be called to resolve a path
 */
type RouteCallable = () => string;

/**
 * Type of the function object that exists at each segment of the (client part of the) API object
 */
type RouteFunctionObject<T extends ProtoSegment> =
    T extends ProtoCoreSegment
        ? RouteCallable & ClientRoutingApi<T['subRoutes']>
        : RouteCallable
        & { [isParent]?: boolean };


/**
 * Type of the function object that exists at each segment of the forRouter part of the API object
 */
type ForRouterFunctionObject<T extends ProtoSegment> =
    T extends ProtoCoreSegment
        ? RouteCallable & { [key in keyof T['subRoutes']]: ForRouterFunctionObject<T['subRoutes'][key]> }
        : RouteCallable;

/**
 * Describes the API generated for a subroute. `T` is an object with child route names as keys, and their descriptions
 * as values
 */
type ClientRoutingApi<T extends ProtoRoutesWrapper> = {
    [key in keyof T]: (key extends Parameter ? (parameter: string | number) => RouteFunctionObject<T[key]> : RouteFunctionObject<T[key]>)
};

/**
 * Type of the API object
 */
type RoutingApi<T extends ProtoRoutesWrapper> = ClientRoutingApi<T>;

type RoutingApiForRouter<T extends ProtoRoutesWrapper> =
    { [key in keyof T]: ForRouterFunctionObject<T[key]> };

/**
 * Creates the client API object
 * @param routes an object forming a tree of routes and subroutes
 */
export function buildRoutes<T extends ProtoRoutesWrapper>(routes: T): RoutingApi<T> {
    throwOnReservedKeywordsInKeys(routes);
    return objectMap(routes, (route, key) => createClientApi(route, key)) as ClientRoutingApi<T>;
}

/**
 * Creates the Angular Router API object
 * @param routes an object forming a tree of routes and subroutes
 */
export function buildRoutesForAngularRouter<T extends ProtoRoutesWrapper>(routes: T): RoutingApiForRouter<T> {
    throwOnReservedKeywordsInKeys(routes);
    return objectMap(routes, (route, key) => createForRouterApi(route, key, undefined)) as { [key in keyof T]: ForRouterFunctionObject<T[key]> };
}

/**
 * Extracts all reserved keywords that are found within the `routes` object
 * @param routes the object to be checked for reserved keywords
 * @returns an array containing all found reserved keywords
 */
function getContainedReservedKeywords<T extends ProtoRoutesWrapper>(routes: T): string[] {
    return Object.entries(routes)
        .flatMap(([key, val]) => [
            ...(reservedKeys.has(key) ? [key] : []),
            ...('subRoutes' in val ? getContainedReservedKeywords(val.subRoutes) : [])
        ]);
}

/**
 * Checks if any reserved keywords are found within `routes` and throws an error if so
 * @param routes the object to be checked for reserved keywords
 * @throws an error describing which reserved keywords have been found
 */
function throwOnReservedKeywordsInKeys<T extends ProtoRoutesWrapper>(routes: T): void {
    const offendingKeys = getContainedReservedKeywords(routes);
    if (offendingKeys.length) {
        throw Error(`You have used the reserved keywords "${offendingKeys.join(" & ")}" in your route. This is not possible. ` +
            "Consider using different keys and override the strings using segmentName");
    }
}

/**
 * This function recursively creates the forRouter part of the API object
 * @param proto the current element that is converted to a function object
 * @param key the key under which the current element was found (= the route segment to the current object)
 * @param parentRoute optional callback that gives the forRouter string of the parent segment
 * @param isChild whether or not this is a child route
 */
function createForRouterApi<T extends ProtoSegment>(
    proto: T,
    key: string,
    parentRoute?: RouteCallable,
    isChild?: boolean | undefined
) {
    return (function iife(): ForRouterFunctionObject<T> {
        const segment: string = (() => {
            if (key[0] === '$') {
                return ':' + key.substring(1);
            } else if (segmentName in proto) {
                const overwrittenSegment = proto[segmentName];
                return overwrittenSegment[0] === '/' ? overwrittenSegment.substring(1) : overwrittenSegment;
            } else {
                return key;
            }
        })();
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
 * @param key the key under which the current element is found (= the path segment)
 * @param parentPathFn a callback that gives the forRouter path of the parent segment
 */
function createClientApi<T extends ProtoSegment>(
    proto: T,
    key: string,
    parentPathFn?: () => string,
): T extends ProtoCoreSegment ? ClientRoutingApi<T['subRoutes']> : never {
    const api = (key[0] !== '$' ? // proto is normal segment
        (function nest() {
            const segment = segmentName in proto ? proto[segmentName] : key;
            const pathFn = () => (parentPathFn ? `${parentPathFn()}/` : '') + (segment);
            return Object.assign(
                pathFn,
                {
                    ...objectMap('subRoutes' in proto ? proto.subRoutes : {}, (seg, key) => createClientApi(seg, key, pathFn)) as (T extends ProtoCoreSegment ? ClientRoutingApi<T['subRoutes']> : never)
                }
            )
        })() : // proto is parameter segment
        (parameter: string) => {
            const pathFn = () => (parentPathFn ? `${parentPathFn()}/` : '') + (parameter);
            return Object.assign(
                pathFn,
                {
                    ...objectMap('subRoutes' in proto ? proto.subRoutes : {}, (seg, key) => createClientApi(seg, key, pathFn)) as (T extends ProtoCoreSegment ? ClientRoutingApi<T['subRoutes']> : never)
                }
            )
        });
    return api as T extends ProtoCoreSegment ? ClientRoutingApi<T['subRoutes']> : never;
}

/**
 * Extracts all keys that are parameters out of a nested object structure up to a
 * maximum depth of approx 32, the maximum that the compiler allows
 */
type ExtractParameters<T, D extends number> = Extract<ExtractKeys<T, D>, Parameter>;

// There is something which would I call a bug, here.
// Typescript knows that T extends ProtoRoutesWrapper, which is a Recursive type - yet of course not infinite in reality.
// It therefore gives a "TS2589: Type instantiation is excessively deep and possibly infinite." error
// Had we not specified that T extends ProtoRoutesWrapper, it could very well still have been initialized with an infinite type
// Yet, in that case, we would not have any issues here, now.
// However, we need to enforce ProtoRoutesWrapper, so that users don't pass Bullsh1t!
/**
 * Creates a Type that is an object that has all parameter keys found in `T` both as key and value.
 * Keys are extracted up to a maximum depth of approx 32, the maximum that the compiler allows
 */
export type ParametersObject<T extends ProtoRoutesWrapper, D extends number> = { [key in ExtractParameters<T, D>]: ParameterString<key> };
type ParameterString<T extends string> = T extends `$${infer U}` ? U : T;

/**
 * Generates a parameter extractor. Call it like
 * ```typescript
 * const parameters = getParamatersExtractor().extract(routeDefinitons);
 * ```
 * The reason extracting parameters is a two-step process is due to how TypeScript handles generics.
 * The process requires two generic parameters:
 * - The type of the `routeDefinitions` object. This can be inferred
 * - A number that limits the recursion depth that TS uses to analyze the `routeDefinitions` object. This can not be inferred, but a default is provided
 * <p>
 * If all goes well, you need to specify none of those parameters, because one can be inferred and the other has a default.
 * But, if you're below TypeScript v4.7 (or maybe v4.6, 4.5, ...?), you'll get an error saying
 * ```
 * TS2589: Type instantiation is excessively deep and possibly infinite.
 * ```
 * That's because TS in those versions has not yet optimized tail recursive types, and our limit becomes much lower. In fact,
 * you'll have to pass `16` to make it work. Unfortunately, that also means that TS support for deep URLs will not work.
 * <p>
 * Why does that mean we have to call the function in two steps? Simple: As far as I know there is no way for TypeScript to
 * infer only one of the type arguments and have the other specified by the developer. By splitting the call into two, we
 * make sure not having to pass redundant type info.
 * <p>
 * In short: If you have troubles with errors regarding excessively deep types, just call the function(s) like
 * ```typescript
 * const parameters = getParamatersExtractor<16>().extract(routeDefinitons);
 * ```
 *
 * @param proto the object from which to extract the parameters
 */
export function getParameterExtractor<D extends number = 94>() {
    function extract<T extends ProtoRoutesWrapper>(proto: T): ParametersObject<T, D> {
        return Object.fromEntries(extractHelper(proto).filter(key => key[0] === '$').map(key => [key, key.substring(1)])) as ParametersObject<T, D>;
    };
    return { extract };
}

/**
 * Recursively extracts parameters from an object into an array of strings
 * @param obj the object from which to extract the parameters
 */
function extractHelper(obj: ProtoRoutesWrapper | ProtoSegment): string[] {
    if (typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, val]) => [key, ...extractHelper(val)]).reduce((acc, curr) => [...acc, ...curr], []);
}
