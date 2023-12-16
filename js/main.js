document.querySelector('.logo').addEventListener('click',()=>{
    window.location.href = 'http://google.com'
})


window.addEventListener('scroll',revalCards)
function revalCards(){
  
    let flexboxMember = document.querySelectorAll('.flexbox-member');
    // Scroll Listner 
    let lastScrollTop=0;
    var st = window.pageYOffset || document.documentElement.scrollTop;
    flexboxMember.forEach(element => {
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop - 500 <0 && !element.classList.contains('reval')) {
        element.classList.add('reval');
        } 
    });
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}