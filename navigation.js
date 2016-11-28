function startApp() {


//navigation start

    showHideMenuLinks();
    showView('viewHome')

//Bind the navigation menu links
    $('#linkHome').click(showHomeView)
    $('#linkLogin').click(showLoginView)
    $('#linkRegister').click(showRegisterView)
    $('#linkListBooks').click(listBooks)
    $('#linkCreateBook').click(showCreateBookView)
    $('#linkLogout').click(logoutUser)

    function showHideMenuLinks() {
        $('#linkHome').show()
        if (sessionStorage.getItem('authToken')) {
            //We have logged in user
            $("#linkLogin").hide()
            $("#linkRegister").hide()
            $("#linkListBooks").show()
            $("#linkCreateBook").show()
            $("#linkLogout").show()
        } else {
            //No logged in user
            $("#linkLogin").show()
            $("#linkRegister").show()
            $("#linkListBooks").hide()
            $("#linkCreateBook").hide()
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

    function showCreateBookView() {
        $('#formCreateBook').trigger('reset')
        showView('viewCreateBook')
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
    function listBooks() {
        
    }
    function logoutUser() {
        
    }

//navigation ends
}