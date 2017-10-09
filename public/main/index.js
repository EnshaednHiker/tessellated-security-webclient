import tesselImg from '~/assets/tessel2.png'; 
import view from './view.html';
import css from './view.css';
import $ from 'jquery';
import system from '~/system';
import postal from 'postal';
import login from './login.html';
import register from './register.html';


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
    console.log(user);
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
        $('#input-div-row').html(login);
    });

    //listener to switch to register from login for
    $(document).on('click','#change-to-register', (e) => {
        $('#input-div-row').html(register);
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
            '<div class="index-homepage">'+
                '<h2><bold>Already logged in</bold></h2>'+
                `<p class="text-left">Welcome back, ${username}. `+ 'Visit your <a href="#/account">account</a> or <button class="button-link" id="logout-p-element">logout</button>.</p>'+
            '</div>'+
        '</div>';
    return markup
}

