const attraction_name = document.querySelector(".name");
const attraction_category = document.querySelector(".category");
const attraction_mrt = document.querySelector(".mrt");
const attraction_description = document.querySelector(".description");
const attraction_address = document.querySelector(".address");
const attraction_transport = document.querySelector(".transport");
const radioBtn = document.querySelectorAll( ".book_form input[type='radio']");
const price = document.querySelector( ".book_form .price");
const signInSignUpBtn = document.querySelector('.signIn_signUp_btn');
const logOutBtn = document.querySelector('.logOutBtn');
const formContainer = document.querySelector('.form_container');
const formClose = document.querySelectorAll('.close');
const formSwitch = document.querySelectorAll('.switch');
const booking_message = document.querySelector('.bookingMessage');
let isLogin = false;

// models
let models={
    data: null,
    attraction_id: window.location.pathname.split('/')[2],
    getProductData:function(){
        let devurl = "http://54.248.121.92";
        let testurl = "http://127.0.0.1";
        let url = devurl + ":3000/api/attraction/" + this.attraction_id ;
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
        }).then(()=>{
            getUser();
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

signInSignUpBtn.addEventListener('click', function(e){
    formContainer.style.display = "block";
    document.querySelector(".signInMessage").textContent = "";
    document.querySelector(".signUpMessage").textContent = "";
    document.querySelector('#signUpName').value = "";
    document.querySelector('#signUpEmail').value = "";
    document.querySelector('#signUpPassword').value = "";
    document.querySelector('#signInEmail').value = "";
    document.querySelector('#signInPassword').value = "";

});

formClose.forEach( item =>{
    item.addEventListener('click', function(e){
        formContainer.style.display = "none";
    })
});      

document.querySelector('.signUp').style.display = 'none';
formSwitch.forEach( item =>{
    item.addEventListener('click', function(e){
        if( document.querySelector('.signUp').style.display == 'none'){
            document.querySelector('.signUp').style.display = 'flex';
            document.querySelector('.signIn').style.display = 'none';
            document.querySelector(".signInMessage").textContent = "";
            document.querySelector(".signUpMessage").textContent = "";
            document.querySelector('#signUpName').value = "";
            document.querySelector('#signUpEmail').value = "";
            document.querySelector('#signUpPassword').value = "";
            document.querySelector('#signInEmail').value = "";
            document.querySelector('#signInPassword').value = "";
        }else{
            document.querySelector('.signUp').style.display = 'none';
            document.querySelector('.signIn').style.display = 'flex';
            document.querySelector(".signInMessage").textContent = "";
            document.querySelector(".signUpMessage").textContent = "";
            document.querySelector('#signUpName').value = "";
            document.querySelector('#signUpEmail').value = "";
            document.querySelector('#signUpPassword').value = "";
            document.querySelector('#signInEmail').value = "";
            document.querySelector('#signInPassword').value = "";
        }
    });
});

const getUser = async () =>{
    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/user' ;

    const response = await fetch( url, {
        method: 'GET',
        cache: "no-cache", 
        credentials: "same-origin", 
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        if( jsonData.data == null ) {
            logOutBtn.style.display = 'none';
            signInSignUpBtn.style.display = 'block';
            isLogin = false;
        }else{
            logOutBtn.style.display = 'block';
            signInSignUpBtn.style.display = 'none';
            isLogin = true;
        }
    }).catch((err) => {
        console.error('錯誤:', err);
    });
}

document.querySelector('.book_btn').addEventListener('click', function(e){

    const bookingDate = document.querySelector("input[name='date']").value;
    const bookingTime = document.querySelector("input[name=time]:checked");
    const bookingPrice = document.querySelector(".price").textContent;

    if ( bookingDate == "" || bookingTime == null){

        booking_message.textContent = "請選擇日期及時間";
        booking_message.classList.add("danger");

    }else{

        let url = "";
        url = 'http://127.0.0.1:3000/api/booking';
    
        let bookingData = {
            "attractionId" :  window.location.pathname.split('/')[2],
            "date": bookingDate,
            "time": bookingTime.value,
            "price": bookingPrice,
        };
            
        const response = fetch( url, {
            method: 'POST',
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( bookingData )
        })
        .then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            if ( jsonData.ok ){
                window.location.replace("/booking");
            }else if( jsonData.message == "未登入系統，拒絕存取" ){
                formContainer.style.display = "block";
                document.querySelector(".signInMessage").textContent = "請先登入會員";
                document.querySelector(".signInMessage").classList.add("danger");
            }
    
        }).catch((err) => {
            console.error('錯誤:', err);
        });
    }
});

document.querySelector('.signUpSubmitBtn').addEventListener('click', function(e){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/user' ;

    
    document.querySelector(".signInMessage").textContent = "";
    document.querySelector(".signUpMessage").textContent = "";

    let signUpformData = {
        "name": document.querySelector('#signUpName').value,
        "email": document.querySelector('#signUpEmail').value,
        "password": document.querySelector('#signUpPassword').value
    };

    const response = fetch( url, {
        method: 'POST',
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( signUpformData )
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        if( jsonData.ok ){
            document.querySelector(".signUpMessage").textContent = "註冊成功";
            document.querySelector(".signUpMessage").classList.add("info");

            let t = setTimeout( function(e){
                formContainer.style.display = "none";
                getUser();
                clearTimeout(t);
            },1000);
        }else{
            document.querySelector(".signUpMessage").textContent = jsonData.message;
            document.querySelector(".signUpMessage").classList.add("danger");
        }

    }).catch((err) => {
        console.error('錯誤:', err);
    });
});

document.querySelector('.signInSubmitBtn').addEventListener('click', function(e){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/user' ;

    document.querySelector(".signInMessage").textContent = "";
    document.querySelector(".signUpMessage").textContent = "";

    let signInformData = {
        "email": document.querySelector('#signInEmail').value,
        "password": document.querySelector('#signInPassword').value
    };

    const response = fetch( url, {
        method: 'PATCH',
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( signInformData )
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        if( jsonData.ok ){
            document.querySelector(".signInMessage").textContent = "登入成功";
            document.querySelector(".signInMessage").classList.add("info"); 

            let t = setTimeout( function(e){
                formContainer.style.display = "none";
                booking_message.textContent = "";
                getUser();
                clearTimeout(t);
            },1000);

        }else{
            document.querySelector(".signInMessage").textContent = jsonData.message;
            document.querySelector(".signInMessage").classList.add("danger");
        }

    }).catch((err) => {
        console.error('錯誤:', err);
    });
});

document.querySelector('.logOutBtn').addEventListener('click', function(e){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/user' ;

    let signUpformData = {
        "email": document.querySelector('#signInEmail').value,
        "password": document.querySelector('#signInPassword').value
    };

    const response = fetch( url, {
        method: 'DELETE',
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify( signUpformData )
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        logOutBtn.style.display = 'none';
        signInSignUpBtn.style.display = 'block';
        
    }).catch((err) => {
        console.error('錯誤:', err);
    });
});


document.querySelector('.booking').addEventListener('click', function(e){
    if( isLogin ){
        window.location.href = '/booking';
    }else{
        formContainer.style.display = "block";
        document.querySelector(".signInMessage").textContent = "請先登入會員";
        document.querySelector(".signInMessage").classList.add("danger");
    }
})