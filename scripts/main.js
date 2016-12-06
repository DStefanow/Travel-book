function startApp() {
    sessionStorage.clear();

    const kinveyBaseUrl="https://baas.kinvey.com/";
    const kinveyAppKey='kid_BkMo-LOzg';
    const kinveyAppSecret='62ce0b7f58eb4243ab649563bb94f958';


    const kinveyAppAuthHeaders={
        'Authorization':'Basic '+
        btoa(kinveyAppKey+":"+kinveyAppSecret)

    };
    let authTokenForUpload = "";
    function getSessionToken() {
        authTokenForUpload = sessionStorage.getItem('authToken');


    }


    $("#buttonCreatePost").click(function () {
        var file = $('#uploaded-file')[0].files[0];

        let metadata = {
            '_filename' : file.name,
            'size': file.size,
            'mimeType': file.type

        };
        upload(metadata, file);


    });

    function upload(data, file){
        let url = kinveyBaseUrl + "blob/" + kinveyAppKey;
        let requestHeaders = {
            'Authorization': 'Kinvey ' + authTokenForUpload,
            'Content-Type': 'application/json',
            'X-Kinvey-Content-Type': data.mimeType
        };
        $.ajax(
            {
                method:'POST',
                url: url,
                headers: requestHeaders,
                data: JSON.stringify(data),
                success: uploadSuccess,
                error: handleAjaxError

            }
        ); function uploadSuccess (success) {
            let innerHeaders=success._requiredHeaders;
            innerHeaders['Content-Type'] = file.type;
            let uploadURL = success._uploadURL;
            let id = success._id;
            $.ajax({
                    method: 'PUT',
                    url: uploadURL,
                    headers: innerHeaders,
                    processData: false,
                    data: file,
                    success: uploadPut,
                    error: handleAjaxError
                }
            );
            function uploadPut (){
                let uploadHeaders = {
                    'Authorization': 'Kinvey ' + authTokenForUpload,
                    'Content-Type': 'application/json'
                };
                $.ajax(
                    {
                        method: 'GET',
                        url: kinveyBaseUrl + 'blob/' + kinveyAppKey + '/' + id,
                        headers: uploadHeaders,
                        success: uploadReady,
                        error: handleAjaxError
                    }
                );
                function uploadReady(success) {
                    let imageURL = success._downloadURL;

                    const kinveyAuthHeaders={
                        'Authorization':"Kinvey "+sessionStorage.getItem('authToken')
                    }
                                       const kinveyUserUrl=`${kinveyBaseUrl}user/${kinveyAppKey}/${sessionStorage.getItem('userId')}`


                    let advertData={
                        title: $('#formCreatePost input[name=title]').val(),
                        contentPost: $('#formCreatePost textarea[name=contentPost]').val(),
                        datePublished: $('#formCreatePost input[name=datePublished]').val(),
                        image:imageURL
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
                    function createPostSusscess(respons) {
                        listPosts()
                        showInfo('Post created.')
                    }
                }
            }
        }


    }



//navigation start

    showHideMenuLinks();
    showView('viewHome');

//Bind the navigation menu links
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListPosts').click(listPosts);
    //  $('#linkUploadPhoto').click(uploadPhotoView);
    $('#linkCreatePost').click(showCreatePostView);
    $('#linkLogout').click(logoutUser);

    function showHideMenuLinks() {
        $('#linkHome').show();
        if (sessionStorage.getItem('authToken')) {
            //We have logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            // $("#linkUploadPhoto").show();
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
        $('main>section').hide();
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
    // function uploadPhotoView() {
    //     $('#formUploadPhoto').trigger('reset');
    //     showView('viewUploadPhoto')
    // }


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
   // $("#buttonCreatePost").click(createPost);
    $("#buttonEditPost").click(editPost);
    //  $("#buttonUploadPhoto").click(uploadPhoto);


function imageView() {
    showView('viewImage')
}


    function loginUser(){
        let loginData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()

        };


        if(loginData.username.length>=20){

            showValidationError("username", "Username is too long.");

        }
        if(loginData.password.length>=20){
            showValidationError("passwd", "Password is too long.")

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
            showView('viewPosts');
            showInfo('Login was successful');
            sessionStorage.setItem("username", userInfo.username);
            sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
            getSessionToken();
            showHideMenuLinks(); // refreshesh the links after the sessison change
        }

    }
    function listPosts() {

        let getKinveyUserAuthHeaders = {
            'Authorization': 'Kinvey ' + authTokenForUpload,
            'Content-Type': 'application/json'

        };
            $("#posts").empty()
            showView('viewPosts')

            $.ajax({
                method: 'GET',
                url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/posts',
                headers: getKinveyUserAuthHeaders,
                success: loadPostsSuccess,
                error: handleAjaxError
            })
            function loadPostsSuccess(posts) {
                showInfo('Posts loaded.')
                if (posts.length == 0) {
                    $('#posts').text('No posts.')
                } else {
                    let postsTable = $('<table>')
                        .append($('<tr>').append(
                            '<th>Title</th><th>Author</th>',
                            '<th>Description</th><th>Actions</th>'))
                    for (let post of posts)
                        appendPostRow(post, postsTable)
                    $('#posts').append(postsTable)
                }
            }

            function appendPostRow(post, postsTable) {
                let links = []

                let deleteLink = $('<a href="#">[Delete]</a>')
                    .click(function () {
                        deletePost(post._id)
                    })
               // let editLink = $('<a href="#">[Edit]</a>')
               //     .click(function () {
               //         loadPostForEditSuccess(post._id)
               //     }
                let imageLink = $('<a href="#">[Image]</a>')
                    .click(function () {
                        $('#imageForLink').attr('src', post.image);
                        imageView()
                    })

                links.push(deleteLink)
                links.push(" ")
               // links.push(editLink)
                links.push(" ")
                links.push(imageLink)
                let searchPic = new Image(100,100);
                $("#pic").attr("src", searchPic);
                postsTable.append($('<tr>').append(
                    $('<td>').text(post.title),
                    $('<td>').text(post.contentPost),
                    $('<td>').text(post.datePublished),
                $('<td>').append(links)

                ))



            }

    }
    //function uploadPhoto() {
    //
    // }

    function registerUser() {
        let registerData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()

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
        else if(registerData.username.length<4){

            showValidationError("username", "Username is too short.");

        }
        else if(registerData.password.length<4){
            showValidationError("passwd", "Password is too short.")

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
            showView('viewPosts');
            showInfo('Register was successful');
            sessionStorage.setItem("username", userInfo.username);
            sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
            showHideMenuLinks(); // refreshesh the links after the sessison change
        }

    }

    function editPost() {
        let postData = {
            title: $('#formEditPost input[name=title]').val(),
            description: $('#formEditPost textarea[name=description]').val(),
            datePublished: $('#formEditPost input[name=datePublished]').val(),

            image: $('#formEditPost input[name=image]').val()
        }
        $.ajax({
            method: "PUT",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey +
            "/posts/" + $('#formEditPost input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: postData,
            success: editPostSuccess,
            error: handleAjaxError
        });
        function editPostSuccess(response) {
            listPosts();
            showInfo('Post edited.');
        }
    }
    //function loadPostForEditSuccess(post) {
    //    $('#vieweditpost input[name=id]').val(post._id);
    //    $('#vieweditpost input[name=title]').val(post.title);
    //    $('#vieweditpost textarea[name=description]')
    //        .val(post.description);
    //    $('#vieweditpost input[name=datePublished]')
    //        .val(post.datePublished);
    //    $('#vieweditpost input[name=price]')
    //        .val(post.price);
    //    showView('viewEditAd');
    //}
    function deletePost(post) {
        function getKinveyUserAuthHeaders() {
            return{
                'Authorization':'Kinvey '+ sessionStorage.getItem('authToken')
            }
        }
        $.ajax({
            method: "DELETE",
            url:kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/posts/" + post,
            headers: getKinveyUserAuthHeaders(),
            success: deletePostSuccess,
            error: handleAjaxError

        })
        function deletePostSuccess(response) {
            listPosts()
            showInfo('Post deleted.')
        }


    }
    function logoutUser() {
        sessionStorage.clear();
        showInfo('You have logged out.');
        showHideMenuLinks();
        showView('viewHome');

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

}