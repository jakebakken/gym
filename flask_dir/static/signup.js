const signupButton = document.getElementById("signup-button");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");

const firstVal = firstName.value;
const firstMessage = document.getElementById("first-name-message");

const lastVal = lastName.value;
const lastMessage = document.getElementById("last-name-message");

const usernameVal = username.value;
const usernameMessage = document.getElementById("username-message");

const emailVal = email.value;
const emailMessage = document.getElementById("email-message");

const passwordVal = password.value;
const passwordMessage = document.getElementById("password-message");

const passwordConfirmVal = passwordConfirm.value;
const passwordConfirmMessage = document.getElementById("password-confirm-message");


firstName.addEventListener('input', function() {
    if (firstVal.length < 1) {
        firstMessage.style.display = "block";
        firstMessage.innerHTML = "First name is required";
        var firstValid = false;
    } else if (firstVal.length > 50) {
        firstMessage.style.display = "block";
        firstMessage.innerHTML = "First name is too long";
        var firstValid = false;
    } else {
        firstMessage.style.display = "none";
        var firstValid = true;
    };
});


function checkInfo() {
    var lastValid = false;
    var usernameValid = false;
    var emailValid = false;
    var passwordValid = false;
    var passwordConfirmValid = false;
    var passwordMatch = false;

    if (lastVal.length >= 1 && lastVal.length <= 50) {
        lastValid = true;
    } else {
        var lastMessage = "Last name must be between 1 - 50 letters";
    }

    if (usernameVal.length >= 1 && usernameVal.length <= 50) {
        usernameValid = true;
    } else {
        var usernameMessage = "Username must be between 1 - 50 letters";
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

    if (passwordVal === passwordConfirmVal) {
        passwordMatch = true;
    } else {
        var passwordMatchMessage = "Passwords must match";
    }

    if (firstValid==true && lastValid==true && usernameValid==true &&
    emailValid==true && passwordValid==true && passwordMatch==true) {
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
                window.location.href = result['url'];
            },
            error: function(response) {
                alert(response);
            },
        });

        // signup.done(function() {
        //     alert("Account Created");
        // });
    } else {
        // for each false input value, show respective p tag tip

    }
};