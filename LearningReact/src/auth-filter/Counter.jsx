export let counter = 0; // Declare and initialize the counter variable
let i = 0; // Declare and initialize the i variable
let j = 0; // Declare and initialize the j variable

export function NotificationCounter() {
    if (j === 0) {
        j = 1;
    } else {
        j = 0;
    }
    return j;
}


export function Counter() {
    while (i <= counter) {
        i++;
    }
    return i;
}