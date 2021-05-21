var sightseeingData = null;
var count = 0;
var num = 0;
var page = 0;
var hasNextPage = true;
var loadFinish = false;
var keyword = "";
var moreBtn = document.querySelector('.loadMore');
var searchBtn = document.querySelector('.searchBtn');
var nodData = document.querySelector('.nodata');
var signInSignUpBtn = document.querySelector('.signIn_signUp_btn');
var logOutBtn = document.querySelector('.logOutBtn');
var formContainer = document.querySelector('.form_container');
var formClose = document.querySelectorAll('.close');
var formSwitch = document.querySelectorAll('.switch');
let isLogin = false;

window.onload = function(){
    getData().then(()=>{
        getUser();
    })
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const getData = async () =>{

    let url = "";
    let devurl = "http://54.248.121.92";
    let testurl = "http://127.0.0.1";
    if ( keyword != "" ){
        url = devurl + ':3000/api/attractions?page=' + page + "&keyword=" + keyword ;
    }else{
        url = devurl + ':3000/api/attractions?page='+ page ;
    }

    const response = await fetch( url, {
        cache: "no-cache", 
        credentials: "same-origin", 
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        sightseeingData = jsonData.data;
        count = jsonData.data.length;
        loadFinish = true;

        for( num = 0 ; num < count ; num++ ){
            let cardDiv = document.createElement('div');
            let cardlink = document.createElement('a');
            let cardImg = document.createElement('div');
            let img = document.createElement('img');
            let cardTextContent = document.createElement('div');
            let cardName = document.createElement('div');
            let cardCategory = document.createElement('div');
            let cardMrt = document.createElement('div');

            cardDiv.classList.add('card');
            cardlink.classList.add('card-link');
            cardImg.classList.add('card-image');
            cardTextContent.classList.add('card-textContent');
            cardName.classList.add('card-name');
            cardCategory.classList.add('card-category');
            cardMrt.classList.add('card-mrt');

            cardName.textContent = jsonData.data[num].name;
            cardCategory.textContent = jsonData.data[num].category;
            cardMrt.textContent = jsonData.data[num].mrt;
            img.src = jsonData.data[num].images[0];
            cardlink.href = "/attraction/" + jsonData.data[num].id;
            console.log( cardlink.href );

            cardlink.appendChild(cardImg);
            cardImg.appendChild(img);
            cardTextContent.appendChild(cardName);
            cardTextContent.appendChild(cardCategory);
            cardTextContent.appendChild(cardMrt);
            cardlink.appendChild(cardTextContent);
            cardDiv.appendChild(cardlink);

            document.querySelector('.attractions .container').appendChild(cardDiv);
        }

        if( jsonData.nextPage != null ){
            page++;
        }else{
            hasNextPage = false;
            nodData.style.display="block"; 
        }

    }).catch((err) => {
        console.error('錯誤:', err);
    });
}

// window.addEventListener("scroll", function (e) {
//     let rect =  document.querySelector("footer").getBoundingClientRect();
//     if( rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight)){
//         if( hasNextPage && loadFinish ){
//             loadFinish = false;
//             getData( page ,keyword );
//         }
//     }
// });

var intersectionObserver = new IntersectionObserver(function(entries) {
    if (entries[0].intersectionRatio <= 0) return;
  
    if( hasNextPage && loadFinish ){
        loadFinish = false;
        getData( page ,keyword );
    }
});

intersectionObserver.observe(document.querySelector('footer'));


searchBtn.addEventListener('click', function(e){
    nodData.style.display="none"; 
    keyword = document.querySelector(".keyword").value;
    page = 0;
    hasNextPage = true;
    const container = document.querySelector('.attractions .container');
    removeAllChildNodes(container);
});

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
            document.querySelector('#signUpName').value = "";
            document.querySelector('#signUpEmail').value = "";
            document.querySelector('#signUpPassword').value = "";
            document.querySelector('#signInEmail').value = "";
            document.querySelector('#signInPassword').value = "";
            document.querySelector(".signInMessage").textContent = "";
            document.querySelector(".signUpMessage").textContent = "";
        }else{
            document.querySelector('.signUp').style.display = 'none';
            document.querySelector('.signIn').style.display = 'flex';
            document.querySelector('#signUpName').value = "";
            document.querySelector('#signUpEmail').value = "";
            document.querySelector('#signUpPassword').value = "";
            document.querySelector('#signInEmail').value = "";
            document.querySelector('#signInPassword').value = "";
            document.querySelector(".signInMessage").textContent = "";
            document.querySelector(".signUpMessage").textContent = "";
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