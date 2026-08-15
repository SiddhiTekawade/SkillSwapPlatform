/*=========================================================
            SKILLSWAP DASHBOARD JAVASCRIPT
            Production-Ready Frontend Foundation
=========================================================*/

"use strict";


/*=========================================================
                    CONFIGURATION
=========================================================*/

const API_BASE_URL = "http://localhost:5000/api";

const TOKEN_KEY = "skillSwapToken";

const USER_KEY = "skillSwapUser";


/*=========================================================
                    DOM ELEMENTS
=========================================================*/

const sidebar =
    document.querySelector(".sidebar");

const menuLinks =
    document.querySelectorAll(".menu li");

const logoutBtn =
    document.querySelector("#logoutBtn");

const searchInput =
    document.querySelector("#skillSearch");

const notificationBtn =
    document.querySelector("#notificationBtn");

const themeBtn =
    document.querySelector("#themeBtn");

const profileBtn =
    document.querySelector(".profile-box");

const statNumbers =
    document.querySelectorAll(".counter");

const scrollTopBtn =
    document.querySelector(".scroll-top");

const userNameElement =
    document.querySelector("#userName");

const welcomeNameElement =
    document.querySelector("#welcomeName");

const profileImage =
    document.querySelector("#profileImage");


/*=========================================================
                HELPER FUNCTIONS
=========================================================*/

function getToken() {

    return (
        localStorage.getItem(TOKEN_KEY) ||
        sessionStorage.getItem(TOKEN_KEY)
    );

}


function removeToken() {

    localStorage.removeItem(TOKEN_KEY);

    sessionStorage.removeItem(TOKEN_KEY);

}


function setText(element, value) {

    if (element) {

        element.textContent =
            value || "";

    }

}


function getAuthHeaders() {

    const token =
        getToken();

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


/*=========================================================
                AUTHENTICATION CHECK
=========================================================*/

function checkAuthentication() {

    const token =
        getToken();

    if (!token) {

        console.warn(
            "No authentication token found."
        );

        window.location.href =
            "login.html";

        return false;

    }

    console.log(
        "Authentication token found ✅"
    );

    return true;

}


/*=========================================================
                ACTIVE SIDEBAR MENU
=========================================================*/

function initializeSidebar() {

    menuLinks.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                menuLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                });

                item.classList.add(
                    "active"
                );

            }
        );

    });

}


/*=========================================================
                COUNTER ANIMATION
=========================================================*/

function animateCounter(counter) {

    const target =
        Number(
            counter.getAttribute(
                "data-target"
            )
        );

    if (isNaN(target)) {

        return;

    }

    let current = 0;

    const duration = 1200;

    const startTime =
        performance.now();


    function updateCounter(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        current =
            Math.floor(
                easedProgress *
                target
            );

        counter.textContent =
            current;


        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        }

        else {

            counter.textContent =
                target;

        }

    }


    requestAnimationFrame(
        updateCounter
    );

}


function initializeCounters() {

    statNumbers.forEach(
        counter => {

            animateCounter(
                counter
            );

        }
    );

}


/*=========================================================
                    SEARCH FILTER
=========================================================*/

function initializeSearch() {

    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    ".request-item"
                )
                .forEach(item => {

                    const text =
                        item.innerText
                            .toLowerCase();

                    item.style.display =
                        text.includes(value)
                            ? "flex"
                            : "none";

                });


            document
                .querySelectorAll(
                    ".chat-user"
                )
                .forEach(item => {

                    const text =
                        item.innerText
                            .toLowerCase();

                    item.style.display =
                        text.includes(value)
                            ? "flex"
                            : "none";

                });


            document
                .querySelectorAll(
                    ".skill-item"
                )
                .forEach(item => {

                    const text =
                        item.innerText
                            .toLowerCase();

                    item.style.display =
                        text.includes(value)
                            ? "block"
                            : "none";

                });

        }
    );

}


/*=========================================================
                    SCROLL TO TOP
=========================================================*/

function initializeScrollTop() {

    if (!scrollTopBtn) {

        return;

    }


    scrollTopBtn.style.display =
        "none";


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 300) {

                scrollTopBtn.style.display =
                    "flex";

            }

            else {

                scrollTopBtn.style.display =
                    "none";

            }

        }
    );


    scrollTopBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/*=========================================================
                    THEME SYSTEM
=========================================================*/

function initializeTheme() {

    if (!themeBtn) {

        return;

    }


    const savedTheme =
        localStorage.getItem(
            "skillswap-theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        updateThemeIcon(true);

    }

    else {

        document.body.classList.remove(
            "dark-theme"
        );

        updateThemeIcon(false);

    }


    themeBtn.addEventListener(
        "click",
        () => {

            const darkMode =
                document.body.classList.toggle(
                    "dark-theme"
                );


            localStorage.setItem(
                "skillswap-theme",
                darkMode
                    ? "dark"
                    : "light"
            );


            updateThemeIcon(
                darkMode
            );

        }
    );

}


