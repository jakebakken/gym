const signupButton = document.getElementById("signup-button");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");

const firstMessage = document.getElementById("first-name-message");
const lastMessage = document.getElementById("last-name-message");
const usernameMessage = document.getElementById("username-message");
const emailMessage = document.getElementById("email-message");
const passwordMessage = document.getElementById("password-message");
const passwordConfirmMessage = document.getElementById("password-confirm-message");

var firstVal = firstName.value;
var lastVal = lastName.value;
var usernameVal = username.value;
var emailVal = email.value;
var passwordVal = password.value;
var passwordConfirmVal = passwordConfirm.value;

var firstValid = false;
var lastValid = false;
var usernameValid = false;
var emailValid = false;
var passwordValid = false;
var passwordConfirmValid = false;
var passwordMatch = false;


firstName.addEventListener('input', function() {
    firstVal = firstName.value;
    firstValid = false;

    if (firstVal.length < 1) {
        firstMessage.style.display = "block";
        firstMessage.innerHTML = "First name required";
    } else if (firstVal.length > 50) {
        firstMessage.style.display = "block";
        firstMessage.innerHTML = "First name is too long";
    } else {
        firstMessage.style.display = "none";
        firstValid = true;
    }
});

lastName.addEventListener('input', function() {
    lastVal = lastName.value;
    lastValid = false;

    if (lastVal.length < 1) {
        lastMessage.style.display = "block";
        lastMessage.innerHTML = "Last name required";
    } else if (lastVal.length > 50) {
        lastMessage.style.display = "block";
        lastMessage.innerHTML = "Last name is too long";
    } else {
        lastMessage.style.display = "none";
        lastValid = true;
    }
});

username.addEventListener('input', function() {
    usernameVal = username.value;
    usernameValid = false;

    if (usernameVal.length < 1) {
        usernameMessage.style.display = "block";
        usernameMessage.innerHTML = "Username required";
    } else if (usernameVal.length > 50) {
        usernameMessage.style.display = "block";
        usernameMessage.innerHTML = "Username is too long";
    } else {
        usernameMessage.style.display = "none";
        usernameValid = true;
    }
});

email.addEventListener('input', function() {
    emailVal = email.value;
    emailValid = false;

    if (emailVal.length < 1) {
        emailMessage.style.display = "block";
        emailMessage.innerHTML = "Email required";
    } else if (emailVal.length <= 5) {
        // this will need to be a more complex function, regex
        emailMessage.style.display = "block";
        emailMessage.innerHTML = "Email is invalid";
    } else if (emailVal.length > 100) {
        emailMessage.style.display = "block";
        emailMessage.innerHTML = "Email is too long";
    } else {
        emailMessage.style.display = "none";
        emailValid = true;
    }
});

password.addEventListener('input', function() {
    passwordVal = password.value;
    passwordValid = false;

    if (passwordVal.length < 1) {
        passwordMessage.style.display = "block";
        passwordMessage.innerHTML = "Password required";
    } else if (passwordVal.length < 8) {
        // this will need to be a more complex function, regex
        passwordMessage.style.display = "block";
        passwordMessage.innerHTML = "Password must be at least 8 characters";
    } else {
        passwordMessage.style.display = "none";
        passwordValid = true;
    }
});

passwordConfirm.addEventListener('input', function() {
    passwordVal = password.value;
    passwordConfirmVal = passwordConfirm.value;
    passwordConfirmValid = false;
    passwordMatch = false;

    if (passwordConfirmVal.length < 1) {
        passwordConfirmMessage.style.display = "block";
        passwordConfirmMessage.innerHTML = "Password confirmation required";
    } else if (passwordConfirmVal !== passwordVal) {
        // this will need to be a more complex function, regex
        passwordConfirmMessage.style.display = "block";
        passwordConfirmMessage.innerHTML = "Passwords must match";
    } else {
        passwordConfirmMessage.style.display = "none";
        passwordConfirmValid = true;
        passwordMatch = true;
    }
});


function checkInfo() {
    if (firstValid === true && lastValid === true && usernameValid === true &&
    emailValid === true && passwordValid === true && passwordMatch === true) {
        signup = $.ajax({
            type: 'POST',
            url: '/signup_user',
            data: {
                firstVal: firstVal,
                lastVal: lastVal,
                usernameVal: usernameVal,
                emailVal: emailVal,
                passwordVal: passwordVal,
            },
            success: function(result) {
                console.log("signup ajax called");
                if (result['status'] === 'success') {
                    window.location.href = result['url'];
                } else if (result['status'] === 'error') {
                    alert(result['message']);
                } else {
                    console.log("signup ajax success handler error");
                }
            },
            error: function(response) {
                alert(response);
            },
        });
    };
};