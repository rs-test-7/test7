function isEmpty(value) {
    return value !== "";
}

function removeEmptyElements(arr) {
    return arr.filter(isEmpty);
}

function extendString() {
    String.prototype.toValue = function () {
        let str = this.valueOf();

        if (arguments.length === 1 && typeof arguments[0] === 'object') {
            const obj = arguments[0];

            for (const j in obj) {
                str = str.replace('{' + j + '}', obj[j]);
            }
        } else {
            for (let i = 0; i < arguments.length; i++) {
                const key = '{' + i + '}',
                    value = arguments[i];

                str = str.replace(key, value);
            }
        }

        return str;
    };
}

export {removeEmptyElements, extendString};