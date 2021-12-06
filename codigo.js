const moon = document.querySelector(".moon");
const moonitem = document.querySelector(".moonItem");

function dark (){
  let body = document.querySelector("body");
  let colorPage = localStorage.getItem("selected-theme");
  body.classList.add(colorPage)
  moonitem.classList.toggle("ri-sun-line")
}

  let body = document.querySelector("body");
  body.classList.add(localStorage.getItem("selected-theme"));



moon.addEventListener("click",dark)



const sections = document.querySelectorAll("section[id]");

function activeLinks(){
	sections.forEach(current=>{
	let scrollY = pageYOffset;
    let sectionHeight = current.offsetHeight;
    let sectionTop = current.offsetTop - 50;
    let sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector('.container-nav a[href*='+ sectionId +']').classList.add("active");


    }else{
        document.querySelector('.container-nav a[href*='+ sectionId +']').classList.remove("active");
    }
})
}

window.addEventListener("scroll",activeLinks)

 let clickNav = document.querySelectorAll(".items-nav");
 let itemNavA = document.querySelectorAll(".items-a");

 itemNavA.forEach(n=>{
    n.addEventListener("click",(e)=>{
    let containerNav = document.querySelector(".container-nav");
    if (containerNav.classList.contains("active")) {
        containerNav.classList.remove("active")
    }
    })
 })



const sr = ScrollReveal({
    distance:"70px",
    duration:2700,
    reset:true
})

sr.reveal(".jaja , .rofl,.container-about-title, .servicios-title, .slide-contain, .title-proyects, .aviso, .info-about-project-title, .cajaForSlide, .workers-title, .boxWorkerAnimate, .contact-title, .fooster-container,.content-terminos-privacidad",{
    origin:"top",
    interval:100,

})
sr.reveal(".about-description, .imgBx, .content-icon-group, .aviso-text, .ri-message-2-line, .social-media-icons, .ri-settings-2-line",{
    origin:"left",
    interval:100,

})
sr.reveal(".imgBx, .work-animation, .arrow-animation, .contactAnimate, .form, .proyect-title-animate",{
    origin:"right",
    interval:100,

})

