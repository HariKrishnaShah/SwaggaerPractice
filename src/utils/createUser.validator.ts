// Matches a valid email address format (non-whitespace characters before and after '@', and a domain part)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Matches a username with at least 3 characters (any character except line terminators)
const usernameRegex = /^.{3,}$/;

// Matches a password with at least 6 characters, including at least one lowercase letter, one uppercase letter, and one digit
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
