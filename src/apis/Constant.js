
const Constants = {
    API_RESPONSE_STATUS_SUCCESS: false,
    API_RESPONSE_STATUS_FAILED: true,
    API_RESPONSE_STATUS_FALSE: false,
}


const REGEX = {
    email:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // password: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    password: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+{}[]|:;<>,.`~?]).{8,}$/,
    name: /^[a-zA-Z ]{3,}$/,
    username: /^[a-zA-Z0-9]{3,}$/,
    firstName: /^[a-zA-Z '!"/()&*]{3,}$/,
    lastName: /^[a-zA-Z '!"/()&*]{3,}$/,
    phone: /^[0-9]{10,15}$/,
    otp: /^[0-9]{6}$/,
    panNo: /^[A-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
    policy: "",
    number: /^(?=.*[0-9]).{1,}$/,
    lowercase: /^(?=.*[a-z]).{1,}$/,
    uppercase: /^(?=.*[A-Z]).{1,}$/,
    special: /^(?=.*[!*@#\$%^&+=()]).{1,}$/,
    space: /(?=\\S+\$)/,
    contact_number: /^[0-9]{10}$/,
};

const ERROR_MESSAGE = {
    usernameRequired: "Username is required.",
    usernameInvalid: "Please enter a valid username.",
    passwordRequired: "Password is required.",
    passwordInvalid: "Password must contain at least one number, upper case, lower case, special character & 8 characters.",
    otpRequired: 'OTP is required.',
    emailRequired: "Email Id is required.",
    emailUsernameRequired: "Email Id / username is required.",
    emailInvalid: "Please enter a valid email id.",
    oldPasswordRequired: "Old password is required",
    newPasswordRequired: "New password is required",
    confirmPasswordRequired: "Confirm password is required",
    newPasswordInvalid: "Password and Confirm Password does not match.",
    phoneNoRequired: "Client Contact No is required",
    phoneNoInvalid: "Phone no. should be min 10 and max 15 digits",
    clientFirstNameRequired:"Client First Name is required.",
    clientLastNameRequired:"Client Last Name is required.",
    statusRequired:"Status is required.",
    clientRequired:"Client Username is required",
    availableamountRequired:"Amount is required",
    currencycodeRequired:"Currency is required",
    accountnameRequired:"Account name is required",
    currencycodeidRequired:"Currency is required",
    debitBalanceRequired: "Amount is required",
    creditBalanceRequired: "Amount is required",
    providernameRequired:"Provider name is required",
    levelIdRequired:"Level is required",
    regionIdRequired:"Region is required"
};

export { REGEX, ERROR_MESSAGE, Constants };
