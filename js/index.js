
// scroll Animation
window.addEventListener("scroll", ()=>{
    let h2ContestText = document.querySelector('.content-text h2');
    let windowHeight = window.innerHeight;
    let elementTop = h2ContestText.getBoundingClientRect().top;
    let elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
        h2ContestText.classList.add("show");
    } else {
        h2ContestText.classList.remove("show");
    } 
});


// Slider auto move
let radiosSlider = document.querySelectorAll('input[type="radio"]');
let time = 0
let increase = 2000;//incresee to move more speed and decrease for slower move
 //first time
 let iterat = 0
radiosSlider.forEach((r)=>{
       setTimeout(()=>{
         console.log(increase*iterat)
         r.checked =true
     },increase*iterat)
     iterat+=1
})

 radiosSlider.forEach((r)=>
 {
     //for delay
     setTimeout(()=>{
         //for repeat it self
         setInterval(()=>{
            r.checked =true
         },increase*radiosSlider.length)
     },time)
     time+=increase;
 })