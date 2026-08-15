/*=========================================================
              SKILLSWAP LOGIN JAVASCRIPT
=========================================================*/

"use strict";


/*=========================================================
              DOM ELEMENTS
=========================================================*/

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const rememberMe = document.getElementById("rememberMe");

const loginBtn = document.getElementById("loginBtn");

const loginBtnText = document.getElementById("loginBtnText");

const loginLoader = document.getElementById("loginLoader");

const toast = document.getElementById("toast");

const forgotPassword =
    document.querySelector(".forgotPassword");

const googleBtn =
    document.querySelector(".googleBtn");


/*=========================================================
              TOAST
=========================================================*/

function showToast(message, type = "success") {

    if (!toast) {

        alert(message);

        return;

    }

    toast.textContent = message;

    toast.classList.remove(
        "success",
        "error",
        "show"
    );

    if (type === "success") {

        toast.classList.add("success");

    } else {

        toast.classList.add("error");

    }

    setTimeout(() => {

        toast.classList.add("show");

    }, 50);

}


/*=========================================================
              HIDE TOAST
=========================================================*/

function hideToast() {

    if (!toast) return;

    toast.classList.remove("show");

}


/*=========================================================
              PASSWORD SHOW / HIDE
=========================================================*/

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                passwordInput.type = "password";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

            }

        }
    );

}


/*=========================================================
              LOADING BUTTON
=========================================================*/

function setLoading(isLoading) {

    if (!loginBtn) return;


    if (isLoading) {

        loginBtn.disabled = true;

        if (loginBtnText) {

            loginBtnText.textContent =
                "Logging in...";

        }

        if (loginLoader) {

            loginLoader.style.display =
                "inline-block";

        }

    }

    else {

        loginBtn.disabled = false;

        if (loginBtnText) {

            loginBtnText.textContent =
                "Login";

        }

        if (loginLoader) {

            loginLoader.style.display =
                "none";

        }

    }

}


/*=========================================================
              EMAIL VALIDATION
=========================================================*/

function isValidEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}


/*=========================================================
              LOGIN FORM
=========================================================*/

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /*---------------------------------------------
                    GET FORM VALUES
            ---------------------------------------------*/

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /*---------------------------------------------
                    VALIDATION
            ---------------------------------------------*/

            if (!email || !password) {

                showToast(
                    "Please enter email and password.",
                    "error"
                );

                return;

            }


            if (!isValidEmail(email)) {

                showToast(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            /*---------------------------------------------
                    START LOADING
            ---------------------------------------------*/

            setLoading(true);


            try {


                /*-----------------------------------------
                        CALL BACKEND API
                -----------------------------------------*/

                const response =
                    await fetch(
                        "http://localhost:5000/api/users/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                /*-----------------------------------------
                        READ RESPONSE
                -----------------------------------------*/

                const data =
                    await response.json();


                console.log(
                    "LOGIN RESPONSE:",
                    data
                );


                /*=========================================
                        LOGIN SUCCESS
                =========================================*/

                if (response.ok) {


                    console.log(
                        "LOGIN SUCCESSFUL"
                    );


                    /*-------------------------------------
                        SAVE JWT
                    -------------------------------------*/

                    if (data.token) {

                        if (
                            rememberMe &&
                            rememberMe.checked
                        ) {

                            localStorage.setItem(
                                "skillSwapToken",
                                data.token
                            );

                        }

                        else {

                            sessionStorage.setItem(
                                "skillSwapToken",
                                data.token
                            );

                        }

                    }


                    /*-------------------------------------
                        SAVE USER
                    -------------------------------------*/

                    if (data.user) {

                        localStorage.setItem(
                            "skillSwapUser",
                            JSON.stringify(
                                data.user
                            )
                        );

                    }


                    /*-------------------------------------
                        SHOW SUCCESS
                    -------------------------------------*/

                    showToast(
                        "✅ Login Successful!",
                        "success"
                    );


                    /*-------------------------------------
                        REDIRECT
                    -------------------------------------*/

                    setTimeout(
                        () => {

                            console.log(
                                "REDIRECTING TO DASHBOARD..."
                            );


                            /*
                             * login.html and dashboard.html
                             * are in the SAME folder.
                             */

                            window.location.href =
                                "./dashboard.html";


                        },
                        1000
                    );


                }


                /*=========================================
                        LOGIN FAILED
                =========================================*/

                else {

                    showToast(
                        data.message ||
                        "Invalid email or password.",
                        "error"
                    );

                    setLoading(false);

                }


            }


            /*=============================================
                    SERVER ERROR
            =============================================*/

            catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showToast(
                    "Unable to connect to server. Make sure the backend is running.",
                    "error"
                );


                setLoading(false);

            }

        }
    );

}


/*=========================================================
              FORGOT PASSWORD
=========================================================*/

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            showToast(
                "Password reset feature will be added soon.",
                "error"
            );

        }
    );

}


/*=========================================================
              GOOGLE LOGIN
=========================================================*/

if (googleBtn) {

    googleBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Google Login will be added in the authentication phase.",
                "error"
            );

        }
    );

}


/*=========================================================
              CHECK EXISTING SESSION
=========================================================*/

function checkExistingLogin() {

    const localToken =
        localStorage.getItem(
            "skillSwapToken"
        );

    const sessionToken =
        sessionStorage.getItem(
            "skillSwapToken"
        );


    if (localToken || sessionToken) {

        console.log(
            "Existing SkillSwap login session found."
        );

    }

}


/*=========================================================
              PAGE LOAD
=========================================================*/

window.addEventListener(
    "load",
    () => {

        checkExistingLogin();

        console.log(
            "SkillSwap Login Page Loaded Successfully 🚀"
        );

    }
);