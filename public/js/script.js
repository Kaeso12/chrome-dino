const menu = document.getElementsByClassName("burger")[0];
const dropDown = document.getElementsByClassName("dropdown")[0];
const menulists = document.querySelectorAll(".dropdown li");
const icon = document.getElementsByClassName("icon")[0];
const content1 = document.querySelector(".content");

if (window.innerWidth > 400) {
    // Sembunyikan kalau bukan ponsel
    document.body.style.display = "none";
}

icon.addEventListener("click", ()=> {
    console.log(123);
    window.location.href = "index.html";
})

menulists.forEach((li, idx) => {
    li.addEventListener("click", ()=> {
        dropDown.classList.remove("show");
    })
})

menu.addEventListener("click", (e)=> {
    e.stopPropagation()
    dropDown.classList.toggle("show");
    if(content1) {
        content1.style.transform = "translateX(-100vw)";
    }
    
})

document.addEventListener("click", (e)=> {
    e.stopPropagation()
    
    if(!menu.contains(e.target) && !dropDown.contains(e.target)) {
        dropDown.classList.remove("show");
    }  
})