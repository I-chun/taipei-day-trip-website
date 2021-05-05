const attraction_name = document.querySelector(".name");
const attraction_category = document.querySelector(".category");
const attraction_mrt = document.querySelector(".mrt");
const attraction_description = document.querySelector(".description");
const attraction_address = document.querySelector(".address");
const attraction_transport = document.querySelector(".transport");
const radioBtn = document.querySelectorAll( ".book_form input[type='radio']");
const price = document.querySelector( ".book_form .price");

// models
let models={
    data: null,
    attraction_id: window.location.pathname.split('/')[2],
    getProductData:function(){
        let url = "http://127.0.0.1:3000/api/attraction/" + this.attraction_id ;
        return fetch(url).then((response)=>{
            return response.json();
        }).then((result)=>{
            this.data=result.data;
        }).catch((err) => {
            console.error('錯誤:', err);
        });
    }
}

// views
let views={
    renderData:function(){

        attraction_name.textContent = models.data.name;
        attraction_category.textContent = models.data.category;
        attraction_mrt.textContent = models.data.mrt;
        attraction_description.textContent = models.data.description;
        attraction_address.textContent = models.data.address;
        attraction_transport.textContent = models.data.transport;

        models.data.images.forEach((item, index)=>{
            let slideshowDiv = document.querySelector('.slideshow-container');
            let dotsDiv = document.querySelector('.dots');

            let slideDiv = document.createElement('div');
            let dotSpan = document.createElement('span');
            let img = document.createElement('img');

            slideDiv.classList.add('mySlides');
            slideDiv.classList.add('fade');
            dotSpan.classList.add('dot');

            img.src = item;
            dotSpan.setAttribute('data-currentSlide', index);

            slideDiv.appendChild(img);
            slideshowDiv.appendChild(slideDiv);
            dotsDiv.appendChild(dotSpan);
        });
    }
}

// controller
let controller={
    removeProduct:function(e){
        models.removeProductData(e.currentTarget.textContent);
        views.renderData();
    },
    init:function(){
        models.getProductData().then(()=>{
            views.renderData();
        }).then(()=>{
            slideShow.dotsEle = document.querySelectorAll('.dot');
            slideShow.slide( slideShow.slideIndex );
            slideShow.clickHandler();
        });
    },
}

let slideShow = {
    slideIndex : 1,
    prevEle : document.querySelector(".prev"),
    nextEle : document.querySelector(".next"),
    dotsEle : null,
    slide : function(n){
        let i;
        const mySlides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");
        if (n > mySlides.length) {
            slideShow.slideIndex = 1
        }
        if (n < 1) {
            slideShow.slideIndex = mySlides.length
        }
    
        for (i = 0; i < mySlides.length; i++) {
            mySlides[i].style.display = "none";
        }
    
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
    
        mySlides[slideShow.slideIndex-1].style.display = "block";
        dots[slideShow.slideIndex-1].className += " active";
    },
    clickHandler: function(e){

        slideShow.prevEle.addEventListener('click', function(e){
            slideShow.slide(slideShow.slideIndex += -1);
        });
        slideShow.nextEle.addEventListener('click', function(e){
            slideShow.slide(slideShow.slideIndex += 1);
        });

        slideShow.dotsEle.forEach( dotEle => {
            dotEle.addEventListener('click', function(e){
                let current = parseInt(dotEle.getAttribute('data-currentSlide')) + 1;
                slideShow.slide(slideShow.slideIndex = current);
            });
        });
    }
}

radioBtn.forEach(element => {
    element.addEventListener("click", function(e){
        if(element.value == "morning"){
            price.textContent = '2000';
        }
        if(element.value == "afternoon"){
            price.textContent = '2500';
        }
    })
})

window.onload = function(){
    controller.init();
}
