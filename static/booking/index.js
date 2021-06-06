const signInSignUpBtn = document.querySelector('.signIn_signUp_btn');
const logOutBtn = document.querySelector('.logOutBtn');
const formContainer = document.querySelector('.form_container');
const formClose = document.querySelectorAll('.close');
const formSwitch = document.querySelectorAll('.switch');
const attraction_name = document.querySelector('.name');
const attraction_image = document.querySelector('.image');
const attraction_date = document.querySelector('.date');
const attraction_time = document.querySelector('.time');
const attraction_price = document.querySelector('.price');
const attraction_address = document.querySelector('.address');
const attraction_total_price = document.querySelector('.total_price');
const user_name1 = document.querySelector('.user_name1');
const user_name2 = document.querySelector('input[name="user_name2"]');
const user_email = document.querySelector('input[name="user_email"]');
const info_container = document.querySelector('.info_container');
const emptystate_container = document.querySelector('.emptystate_container');
const attractionData = {};
const loader = document.querySelector(".svg-loader");

displayLoading();

window.onload = function(){
    getUser().then(()=>{
        getBooking().then(()=>{
            hideLoading();
        });
    });
}

function displayLoading(){
    loader.classList.add("display-flex");
}

function hideLoading(){
    loader.classList.remove("display-flex");
}

const getBooking = async () =>{

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url =  devurl + ":3000/api/booking";
    
    const response = await fetch( url, {
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        if( jsonData.data == null ){
            info_container.style.display = "none";
            emptystate_container.style.display = "block";
        }else{
            attraction_name.textContent = jsonData.data.attraction.name;
            attraction_date.textContent = jsonData.data.date;
            if ( jsonData.data.time == "morning" ){
                attraction_time.textContent = "早上 9 點到下午 4 點";
            }
            if( jsonData.data.time == "afternoon" ){
                attraction_time.textContent = "下午 2 點到晚上 9 點";
            }
            attraction_image.src = jsonData.data.attraction.image;
            attraction_price.textContent = jsonData.data.price;
            attraction_total_price.textContent = jsonData.data.price;
            attraction_address.textContent = jsonData.data.attraction.address;

            attractionData.id =  jsonData.data.attraction.id;
            attractionData.name = jsonData.data.attraction.name;
            attractionData.address = jsonData.data.attraction.address;
            attractionData.image = jsonData.data.attraction.image;
            attractionData.time = jsonData.data.time;
            attractionData.price = jsonData.data.price;
            attractionData.date =  jsonData.data.date;
        }
    }).catch((err) => {
        console.error('錯誤:', err);
    });
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
            emptystate_container.style.display = "block";
            info_container.style.display = "none";
            user_name1.textContent = "使用者";
            window.location.href = '/';
        }else{         
            logOutBtn.style.display = 'block';
            signInSignUpBtn.style.display = 'none';
            info_container.style.display = "block";
            emptystate_container.style.display = "none";
            user_name1.textContent = jsonData.data.name;
            user_name2.value = jsonData.data.name;
            user_email.value = jsonData.data.email;
        }
    }).catch((err) => {
        console.error('錯誤:', err);
    });
}

document.querySelector('.signUpSubmitBtn').addEventListener('click', function(e){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/user' ;

    const nameEle = document.querySelector('#signUpName');
    const emailEle = document.querySelector('#signUpEmail');
    const passwordEle = document.querySelector('#signUpPassword');

    if ( !nameEle.value || !emailEle.value || !passwordEle.value ){
        document.querySelector(".signUpMessage").textContent = "請輸入完整註冊資料";
        document.querySelector(".signUpMessage").classList.add("danger");
        return

    }

    if ( !validateEmail(emailEle.value)){
        document.querySelector(".signUpMessage").textContent = "EMAIL輸入格式有誤";
        document.querySelector(".signUpMessage").classList.add("danger");
        return
    }

    document.querySelector(".signInMessage").textContent = "";
    document.querySelector(".signUpMessage").textContent = "";

    let signUpformData = {
        "name": nameEle.value,
        "email": emailEle.value,
        "password": passwordEle.value
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
                getUser().then(()=>{
                    getBooking();
                });
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
        location.reload();
        
    }).catch((err) => {
        console.error('錯誤:', err);
    });
});


document.querySelector('.delete').addEventListener('click', function(e){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/booking' ;

    const response = fetch( url, {
        method: 'DELETE',
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
       
        logOutBtn.style.display = 'none';
        signInSignUpBtn.style.display = 'block';
        location.reload();
        
    }).catch((err) => {
        console.error('錯誤:', err);
    });
});

function setOrder(prime){

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    url = devurl + ':3000/api/orders' ;

    let orderData = {
        "prime" : prime,
        "order" : {
            "price" :  document.querySelector(".price").textContent,
            "trip": {
                "attraction" : {
                    "id" : attractionData.id,
                    "name" : attractionData.name,
                    "address": attractionData.address,
                    "image": attractionData.image
                },
                "date": attractionData.date,
                "time": attractionData.time
            },
            "contact": {
                "name":  document.querySelector('input[name="user_name2"]').value,
                "email":  document.querySelector('input[name="user_email"]').value,
                "phone":  document.querySelector('input[name="user_phone"]').value,
            }
        }
    };

    const response = fetch( url, {
        method: 'POST',
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( orderData )
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        let url = "/thankyou?number=" + jsonData.data.number;
        window.location.href = url;
    }).catch((err) => {
        console.error('錯誤:', err);
    }).finally(()=>{
        hideLoading();
    });
}

function validateEmail(email) { //Validates the email address
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}
