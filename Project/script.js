const heroImages = [
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
];

let currentIndex = 0;

const heroImage = document.querySelector(".hero-right img");

setInterval(() => {
    currentIndex++;

    if(currentIndex >= heroImages.length){
        currentIndex = 0;
    }

    heroImage.src = heroImages[currentIndex];
}, 4000);


document.querySelector(".fa-moon")
.addEventListener("click", function(){
    document.body.classList.toggle("light-mode");
});


window.addEventListener("scroll", function(){
    const winScroll =
        document.body.scrollTop ||
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrolled = (winScroll / height) * 100;

    document.querySelector(".progress-bar").style.width =
        scrolled + "%";
});


window.addEventListener("scroll", function(){
    const sections = document.querySelectorAll("section");

    sections.forEach(section=>{
        const position = section.getBoundingClientRect().top;

        if(position < window.innerHeight - 100){
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }
    });
});


document.querySelector(".newsletter button")
.addEventListener("click", function(){
    let email = document.querySelector(".newsletter input").value;

    if(email === ""){
        alert("Enter email");
        return;
    }

    alert("Subscribed");
});


document.querySelector(".chat-btn")
.addEventListener("click", function(){
    alert("Support chat coming soon");
});