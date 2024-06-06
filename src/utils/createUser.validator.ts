const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^.{3,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

// Function to validate email
export function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
}

export function isvalidUsername(username: string):boolean{
    return usernameRegex.test(username)
}
export function isvalidPassword(password: string):boolean{
    return passwordRegex.test(password)
}

export function isValidCreateUser(username:string, email:string, password:string):boolean
{
    return (usernameRegex.test(username) && emailRegex.test(email)  && passwordRegex.test(password))
}
