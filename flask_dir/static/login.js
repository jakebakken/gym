const loginButton = document.getElementById("login-button");
const email = document.getElementById("email");
const password = document.getElementById("password");

var emailVal = email.value;
var passwordVal = password.value;


function loginUser() {
    login = $.ajax({
        type: 'POST',
        url: '/login_user',
        data: {
            emailVal: emailVal,
            passwordVal: passwordVal,
        },
        success: function(result) {
            console.log("login ajax called");
            if (result['status'] == 'success') {
                window.location.href = result['url'];
            } else if (result['status'] == 'incorrect_pass') {
                alert(result['message']);
            } else if (result['status'] == 'email_not_found') {
                alert(result['message']);
            } else {
                console.log("login ajax success handler error");
            }
        },
        error: function(response) {
            alert(response);
        },
    });
};