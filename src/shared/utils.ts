export function objectMap<T extends string, U, R>(obj: Record<T, U>, fn: (value: U, key: T) => R): Record<T, R> {
    return Object.fromEntries(Object.entries<U>(obj).map(([key, value]) => [key, fn(value, key as T)])) as Record<T, R>;
}
