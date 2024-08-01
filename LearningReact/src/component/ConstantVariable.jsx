let user = 0; // Declare and initialize the user variable
let LoginStatus; // Declare the LoginStatus variable

export default function LoginCheck() {
    if (user === 1) {
        LoginStatus = true;
    } else {
        LoginStatus = false;
    }
    return LoginStatus;
}

export { LoginStatus };