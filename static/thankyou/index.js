const signInSignUpBtn = document.querySelector('.signIn_signUp_btn');
const logOutBtn = document.querySelector('.logOutBtn');
const formContainer = document.querySelector('.form_container');
const formClose = document.querySelectorAll('.close');
const formSwitch = document.querySelectorAll('.switch');
const orderNumber = document.querySelector(".order_number");
const params = new URLSearchParams(window.location.search);
const number = params.get("number");

window.onload = function(){
    getUser();
    orderNumber.textContent = number;
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
            window.location.href = '/';
        }else{         
            logOutBtn.style.display = 'block';
            signInSignUpBtn.style.display = 'none';
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

