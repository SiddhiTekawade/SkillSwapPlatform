// ==============================
// SELECT ELEMENTS
// ==============================

const form = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const locationField = document.getElementById("location");
const bio = document.getElementById("bio");

const togglePassword = document.getElementById("togglePassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

// ==============================
// SHOW / HIDE PASSWORD
// ==============================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ==============================
// PASSWORD STRENGTH
// ==============================

password.addEventListener("input", () => {

    let value = password.value;

    let strength = 0;

    if (value.length >= 8)
        strength++;

    if (/[A-Z]/.test(value))
        strength++;

    if (/[0-9]/.test(value))
        strength++;

    if (/[^A-Za-z0-9]/.test(value))
        strength++;

    if (strength == 1) {

        strengthBar.style.width = "25%";
        strengthBar.style.background = "#ef4444";
        strengthText.innerHTML = "Weak";

    }

    else if (strength == 2) {

        strengthBar.style.width = "50%";
        strengthBar.style.background = "#f59e0b";
        strengthText.innerHTML = "Medium";

    }

    else if (strength == 3) {

        strengthBar.style.width = "75%";
        strengthBar.style.background = "#22c55e";
        strengthText.innerHTML = "Good";

    }

    else if (strength == 4) {

        strengthBar.style.width = "100%";
        strengthBar.style.background = "#16a34a";
        strengthText.innerHTML = "Strong";

    }

    else {

        strengthBar.style.width = "0";
        strengthText.innerHTML = "Password Strength";

    }

});

// ==============================
// REGISTER
// ==============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (password.value !== confirmPassword.value) {

        alert("Passwords do not match");

        return;

    }

    const user = {

        full_name: fullName.value,

        email: email.value,

        password: password.value,

        location: locationField.value,

        bio: bio.value

    };

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/register",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(user)

            });

        const data = await response.json();

        if (response.ok) {

    const toast = document.getElementById("toast");

    toast.innerHTML = "✅ Registration Successful!";
    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

        window.location.href = "login.html";

    }, 2000);

}

        else {

           const toast = document.getElementById("toast");

toast.style.background = "#ef4444";
toast.innerHTML = data.message;
toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove("show");

    toast.style.background = "#22c55e";

}, 3000);

        }

    }

    catch (error) {

        console.log(error);

        const toast = document.getElementById("toast");

toast.style.background = "#ef4444";
toast.innerHTML = "Server Error!";
toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove("show");

    toast.style.background = "#22c55e";

}, 3000);

    }

});