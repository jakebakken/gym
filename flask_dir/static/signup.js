const signupButton = document.getElementById("signup-button");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");


function checkInfo() {
    let firstValid = false;
    let lastValid = false;
    let usernameValid = false;
    let emailValid = false;
    let passwordValid = false;
    let passwordConfirmValid = false;
    let passwordMatch = false;

    let firstVal = firstName.value;
    let lastVal = lastName.value;
    let usernameVal = username.value;
    let emailVal = email.value;
    let passwordVal = password.value;
    let passwordConfirmVal = passwordConfirm.value;

    if (firstVal.length > 1 && firstVal.length <= 50) {
        firstValid = true;
    } else {
        let firstMessage = "First name has to be between 1 - 50 letters";
    }

    if (lastVal.length > 1 && lastVal.length <= 50) {
        lastValid = true;
    } else {
        let lastMessage = "Last name has to be between 1 - 50 letters";
    }

    if (usernameVal.length > 1 && usernameVal.length <= 50) {
        usernameValid = true;
    } else {
        let usernameMessage = "Username has to be between 1 - 50 letters";
    }

    if (emailVal.length > 5) {
        emailValid = true;
    } else {
        let emailMessage = "Email is too short";
    }

    if (passwordVal.length > 8) {
        passwordValid = true;
    } else {
        let passwordMessage = "Password is too short";
    }

    if (passwordConfirmVal.length > 8) {
        passwordConfirmValid = true;
    } else {
        let passwordConfirmMessage = "Password is too short";
    }

    if (passwordVal === passwordConfirmVal) {
        passwordMatch = true;
    } else {
        let passwordMatchMessage = "Passwords must match";
    }

    if (firstValid==true && lastValid==true && usernameValid==true &&
    emailValid==true && passwordValid==true && passwordConfirmValid==true
    && passwordMatch==true) {
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
            success: function() {
                console.log("user signed up");
            }
        });

        signup.done(function() {
            alert("Signup Successful");
        });
    }
    // for each false input value, show respective p tag tip
};