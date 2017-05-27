import view from './view.html'
import $ from 'jquery'
import system from '~/system'
import css from './view.css'

export default function () {
    $('#wrapper').html(view);
   
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
            
        system.API.POST('/users',{"payload":payload})
            .then( (data)=> {
                return system.API.POST("/users/login",{payload:payload})
            })
            .then( (res)=>{
                //save the token to local storage
                window.localStorage.setItem(process.env.TOKEN, res.body.user.token);
                //redirect to meaningful page
                window.location.hash='#/account';
            })
    });
    
    function checkField(stringFieldID1,stringFieldID2,stringMessageID){
        //Store the password field objects into variables ...
        let field1 = document.getElementById(stringFieldID1);
       
        let field2 = document.getElementById(stringFieldID2);
        
        //Store the Confimation Message Object ...
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
