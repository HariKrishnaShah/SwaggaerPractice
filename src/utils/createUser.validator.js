"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCreateUser = exports.isvalidPassword = exports.isvalidUsername = exports.isValidEmail = void 0;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^.{3,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
// Function to validate email
function isValidEmail(email) {
    return emailRegex.test(email);
}
exports.isValidEmail = isValidEmail;
function isvalidUsername(username) {
    return usernameRegex.test(username);
}
exports.isvalidUsername = isvalidUsername;
function isvalidPassword(password) {
    return passwordRegex.test(password);
}
exports.isvalidPassword = isvalidPassword;
function isValidCreateUser(username, email, password) {
    return (usernameRegex.test(username) && emailRegex.test(email) && passwordRegex.test(password));
}
exports.isValidCreateUser = isValidCreateUser;
//# sourceMappingURL=createUser.validator.js.map