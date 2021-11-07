const pass = document.getElementById("pass");
const cpass = document.getElementById("cpass");
const msg = document.getElementById("output-msg");

//validate function
function validatePassword() {
    if(pass.value === cpass.value) {
        msg.style.color = "green";
        msg.innerText = "Password match";
    } else {
        msg.style.color = "red";
        msg.innerText = "Password doesn't match";
    }
}

//confirm password validation
cpass.addEventListener("input", validatePassword);
pass.addEventListener("input", validatePassword);