function updateThemeIcon(
    isDark
) {

    if (!themeBtn) {

        return;

    }


    const icon =
        themeBtn.querySelector(
            "i"
        );


    if (!icon) {

        return;

    }


    if (isDark) {

        icon.classList.remove(
            "fa-moon"
        );

        icon.classList.add(
            "fa-sun"
        );

    }

    else {

        icon.classList.remove(
            "fa-sun"
        );

        icon.classList.add(
            "fa-moon"
        );

    }

}


/*=========================================================
                NOTIFICATION SYSTEM
=========================================================*/

function initializeNotifications() {

    if (!notificationBtn) {

        return;

    }


    notificationBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleNotificationPanel();

        }
    );

}


function toggleNotificationPanel() {

    let panel =
        document.querySelector(
            ".notification-dropdown"
        );


    if (panel) {

        panel.remove();

        return;

    }


    panel =
        document.createElement(
            "div"
        );


    panel.className =
        "notification-dropdown";


    panel.innerHTML = `

        <div class="notification-dropdown-header">

            <strong>
                Notifications
            </strong>

            <button
                type="button"
                id="markNotificationsRead">

                Mark all read

            </button>

        </div>


        <div class="notification-dropdown-item unread">

            <i class="fa-solid fa-right-left"></i>

            <div>

                <strong>
                    New Skill Request
                </strong>

                <p>
                    Someone requested to learn Java from you.
                </p>

                <small>
                    Just now
                </small>

            </div>

        </div>


        <div class="notification-dropdown-item">

            <i class="fa-solid fa-comments"></i>

            <div>

                <strong>
                    New Message
                </strong>

                <p>
                    You received a new message.
                </p>

                <small>
                    1 hour ago
                </small>

            </div>

        </div>


        <div class="notification-dropdown-item">

            <i class="fa-solid fa-star"></i>

            <div>

                <strong>
                    New Review
                </strong>

                <p>
                    You received a 5-star review.
                </p>

                <small>
                    Yesterday
                </small>

            </div>

        </div>

    `;


    document.body.appendChild(
        panel
    );


    const markReadBtn =
        document.querySelector(
            "#markNotificationsRead"
        );


    markReadBtn?.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".notification-dropdown-item"
                )
                .forEach(item => {

                    item.classList.remove(
                        "unread"
                    );

                });


            const badge =
                notificationBtn.querySelector(
                    ".badge"
                );


            if (badge) {

                badge.textContent =
                    "0";

            }

        }
    );


    setTimeout(() => {

        document.addEventListener(
            "click",
            closeNotificationOutside
        );

    }, 0);

}


function closeNotificationOutside(
    event
) {

    const panel =
        document.querySelector(
            ".notification-dropdown"
        );


    if (!panel) {

        document.removeEventListener(
            "click",
            closeNotificationOutside
        );

        return;

    }


    if (
        !panel.contains(
            event.target
        ) &&
        !notificationBtn.contains(
            event.target
        )
    ) {

        panel.remove();

        document.removeEventListener(
            "click",
            closeNotificationOutside
        );

    }

}


/*=========================================================
                LOAD USER PROFILE
=========================================================*/

async function loadUserProfile() {

    const token =
        getToken();


    if (!token) {

        return;

    }


    /*
        First load cached user.
        This prevents "User" from appearing
        while API is loading.
    */

    const cachedUser =
        localStorage.getItem(
            USER_KEY
        );


    if (cachedUser) {

        try {

            const user =
                JSON.parse(
                    cachedUser
                );


            const fullName =
                user.full_name ||
                "User";


            setText(
                userNameElement,
                fullName
            );


            setText(
                welcomeNameElement,
                fullName
            );


            if (
                profileImage &&
                user.profile_image
            ) {

                setProfileImage(
                    user.profile_image
                );

            }

        }

        catch (error) {

            console.warn(
                "Cached user data is invalid."
            );

        }

    }


    /*
        Fetch latest profile
        from backend
    */

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/users/profile`,
                {

                    method: "GET",

                    headers:
                        getAuthHeaders()

                }
            );


        if (
            response.status === 401
        ) {

            console.warn(
                "Authentication expired."
            );

            removeToken();

            localStorage.removeItem(
                USER_KEY
            );

            window.location.href =
                "login.html";

            return;

        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile"
            );

        }


        if (!data.user) {

            throw new Error(
                "User data not found"
            );

        }


        const user =
            data.user;
        console.log("FULL USER DATA:", user);
        console.log("PROFILE IMAGE:", user.profile_image);

        const fullName =
            user.full_name ||
            "User";


        setText(
            userNameElement,
            fullName
        );


        setText(
            welcomeNameElement,
            fullName
        );


     /*
    Profile image
*/

if (profileImage) {

    /*
        Default image
    */

    profileImage.src =
        "assets/images/default-user.png";


    /*
        If user has a profile image
    */

    if (
        user.profile_image &&
        user.profile_image !== "default.png"
    ) {

        /*
            Backend returned complete URL
        */

        if (
            user.profile_image.startsWith("http")
        ) {

            profileImage.src =
                user.profile_image;

        }

        /*
            Backend returned only filename
        */

        else {

            profileImage.src =
                `http://localhost:5000/uploads/${user.profile_image}`;

        }

    }


    /*
        If uploaded image cannot be loaded,
        use default image
    */

    profileImage.onerror = function () {

        console.warn(
            "Profile image could not be loaded. Using default image."
        );

        profileImage.src =
            "assets/images/default-user.png";

    };

}


