// ======================================
// SkillSwap Login Page
// ======================================

// DOM Elements

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginBtn = document.getElementById("loginBtn");

const loginBtnText = document.getElementById("loginBtnText");

const loginLoader = document.getElementById("loginLoader");

const rememberMe = document.getElementById("rememberMe");

const toast = document.getElementById("toast");


// ======================================
// Show / Hide Password
// ======================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    }

    else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


// ======================================
// Toast Function
// ======================================

function showToast(message, color) {

    toast.innerHTML = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ======================================
// Already Logged In
// ======================================

const token = localStorage.getItem("token");

if (token) {

   window.location.href = "./dashboard.html";

}


// ======================================
// Login
// ======================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Validation

    if (email.value.trim() === "") {

        showToast("Enter Email", "#EF4444");

        return;

    }

    if (password.value.trim() === "") {

        showToast("Enter Password", "#EF4444");

        return;

    }

    // Loading

    loginBtn.disabled = true;

    loginBtnText.style.display = "none";

    loginLoader.style.display = "block";


    try {

        const response = await fetch(

            "http://localhost:5000/api/users/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email.value,

                    password: password.value

                })

            }

        );

        const data = await response.json();


        if (response.ok) {

            // Save Token

            if (rememberMe.checked) {

                localStorage.setItem("token", data.token);

                localStorage.setItem("user", JSON.stringify(data.user));

            }

            else {

                sessionStorage.setItem("token", data.token);

                sessionStorage.setItem("user", JSON.stringify(data.user));

            }

            showToast("✅ Login Successful", "#22C55E");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1500);

        }

        else {

            showToast(data.message, "#EF4444");

        }

    }

    catch (error) {

        console.log(error);

        showToast("Server Error", "#EF4444");

    }

    finally {

        loginBtn.disabled = false;

        loginBtnText.style.display = "inline";

        loginLoader.style.display = "none";

    }

});