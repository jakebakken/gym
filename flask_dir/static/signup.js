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


firstName.addEventListener('input', function() {
    const firstVal = firstName.value;
    var firstValid = false;

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
    const lastVal = lastName.value;
    var lastValid = false;

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
    const usernameVal = username.value;
    var usernameValid = false;

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
    const emailVal = email.value;
    var emailValid = false;

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


function checkInfo() {
    var passwordValid = false;
    var passwordConfirmValid = false;
    var passwordMatch = false;

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