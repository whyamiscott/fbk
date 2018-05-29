var formEl = document.getElementById('form'),
    submitButtonEl = document.getElementById('submit-button'),
    successMsgEl = document.getElementById('success-msg');

var validationMessages = {
    'required': 'Поле обязательно для заполнения',
    'email': 'Не похоже на адрес электронной почты',
    'tel': 'Не похоже на номер телефона'
};

formEl.addEventListener('submit', function(e) {
    e.preventDefault();

    var fields = e.target.querySelectorAll('.form__field'),
        errors = e.target.querySelectorAll('.form__error'),
        i = 0,
        fieldsLen = fields.length,
        errorsLen = errors.length,
        error = false;

    for (i; i<errorsLen; i++) {
        errors[i].remove();
    }

    i = 0;

    for (i; i<fieldsLen; i++) {
        fields[i].classList.remove('form__field--error');

        if (fields[i].classList.contains('form__field--required') && !fields[i].value.trim()) {
            showError(fields[i], validationMessages['required']);

            error = true;
        } else if (fields[i].classList.contains('form__field--email') && fields[i].value.trim()) {
            if (!isEmail(fields[i].value.trim())) {
                showError(fields[i], validationMessages['email']);

                error = true;
            }
        } else if (fields[i].classList.contains('form__field--tel') && fields[i].value.trim()) {
            if (!isTel(fields[i].value.trim())) {
                showError(fields[i], validationMessages['tel']);

                error = true;
            }
        }
    }

    if (!error) {
        submitButtonEl.setAttribute('disabled', true);

        var data = new FormData(e.target);

        var xhr = new XMLHttpRequest();

        xhr.open(formEl.getAttribute('method'), formEl.getAttribute('action'));

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    formEl.style.display = 'none';
                    successMsgEl.style.display = 'block';
                } else {
                    submitButtonEl.removeAttribute('disabled');

                    alert(xhr.status + ': ' + xhr.statusText);
                }
            }
        };
        
        xhr.onerror = function (e) {
            submitButtonEl.removeAttribute('disabled');

            alert(xhr.status + ': ' + xhr.statusText);
        };

        xhr.send(data);
    } else {
        e.target.querySelector('.form__field--error').focus();
    }
});

function isEmail(s) {
    var r = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    
    return r.test(s);
}

function isTel(s) {
    var s = s.replace(/\s+|\-|\(|\)/g, ''),
        r = new RegExp(/^(((\+[1-9]))|([1-9]))([0-9]){10}$/);
    
    return r.test(s);
}

function showError(field, msg) {
    field.classList.add('form__field--error');

    var errorEl = document.createElement('p');

    errorEl.className = 'form__error';
    errorEl.innerHTML = msg;

    field.parentNode.appendChild(errorEl);
}