/*=========================================================
                CHART.JS ANALYTICS
=========================================================*/

let analyticsChart = null;

let progressChart = null;


function initializeAnalyticsChart() {

    const canvas =
        document.querySelector(
            "#analyticsChart"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    if (analyticsChart) {

        analyticsChart.destroy();

    }


    analyticsChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: [

                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun"

                    ],

                    datasets: [

                        {

                            label:
                                "Skill Exchanges",

                            data: [

                                5,
                                8,
                                12,
                                10,
                                18,
                                24

                            ],

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true,

                            borderColor:
                                "#4f46e5",

                            backgroundColor:
                                "rgba(79,70,229,0.12)",

                            pointRadius: 4,

                            pointHoverRadius: 7

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }
        );

}


function initializeProgressChart() {

    const canvas =
        document.querySelector(
            "#progressChart"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    if (progressChart) {

        progressChart.destroy();

    }


    progressChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [

                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"

                    ],

                    datasets: [

                        {

                            label:
                                "Learning Hours",

                            data: [

                                1,
                                2,
                                1.5,
                                3,
                                2.5,
                                4,
                                3

                            ],

                            borderRadius: 8,

                            backgroundColor:
                                "#6366f1"

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }
        );

}


/*=========================================================
                    LOGOUT
=========================================================*/

function initializeLogout() {

    if (!logoutBtn) {

        return;

    }


    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            removeToken();

            localStorage.removeItem(
                USER_KEY
            );


            window.location.href =
                "login.html";

        }
    );

}


/*=========================================================
                    RIPPLE EFFECT
=========================================================*/

function initializeRippleEffect() {

    document
        .querySelectorAll("button")
        .forEach(button => {

            button.classList.add(
                "ripple"
            );


            button.addEventListener(
                "click",
                function(event) {

                    const ripple =
                        document.createElement(
                            "span"
                        );


                    ripple.className =
                        "ripple-effect";


                    const rect =
                        button.getBoundingClientRect();


                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );


                    ripple.style.width =
                        `${size}px`;

                    ripple.style.height =
                        `${size}px`;


                    ripple.style.left =
                        `${event.clientX -
                            rect.left -
                            size / 2}px`;

                    ripple.style.top =
                        `${event.clientY -
                            rect.top -
                            size / 2}px`;


                    button.appendChild(
                        ripple
                    );


                    setTimeout(
                        () => {

                            ripple.remove();

                        },
                        600
                    );

                }
            );

        });

}


/*=========================================================
                PROFILE BUTTON
=========================================================*/

function initializeProfileButton() {

    if (!profileBtn) {

        return;

    }


    profileBtn.style.cursor =
        "pointer";


    profileBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "profile.html";

        }
    );

}


/*=========================================================
                ACTION BUTTONS
=========================================================*/

function initializeActionButtons() {

    const exploreButton =
        document.querySelector(
            ".primary-btn"
        );


    if (exploreButton) {

        exploreButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "skills.html";

            }
        );

    }


    const addSkillButton =
        document.querySelector(
            ".secondary-btn"
        );


    if (addSkillButton) {

        addSkillButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "skills.html";

            }
        );

    }

}


/*=========================================================
                IMAGE FALLBACK
=========================================================*/

function initializeImageFallback() {

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    if (
                        image.dataset
                            .fallbackApplied
                    ) {

                        return;

                    }


                    image.dataset
                        .fallbackApplied =
                        "true";


                    /*
                        Do not replace
                        dashboard illustration
                        with profile image.
                    */

                    if (
                        image ===
                        profileImage
                    ) {

                        return;

                    }

                }
            );

        });

}


/*=========================================================
                PAGE INITIALIZATION
=========================================================*/

async function initializeDashboard() {

    console.log(
        "Initializing SkillSwap Dashboard..."
    );


    /*
        Authentication
    */

    if (
        !checkAuthentication()
    ) {

        return;

    }


    /*
        UI
    */

    initializeSidebar();

    initializeCounters();

    initializeSearch();

    initializeScrollTop();

    initializeTheme();

    initializeNotifications();

    initializeLogout();

    initializeRippleEffect();

    initializeProfileButton();

    initializeActionButtons();


    /*
        Charts
    */

    initializeAnalyticsChart();

    initializeProgressChart();


    /*
        User
    */

    await loadUserProfile();


    console.log(
        "SkillSwap Dashboard Loaded Successfully 🚀"
    );

}


/*=========================================================
                    START APPLICATION
=========================================================*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboard
    );

}

else {

    initializeDashboard();

}