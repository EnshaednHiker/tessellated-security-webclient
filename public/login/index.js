import view from './view.html'
import css from './view.css'
import system from '~/system'

export default function () {
    $('#wrapper').html(view);
    let user = system.identity();
    let userArray=Object.values(user);
    //system.authorization(user) returns true if the decoded token has not expired
    if(system.authorization(user)){
        window.location.hash='#/account';
    };
    $('#loginForm').submit(function(event){
        event.preventDefault();
        console.log($(this).serializeArray());
        let formArray = $(this).serializeArray();
        //build jquery to build form object, include validation of fields
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
                    console.log("err: ",err);
                    $("#errorSpan").append("Incorrect login, please enter the correct credentials");
                }
            })
            .then( (res)=>{
                
                console.log("res: ",res);
                //save the token to local storage
                window.localStorage.setItem(process.env.TOKEN, res.body.user.token);
                //redirect to meaningful page
                window.location.hash='#/account';
            })
    });
}