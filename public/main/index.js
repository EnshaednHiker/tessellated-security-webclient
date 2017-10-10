import view from './view.html';
import css from './view.css';
import $ from 'jquery';
import system from '~/system';
import postal from 'postal';
import login from './login.html';




export default function () {

    let channel = postal.channel('authentication');

    let anotherChannel = postal.subscribe({
        channel: 'authentication',
        topic: 'logout.successful',
        callback: function () {
            $('#input-div-row').html(login);
        }
    });


    $('#wrapper').html(view);
    let user = system.identity();
    let userArray=Object.values(user);
    //system.authorization(user) returns true if the decoded token has not expired
    if(system.authorization(user)){
        let markup = loggedInMarkup(user.username)
        $('#input-div-row').html(markup);
    };

    //block handles submitting log in information to server
    $(document).on('submit','#loginForm', function(event){
        event.preventDefault();
        let formArray = $(this).serializeArray();
        //builds form object, include validation of fields
        let payload = system.security.encrypt(
                {
                  "user": {
                    "username": formArray[0].value,
                    "password": formArray[1].value
                  }
                }
            );
            
        system.API.POST('/users/login',{"payload":payload})
            .catch((err)=>{
                if(err){
                    if($("#errorSpan").text().length === 0){
                        $("#errorSpan").append("Incorrect login, please enter the correct credentials");
                    }
                }
            })
            .then( (res)=>{
                //save the token to local storage
                window.localStorage.setItem(process.env.TOKEN, res.body.user.token);
                //publish to event listener so the login condition is made known to the subscriber
                channel.publish('login.successful');
                //redirect to meaningful page
                window.location.hash='#/account';
                
            })
    });

    //block handles submitting info to server to add a new user account
    $(document).on('submit','#registerForm', function(event){
        event.preventDefault();
        
        let formArray = $(this).serializeArray();

        //build jquery to build form object, include validation of fields
        let payload = system.security.encrypt(
                {
                  "user": {
                    "username": formArray[0].value,
                    "email": formArray[1].value,
                    "password": formArray[3].value
                  }
                }
            );
        
            
        system.API.POST('/users',{"payload":payload})
            .then((res)=>{

                if(res.status===201){
                    return system.API.POST("/users/login",{payload:payload})
                        .then((res)=>{
                            //save the token to local storage
                            window.localStorage.setItem(process.env.TOKEN, res.body.user.token);
                            //publish to event listener so the login condition is made known to the subscriber
                            channel.publish('login.successful');
                            //redirect to meaningful page
                            window.location.hash='#/account';
                        })
                        .catch((err)=>{
                            console.warn(err);
                        });
                }
            })
            .catch((error)=>{
                    console.warn(error.response.text);
                    if (error.response.status===500){
                        
                        let valError = JSON.parse(error.response.text);
                    
                        validationError(valError,formArray);
                    }
            });
    });

    //block handles validation errors to make sure user doesn't mis-enter email or password and that the username hasn't already been taken
    function validationError (error, form) {
        let errorKeys = Object.keys(error.errors);
        function hasEmail (element){
            return element === 'email';
        }
        function hasUsername (element){
            return element === 'username';
        }
       
        if(errorKeys.find(hasEmail) && errorKeys.find(hasUsername)){
            $('#username-validation-error').html('That username has already being used in another account. Choose a different username.');
            $('#email-validation-error').html('That email address is already being used in another account. Choose a different email.');
            document.getElementById('registerForm').reset();
            $("#registerPassword").val(form[3].value);
            $("#registerConfirmPassword").val(form[4].value);
        }
        else if (errorKeys.find(hasUsername)){
            $('#username-validation-error').html('That username has already been chosen. Choose a different username.');
            document.getElementById('registerForm').reset();
            $("#registerEmail").val(form[1].value);
            $("#registerConfirmEmail").val(form[2].value);
            $("#registerPassword").val(form[3].value);
            $("#registerConfirmPassword").val(form[4].value);
        }
        else {
            $('#email-validation-error').html('That email address is already being used in another account. Choose a different email.');
            document.getElementById('registerForm').reset();
            $("#registerUsername").val(form[0].value);
            $("#registerPassword").val(form[3].value);
            $("#registerConfirmPassword").val(form[4].value);
        }
    } 
    
    function checkField(stringFieldID1,stringFieldID2,stringMessageID){
        //Store the password field objects into variables ...
        let field1 = document.getElementById(stringFieldID1);
       
        let field2 = document.getElementById(stringFieldID2);
        
        //Store the Confirmation Message Object ...
        let message = document.getElementById(stringMessageID);
        //Set the colors we will be using ...
        let goodColor = "#66cc66";
        let badColor = "#ff6666";
        //Compare the values in main field 
        //and the confirmation field
        if(field1.value === field2.value){

            //The fields match. 
            //Set the color to the good color and inform
            //the user that they have entered the correct field
            $('#submitButton').prop('disabled', false); 
            field2.style.backgroundColor = goodColor;
            message.style.color = goodColor;
            message.innerHTML = "Fields Match!"
        }
        else{
            //The fields do not match.
            //Set the color to the bad color and
            //notify the user.
            $('#submitButton').prop('disabled', true);
            field2.style.backgroundColor = badColor;
            message.style.color = badColor;
            message.innerHTML = "The confirm field does not match!";

        }    
    };
    
    $(document).on('keyup','#registerConfirmPassword', () => {
        checkField('registerPassword','registerConfirmPassword', 'confirmMessagePass');
    });

    $(document).on('keyup','#registerConfirmEmail', () => {
        checkField('registerEmail','registerConfirmEmail', 'confirmMessageEmail');
    });

    //listener to switch to login form from registration
    $(document).on('click','#change-to-login', (e) => {
        channel.publish('changed.to.login');
        $('#input-div-row').html(login);
    });

    //listener to switch to register from login for
    $(document).on('click','#change-to-register', (e) => {
        channel.publish('changed.to.register');
        let markup = registerMarkup();
        $('#input-div-row').html(markup);
    });

    $(document).on('click','#logout-p-element', function(e){
        window.localStorage.removeItem(process.env.TOKEN);
        channel.publish('logout.successful');
        //$('#input-div-row').html(login);
        window.location.hash='#';
    });
}

