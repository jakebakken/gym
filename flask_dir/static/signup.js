const signupButton = document.getElementById("signup-button");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");


function checkInfo() {
    var firstValid = false;
    var lastValid = false;
    var usernameValid = false;
    var emailValid = false;
    var passwordValid = false;
    var passwordConfirmValid = false;
    var passwordMatch = false;

    var firstVal = firstName.value;
    var lastVal = lastName.value;
    var usernameVal = username.value;
    var emailVal = email.value;
    var passwordVal = password.value;
    var passwordConfirmVal = passwordConfirm.value;

    if (firstVal.length >= 1 && firstVal.length <= 50) {
        firstValid = true;
    } else {
        var firstMessage = "First name has to be between 1 - 50 letters";
    }

    if (lastVal.length >= 1 && lastVal.length <= 50) {
        lastValid = true;
    } else {
        var lastMessage = "Last name has to be between 1 - 50 letters";
    }

    if (usernameVal.length >= 1 && usernameVal.length <= 50) {
        usernameValid = true;
    } else {
        var usernameMessage = "Username has to be between 1 - 50 letters";
    }

    if (emailVal.length >= 5) {
        emailValid = true;
    } else {
        var emailMessage = "Email is too short";
    }

    if (passwordVal.length > 8) {
        passwordValid = true;
    } else {
        var passwordMessage = "Password is too short";
    }

    if (passwordConfirmVal.length > 8) {
        passwordConfirmValid = true;
    } else {
        var passwordConfirmMessage = "Password is too short";
    }

    if (passwordVal === passwordConfirmVal) {
        passwordMatch = true;
    } else {
        var passwordMatchMessage = "Passwords must match";
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
                console.log("signup ajax success");
            },
        });

        signup.done(function() {
            alert("Account Created");
        });
    }
    // for each false input value, show respective p tag tip
};