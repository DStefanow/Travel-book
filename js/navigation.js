
const kinveyBaseUrl="https://baas.kinvey.com/";
const kinveyAppKey='kid_BkMo-LOzg';
const kinveyAppSecret='62ce0b7f58eb4243ab649563bb94f958';
const kinveyAppAuthHeaders={
    'Authorization':'Basic '+
    btoa(kinveyAppKey+":"+kinveyAppSecret)
};

function startApp() {
    //$('#menu').find('a').css('display', 'none');

    sessionStorage.clear();

    //navigation start
    showHideMenuLinks();
    showView('viewHome');

    //Bind the navigation menu links
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListPosts').click(listPosts);
    $('#linkCreatePost').click(showCreatePostView);
    $('#linkLogout').click(logoutUser);

    //navigation ends
    //functionality starts here
    $('#buttonLoginUser').click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $("#buttonCreatePost").click(createPost);
    $("#buttonEditPost").click(editPost);
}

function showHideMenuLinks() {
    $('#linkHome').show();
    if (sessionStorage.getItem('authToken')) {
        //We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListPosts").show();
        $('#linkListPosts').css('display', 'block');
        $("#linkCreatePost").show();
        $('#linkCreatePost').css('display', 'block');
        $("#linkLogout").show();
        $('#linkLogout').css('display', 'block');
        $('#viewLogin').hide();
        $('#viewRegister').hide();
        $('#viewPosts').show();
        $('#viewCreatePost').show();
    } else {
        //No logged in user
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListPosts").hide();
        $("#linkCreatePost").hide();
        $("#linkLogout").hide();
        $('#viewLogin').show();
        $('#viewRegister').show();
        $('#viewPosts').hide();
        $('#viewCreatePost').hide();
    }
}

function showView(viewName) {
    //Hide all views and show the selected view only
    $('main>section').hide();
    $('#' + viewName).show();
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset')
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showCreatePostView() {
    $('#formCreatePost').trigger('reset');
    showView('viewCreatePost');
}

function showInfo(message) {
    //used for printing messages on the screen
    $('#infoBox').text(message);
    $('#infoBox').show();

    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000);
}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();

    setTimeout(function () {
        $('#errorBox').fadeOut()
    }, 3000);
}

function registerUser() {
    let username = $('#formRegister input[name=username]');
    let password = $('#formRegister input[name=passwd]');
    let passwordConfirm = $('#formRegister input[name=passwd-confirm]');

    $('#pass-match').remove();
    username.css('border', 'none');
    password.css('border', 'none');
    passwordConfirm.css('border', 'none');

    if(password.val() != passwordConfirm.val()){

        $('#reg-btn').append(`<p id="pass-match">The passwords don't match!</p>`);

        (e) => e.preventDefault();
        return false;
    }
    else if(username.val() == "" || password.val() == "" || passwordConfirm.val() == ""){
        if(username.val() == ""){
            username.attr('required', 'true');
            username.css('border', '1px solid #ef1717');
        }

        if(password.val() == ""){
            password.attr('required', 'true');
            password.css('border', '1px solid #ef1717');
        }

        if(passwordConfirm.val() == "") {
            passwordConfirm.attr('required', 'true');
            passwordConfirm.css('border', '1px solid #ef1717');
        }

        (e) => e.preventDefault();
        return false;
    }

    let registerData = {
        username: username.val(),
        password: password.val()

    };

    let pattern = /^[A-za-z0-9]+$/g;
    let testPattern = new RegExp(pattern);
    let trueOrFalse = testPattern.test(registerData.username);

    if(trueOrFalse==false) {
        showValidationError("username", "Username may only contain letters and digits");
    }

    else if(registerData.username.length>=20){
        showValidationError("username", "Username is too long.");
    }

    else if(registerData.password.length>=20){
        showValidationError("passwd", "Password is too long.")
    }

    else {
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: kinveyAppAuthHeaders,
            data: registerData,
            success: registerSuccess,
            error: handleAjaxError
        });
    }

    function registerSuccess(userInfo){
        showView('viewHome');
        showInfo('Register was successful');
        sessionStorage.setItem("username", userInfo.username);
        sessionStorage.setItem("authToken", userInfo._kmd.authtoken);

        username.val('');
        password.val('');
        passwordConfirm.val('');

        showHideMenuLinks(); // refreshesh the links after the sessison change
        showView('viewHome');
    }
}

function loginUser(){
    let username = $('#formLogin input[name=username]');
    let password = $('#formLogin input[name=passwd]');

    username.css('border', 'none');
    password.css('border', 'none');

    if(username.val() == "" || password.val() == ""){
        if(username.val() == ""){
            username.attr('required', 'true');
            username.css('border', '1px solid #ef1717');
        }

        if(password.val() == ""){
            password.attr('required', 'true');
            password.css('border', '1px solid #ef1717');
        }

        (e) => e.preventDefault();
        return false;
    }

    let loginData = {
        username: username.val(),
        password: password.val()
    };

    if(loginData.username.length>=20){
        showValidationError("username", "Username is too long.");
    }

    if(loginData.password.length>=20){
        showValidationError("passwd", "Password is too long.");
    }

    else {
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: loginData,

            success: loginSuccess,
            error: handleAjaxError

        });
    }

    function loginSuccess(userInfo){
        
        showInfo('Login was successful');

        sessionStorage.setItem("username", userInfo.username);
        sessionStorage.setItem("authToken", userInfo._kmd.authtoken);

        username.val('');
        password.val('');

        showHideMenuLinks(); // refreshesh the links after the sessison change
        showView('viewHome');
    }
}

function logoutUser() {
    sessionStorage.clear();
    showHideMenuLinks();
    showView('homeView');
    showInfo('You have logged out.');
}



function createPost() {
    const kinveyAuthHeaders={
        'Authorization':"Kinvey "+sessionStorage.getItem('authToken')
    }
    const kinveyUserUrl=`${kinveyBaseUrl}user/${kinveyAppKey}/${sessionStorage.getItem('userId')}`


        let advertData={
            title: $('#formCreatePost input[name=title]').val(),
            contentPost: $('#formCreatePost textarea[name=contentPost]').val(),
            datePublished: $('#formCreatePost input[name=datePublished]').val(),
            image:$('#formCreatePost input[name=image]').val()
        }
        const kinveyAdvertsUrl=kinveyBaseUrl+"appdata/"+kinveyAppKey+"/posts"
        $.ajax({
            method:"POST",
            url:kinveyAdvertsUrl,
            headers:kinveyAuthHeaders,
            data:advertData,
            success:createPostSusscess,
            error:handleAjaxError
        })
        function createPostSusscess(respons       ) {
            listPosts()
            showInfo('Post created.')
        }

}


function editPost() {

}
function listPosts() {
    
}

function handleAjaxError(response) {
    // returns descriptions of an error(from Kinvey) as text
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";

    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;

    showError(errorMsg);
}

function showValidationError(fieldName, errorMsg) {
    let field = $("input[name='" + fieldName + "'], textarea[name='" + fieldName + "']");
    field.after(
        $("<div class='validation-error'>").text(errorMsg)
    );

    setTimeout(function () {
        $('.validation-error').fadeOut();
    }, 3000);

    field.focus();
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization ': 'Kinvey ' + sessionStorage.getItem('authToken')
    };
}