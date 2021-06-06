TPDirect.setupSDK(20396, 'app_ENqmrl6zVuMHWG2pMaDQhRWYCwJYmVfqLpNG1G9b8H4rERh0dE6S6713WkWa', 'sandbox');

// Display ccv field
TPDirect.card.setup({
    fields: {
        number: {
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            // 'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */
    // update.canGetPrime === true
    //     --> you can call TPDirect.card.getPrime()
    const submitButton = document.querySelector('button[type="submit"]')
    if (update.canGetPrime) {
        submitButton.removeAttribute('disabled')
    } else {
        submitButton.setAttribute('disabled', true)
    }
})

document.querySelector("button[type='submit']").addEventListener("click", function(e){

    const nameEle = document.querySelector('input[name="user_name2"]');
    const emailEle = document.querySelector('input[name="user_email"]');
    const phoneEle = document.querySelector('input[name="user_phone"]');

    if ( !nameEle.value || !emailEle.value || !phoneEle.value ){
        alert('請輸入完整聯絡資訊')
        return
    }

    if ( !validateEmail(emailEle.value)){
        alert('請輸入正確email')
        return
    }

    if ( !validatePhone(phoneEle.value)){
        alert('請輸入正確電話')
        return
    }

    e.preventDefault()
    
    // fix keyboard issue in iOS device
    forceBlurIos()
    
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('請輸入完整付款資訊')
        return
    }

    displayLoading();
    // Get prime
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        setOrder(result.card.prime);
    })
})

// ios區
function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function validateEmail(email) { //Validates the email address
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) { //Validates the phone number
    var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
    return phoneRegex.test(phone);
}