function startApp() {
    sessionStorage.clear();

    const kinveyBaseUrl="https://baas.kinvey.com/";
    const kinveyAppKey='kid_BkMo-LOzg';
    const kinveyAppSecret='62ce0b7f58eb4243ab649563bb94f958';
    const kinveyAppAuthHeaders={
        'Authorization':'Basic '+
        btoa(kinveyAppKey+":"+kinveyAppSecret)
    };
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

    function showHideMenuLinks() {
        $('#linkHome').show();
        if (sessionStorage.getItem('authToken')) {
            //We have logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListPosts").show();
            $("#linkCreatePost").show();
            $("#linkLogout").show()
        } else {
            //No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListPosts").hide();
            $("#linkCreatePost").hide();
            $("#linkLogout").hide()
        }
    }

    function showView(viewName) {
        //Hide all views and show the selected view only
        $('div>#navigation>div').hide();
        $('#' + viewName).show()
    }

    function showHomeView() {
        showView('viewHome')
    }

    function showLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset')
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister')
    }

    function showCreatePostView() {
        $('#formCreatePost').trigger('reset');
        showView('viewCreatePost')
    }


    function handleAjaxError(response) {
    // returns descriptions of an error(from Kinvey) as text
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg)
    }

    function showInfo(message) {
        //used for printing messages on the screen
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut()
        }, 3000)
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
        setTimeout(function () {
            $('#errorBox').fadeOut()
        }, 3000)
    }
    

//navigation ends
//functionality starts here
    $('#buttonLoginUser').click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $("#buttonCreatePost").click(createPost);
    $("#buttonEditPost").click(editPost);





    function loginUser(){
        let loginData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
            // TODO : VALIDATIONS
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: loginData,

            success: loginSuccess,
            error: handleAjaxError

        });
        function loginSuccess(userInfo){
            showView('home');
            showInfo('Login was successful');
            sessionStorage.setItem("username", userInfo.username);
            sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
            showHideMenuLinks(); // refreshesh the links after the sessison change
        }

    }
    function listPosts() {

    }

    function registerUser() {
        let registerData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
            // TODO : VALIDATIONS
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: kinveyAppAuthHeaders,
            data: registerData,
            success: registerSuccess,
            error: handleAjaxError

        });
        function registerSuccess(userInfo){
            showView('home');
            showInfo('Register was successful');
            sessionStorage.setItem("username", userInfo.username);
            sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
            showHideMenuLinks(); // refreshesh the links after the sessison change
        }

    }
    function createPost() {
        
    }
    function editPost() {
        
    }
    function logoutUser() {
        sessionStorage.clear();
        showInfo('You have logged out.');
        showHideMenuLinks();
        showView('homeView');

    }
}


