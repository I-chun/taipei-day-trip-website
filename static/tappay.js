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
    e.preventDefault()
    
    // fix keyboard issue in iOS device
    forceBlurIos()
    
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // console.log(tappayStatus)

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('請輸入完整資訊')
        return
    }

    // Get prime
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        // alert('get prime 成功，prime: ' + result.card.prime)
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
// ios區
