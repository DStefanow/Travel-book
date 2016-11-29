function startApp() {
    //sessionStorage.clear()

    const kinveyBaseUrl="https://baas.kinvey.com/"
    const kinveyAppKey='kid_HkEtOhDS'
    const kinveyAppSecret='ca6698894cca478cac51ac2d587ac31a'
    const kinveyAppAuthHeaders={
        'Authorization':'Basic '+
        btoa(kinveyAppKey+":"+kinveyAppSecret)
    }
//navigation start

    showHideMenuLinks();
    showView('viewHome')

//Bind the navigation menu links
    $('#linkHome').click(showHomeView)
    $('#linkLogin').click(showLoginView)
    $('#linkRegister').click(showRegisterView)
    $('#linkListPosts').click(listPosts)
    $('#linkCreatePost').click(showCreatePostView)
    $('#linkLogout').click(logoutUser)

    function showHideMenuLinks() {
        $('#linkHome').show()
        if (sessionStorage.getItem('authToken')) {
            //We have logged in user
            $("#linkLogin").hide()
            $("#linkRegister").hide()
            $("#linkListPosts").show()
            $("#linkCreatePost").show()
            $("#linkLogout").show()
        } else {
            //No logged in user
            $("#linkLogin").show()
            $("#linkRegister").show()
            $("#linkListPosts").hide()
            $("#linkCreatePost").hide()
            $("#linkLogout").hide()
        }
    }

    function showView(viewName) {
        //Hide all views and show the selected view only
        $('div>#navigation>div').hide()
        $('#' + viewName).show()
    }

    function showHomeView() {
        showView('viewHome')
    }

    function showLoginView() {
        showView('viewLogin')
        $('#formLogin').trigger('reset')
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset')
        showView('viewRegister')
    }

    function showCreatePostView() {
        $('#formCreatePost').trigger('reset')
        showView('viewCreatePost')
    }


    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response)
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error."
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description
        showError(errorMsg)
    }

    function showInfo(message) {
        $('#infoBox').text(message)
        $('#infoBox').show()
        setTimeout(function () {
            $('#infoBox').fadeOut()
        }, 3000)
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg)
        $('#errorBox').show()
        setTimeout(function () {
            $('#errorBox').fadeOut()
        }, 3000)
    }
    function listPosts() {
        
    }
    function logoutUser() {
        
    }

//navigation ends

}

