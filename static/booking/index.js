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
    attraction_id = 1;
    url = 'http://54.248.121.92:3000/api/attraction/' + attraction_id ;
    
    const response = await fetch( url, {
        cache: "no-cache", 
        credentials: "same-origin", 
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {

        sightseeingData = jsonData.data;
        count = jsonData.data.length;
        // loadFinish = true;
        console.log( sightseeingData );

        // for( num = 0 ; num < count ; num++ ){

        //     let cardDiv = document.createElement('div');
        //     let cardImg = document.createElement('div');
        //     let img = document.createElement('img');
        //     let cardTextContent = document.createElement('div');
        //     let cardName = document.createElement('div');
        //     let cardCategory = document.createElement('div');
        //     let cardMrt = document.createElement('div');

        //     cardDiv.classList.add('card');
        //     cardImg.classList.add('card-image');
        //     cardTextContent.classList.add('card-textContent');
        //     cardName.classList.add('card-name');
        //     cardCategory.classList.add('card-category');
        //     cardMrt.classList.add('card-mrt');

        //     cardName.textContent = jsonData.data[num].name;
        //     cardCategory.textContent = jsonData.data[num].category;
        //     cardMrt.textContent = jsonData.data[num].mrt;
        //     img.src = jsonData.data[num].images[0] ;

        //     cardDiv.appendChild(cardImg);
        //     cardImg.appendChild(img);
        //     cardTextContent.appendChild(cardName);
        //     cardTextContent.appendChild(cardCategory);
        //     cardTextContent.appendChild(cardMrt);
        //     cardDiv.appendChild(cardTextContent);

        //     document.querySelector('.attractions .container').appendChild(cardDiv);
        // }

        // if( jsonData.nextPage != null ){
        //     page++;
        // }else{
        //     hasNextPage = false;
        //     nodData.style.display="block"; 
        // }

    }).catch((err) => {
        console.error('錯誤:', err);
    });
}