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
var formContainer = document.querySelector('.form_container');
var formClose = document.querySelector('.close');
var formSwitch = document.querySelector('.switch');

window.onload = function(){
    getData();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const getData = async () =>{

    let url = "";
    if ( keyword != "" ){
        url = 'http://127.0.0.1:3000/api/attractions?page=' + page + "&keyword=" + keyword ;
    }else{
        url = 'http://127.0.0.1:3000/api/attractions?page='+ page ;
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
    getData();
});


signInSignUpBtn.addEventListener('click', function(e){
    formContainer.style.display = "block";
});

formClose.addEventListener('click', function(e){
    formContainer.style.display = "none";
});

formSwitch.addEventListener('click', function(e){
    if( document.querySelector('signUp').style.display == 'none'){
        document.querySelector('signUp').style.display = 'block';
        document.querySelector('signIn').style.display = 'none';
    }else{
        document.querySelector('signUp').style.display = 'none';
        document.querySelector('signIn').style.display = 'block';
    }
});