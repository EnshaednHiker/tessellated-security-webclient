import view from './view.html'
import $ from 'jquery'
import system from '~/system'
import css from './view.css'
import postal from 'postal'

export default function () {
    $('#wrapper').html(view);

    let channel = postal.channel('authentication');
   
    $('#registerForm').submit(function(event){
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
        
            
        system.API.POST('users',{"payload":payload})
            .then((res)=>{

                if(res.status===201){
                    return system.API.POST("users/login",{payload:payload})
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
                    console.warn(error);
                    if (error.response.status===500){
                        console.log(error.response)
                        let valError = JSON.parse(error.response.text);
                        console.log(valError);
                        validationError(valError,formArray);
                    }
            });
    });

    function validationError (error, form) {
        let errorKeys = Object.keys(error.errors);
        function hasEmail (element){
            return element === 'email';
        }
        function hasUsername (element){
            return element === 'username';
        }
        console.log(errorKeys);
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
    document.getElementById("registerConfirmPassword").addEventListener("keyup", function (){
        checkField('registerPassword','registerConfirmPassword', 'confirmMessagePass')
    });
    document.getElementById("registerConfirmEmail").addEventListener("keyup", function (){
        checkField('registerEmail','registerConfirmEmail', 'confirmMessageEmail')
    });
}
