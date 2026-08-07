/*=========================================================
            SKILLSWAP DASHBOARD JAVASCRIPT
=========================================================*/

"use strict";

/*=========================================================
                DOM ELEMENTS
=========================================================*/

const sidebar = document.querySelector(".sidebar");

const menuLinks = document.querySelectorAll(".menu li");

const logoutBtn = document.querySelector(".logout button");

const searchInput = document.querySelector(".search-box input");

const notificationBtn = document.querySelector("#notificationBtn");

const themeBtn = document.querySelector("#themeBtn");

const profileBtn = document.querySelector(".profile-box");

const statNumbers = document.querySelectorAll(".counter");

const scrollTopBtn = document.querySelector(".scroll-top");


/*=========================================================
                ACTIVE SIDEBAR MENU
=========================================================*/

menuLinks.forEach(item=>{

    item.addEventListener("click",()=>{

        menuLinks.forEach(link=>{

            link.classList.remove("active");

        });

        item.classList.add("active");

    });

});


/*=========================================================
                COUNTER ANIMATION
=========================================================*/

function animateCounter(counter){

    const target=+counter.getAttribute("data-target");

    let current=0;

    const speed=Math.ceil(target/100);

    const update=()=>{

        current+=speed;

        if(current>=target){

            counter.innerText=target;

        }

        else{

            counter.innerText=current;

            requestAnimationFrame(update);

        }

    };

    update();

}

statNumbers.forEach(counter=>{

    animateCounter(counter);

});


/*=========================================================
                SEARCH FILTER
=========================================================*/

searchInput.addEventListener("keyup",()=>{

    const value=searchInput.value.toLowerCase();

    document.querySelectorAll(".request-item").forEach(item=>{

        const text=item.innerText.toLowerCase();

        item.style.display=text.includes(value)
            ?"flex"
            :"none";

    });

});


/*=========================================================
                SCROLL TO TOP
=========================================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY>250){

        scrollTopBtn.style.display="flex";

    }

    else{

        scrollTopBtn.style.display="none";

    }

});

scrollTopBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*=========================================================
                RIPPLE EFFECT
=========================================================*/

document.querySelectorAll("button").forEach(button=>{

    button.classList.add("ripple");

});


/*=========================================================
                PAGE LOADED
=========================================================*/

window.addEventListener("load",()=>{

    console.log("SkillSwap Dashboard Loaded Successfully 🚀");

});