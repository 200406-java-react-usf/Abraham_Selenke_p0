const isValidId = (id: number): boolean => {
    return (id && typeof id === 'number' && Number.isInteger(id) && id > 0);
}

const isValidString = (...strings: string[]): boolean => {
    for (let string of strings) {
        if (!string || typeof string !== 'string') {
            return false;
        }
    }
    return true;
}

const isValidObject = (object: Object, ...nullableProps: string[]) => {
    return object && Object.keys(object).every(key => {
        if (nullableProps.includes(key)) {
            return true;
        }
        return object[key];
    });
}

export default {
    isValidId, 
    isValidObject, 
    isValidString
}