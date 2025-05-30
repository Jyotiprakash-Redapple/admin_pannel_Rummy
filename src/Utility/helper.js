import { ERROR_MESSAGE, REGEX } from "../apis/Constant";

const leftTrim = (string) => {
    return (string ?? "").toString().trim();
};


const markAllAsTouched = (object) => {
    return Object.keys(object).reduce((accumulator, key) => {
        return { ...accumulator, [key]: true };
    }, {});
};

const leftTrimAllValue = (object, exceptLeftTrimValues = []) => {
    if (object) {
        return Object?.keys(object).reduce((accumulator, key) => {
            return {
                ...accumulator,
                [key]: exceptLeftTrimValues.find((element) => element === key)
                    ? object[key]
                    : leftTrim(object[key]),
            };
        }, {});
    } else return null;
};

const getErrorMessage = (key, value, isOptional) => {
    if (
        (value && value?.toString().match(REGEX[key])) ||
        (isOptional && (!value || (value && value?.toString().match(REGEX[key]))))
    )
        return "";
    else {
        return !value
            ? `${ERROR_MESSAGE[key + "Required"] ?? "This field is required"}`
            : `${ERROR_MESSAGE[key + "Invalid"]}`;
    }
};

const isFormValid = (formValue, optionalFields) => {

    for (var key in formValue) {
        if (formValue[key] === null) {
            formValue[key] = "";
        }
        if (formValue[key] && formValue[key].toString().match(REGEX[key])) continue;
        else if (
            optionalFields &&
            optionalFields[key] &&
            formValue[key].toString().match(REGEX[key])
        ) {
            continue;
        } else return false;
    }
    return true;
};

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const camelCase = (str) => {
    return str.split(/(?=[A-Z])/).map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1);
    }).join(' ');
}

export {
    leftTrim,
    getErrorMessage,
    markAllAsTouched,
    leftTrimAllValue,
    isFormValid,
    numberWithCommas,
    camelCase,
};