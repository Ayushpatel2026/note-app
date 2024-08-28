import { useEffect, useState } from 'react';

// this function can take in a key and an initial value
// the initial value can be a value or a function that returns a value, just like in useState
// the function returns an array with two values, just like useState
export function useLocalStorage<T>(key: string, initialValue: T |
    (() => T)
) {
    const [value, setValue] = useState<T>(() => {
        const item = localStorage.getItem(key);
        if (item === null) {
            if (typeof initialValue === 'function') {
                return (initialValue as () => T)();
            } else {
                return initialValue;
            }
        }else{
            return JSON.parse(item);
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue] as [T, typeof setValue];
}