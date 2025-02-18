
//Main content
const mainContent = document.querySelector(".main-content");
//Navigation bar
const navBar = document.querySelector('.nav-bar');
const navBarHeight = navBar.offsetHeight;

window.addEventListener("load", () => {
    
    //Add padding to the top of main content equal to nav bar so its not covered
    mainContent.style.paddingTop = `${navBarHeight}px`;
})

window.addEventListener('scroll', () => {
    // Dynamic navigation menu
    // Retrieve the navigation menu from the DOM
    const companyLogo = document.querySelector('.company-logo-scroll');

    let scrollPercent = Math.min((window.scrollY / window.innerHeight) * 100, 100);
    document.documentElement.style.setProperty("--scroll-percent", `${scrollPercent}%`);

    // Make navigation menu fixed to the top of the screen when a certain vertical scroll threshold is reached
    navBar.classList.toggle('sticky', window.scrollY > navBar.offsetTop);

    // Display the company logo in a white box in the top left corner of the fixed navigation menu when a 
    // vertical scroll threshold is reached 
    companyLogo.classList.toggle('company-logo-scroll-active', window.scrollY > navBar.offsetTop);

    mainContent.style.paddingTop = `${navBarHeight}px`;

    // Scroll to top button
    const scrollUp = document.querySelector('.scroll-up-button');
    // Display scroll button when scrolled 
    scrollUp.classList.toggle('visible', window.scrollY > navBar.offsetTop);
    //Scroll to top when pressed
    scrollUp.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
            });
            
        });
})

document.addEventListener("DOMContentLoaded", function () {

    const burger = document.querySelector(".burger-menu");
    const mobileNav = document.querySelector(".mobile-nav");

    burger.addEventListener("click", function () {
        mobileNav.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!burger.contains(event.target) && !mobileNav.contains(event.target)) {
            mobileNav.classList.remove("active");
        }
    });
    
    const images = document.querySelectorAll(".about-img");

    function revealOnScroll() {
        images.forEach((image) => {
            const rect = image.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                image.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); 
});

//Lesson page 
const lessons = document.querySelectorAll(".dropdown");

//for each lesson expand if clicked
lessons.forEach(lesson => {
    lesson.querySelector(".lesson-header").addEventListener("click", () => {
        lesson.classList.toggle("active");
    })
})