function loggedInMarkup(username) {
    let markup = 
        '<div class="input-div" id="logged-in">' + 
            '<div id="login-main" class="index-homepage">'+
                '<h2><bold>Already logged in</bold></h2>'+
                `<p class="text-left">Welcome back, ${username}. `+ 'Visit your <a href="#/account">account</a> or <button class="button-link" id="logout-p-element">logout</button>.</p>'+
            '</div>'+
        '</div>';
    return markup
}

function registerMarkup () {
    let markup = 
    "<div class='input-div' id='register-div'>"+    
    "<div class='index-homepage'>"+
      "<h2><bold>Register</bold></h2>"+
      "<p class='text-left'>Already have an account? Click <button class='button-link' id='change-to-login'>here</button> to log in. Otherwise, fill out the form to create an account.</p>"+
      "<form id='registerForm' action method='post'>"+
        "<div class='form-group text-left'>"+
          "<label for='username'>Username</label>"+
          "<input name='username' required type='verbatim' class='form-control' id='registerUsername' placeholder='Username'>"+
          "<span id='username-validation-error'></span>"+
        "</div>"+
        "<div class='form-group text-left'>"+
          "<label for='email'>Email</label>"+
          "<input required name='email' type='email' class='form-control' id='registerEmail' placeholder='Email'>"+
          "<span id='email-validation-error'></span>"+
        "</div>"+
        "<div class='form-group text-left'>"+
          "<label for='confirmEmail'>Confirm Email</label>"+
          "<input title='The Confirm Email field must be the same as the 'Email' field.' required name='confirmEmail' type='email' class='form-control' id='registerConfirmEmail' placeholder='Confirm Email'>"+
          "<span id='confirmMessageEmail' class='confirmMessage'></span>"+
        "</div>"+
        "<div class='form-group text-left'>"+
          "<label for='password'>Password</label>"+
          "<input required  name='password' type='password' class='form-control' id='registerPassword' placeholder='Password' >"+
        "</div>"+
        "<div class='form-group text-left'>"+
          "<label for='confirmPassword'>Confirm Password</label>"+
          "<input required title='The 'Confirm Password' field must be the same as the 'Password' field.' type='password' name='confirmPassword' class='form-control' id='registerConfirmPassword' placeholder='Confirm Password'>"+
          "<span id='confirmMessagePass' class='confirmMessage'></span>"+
        "</div>"+
        "<button id='submitButton' type='submit' class='btn btn-default'>Submit</button>"+
      "</form>"+
    "</div>"+
"</div>"

return markup
}