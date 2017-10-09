import view from './view.html'
import * as device from './device.js'
import css from './view.css'
import system from '~/system'
import postal from 'postal'

export default function () {
    

    let channel = postal.channel('authentication');
    //create system.authorization to decrypt token and check exp and int.
    let user = system.identity();
    
    let userArray=Object.values(user);
    //system.authorization(user) returns true if the decoded token has not expired
    if(userArray.length===0 || !(system.authorization(user)) ){
         window.location.hash='#';
    };
    let userEmail;
    $('#wrapper').html(view);
    //GET request for user
    system.API.GET(`/user/${user.id}`)
        //reload page if we can't do get request for the user
        .catch((err)=>{
            console.warn(err);
        })
        //then append accurate up to the minute user info
        .then((res)=>{
            userEmail = res.body.user.email;
            $('.username').append(`${res.body.user.username}`);
            $('.email').append(`${res.body.user.email}`);
        });
    system.API.GET(`/user/${user.id}/tessel`)
        //reload page if we can't do get request for devices
        .catch((err)=>{
            console.warn(err);
        })
        //then append devices
        .then( (res) => {
            if(res.body.devices.length > 0){
                $('#deviceWell').append(device.buildDevicesHTML(res.body.devices));
                $('#deviceWell').addClass("well well-md");
            } 
        });
    $('#addDeviceForm').submit(function(event){
        event.preventDefault();
        let deviceNameArray = $(this).serializeArray();
        let payload = {"deviceName": deviceNameArray[0].value};
        system.API.POST(`/user/${user.id}/tessel`, payload)
            .catch((err)=>{
                console.warn(err);
            })
            .then((res)=>{
                $('#deviceWell').html(device.buildDevicesHTML(res.body.user.devices));
                $('#deviceWell').addClass("well well-sm");
                this.reset();   
            });
    });

   $('body').on('click', '.delete-button-js', (event) => {
        let deviceClasses  = $(event.target).prop("classList");
        let deviceClass = deviceClasses[4];
        let deviceId = $(`span.device-id-js.${deviceClass}`).text();
        
        system.API.DELETE(`/user/${user.id}/tessel/${deviceId}`)
            .catch((err)=>{
                console.warn(err);
            })
            .then((res)=>{
                
                system.API.GET(`/user/${user.id}/tessel`)
                    //reload page if we can't do get request for devices
                    .catch((err)=>{
                        console.warn(err);
                    })
                    //then append devices
                    .then( (res) => {
                        $('#deviceWell').html(device.buildDevicesHTML(res.body.devices));
                        if(res.body.devices.length === 0){
                            $('#deviceWell').removeClass("well well-md");
                        } 
                    });
            }); 
    });
     
    $('body').on('click', '#delete-user-btn', () =>{
        system.API.DELETE(`/user/${user.id}`)
            .catch((err)=>{
                console.warn(err);
            })
            .then((res)=>{
                window.localStorage.removeItem(process.env.TOKEN);
                channel.publish('logout.successful');
                window.location.hash='#/login';
            }); 

    });
    $('body').on('click','#edit-email-btn', ()=>{
        $('#email-replace-js').html(
            "<form class='form-inline' id='email-form'>" +
                "<input name='email' type='email' class='form-control' id='email-input' placeholder='user@email.com'>" +
                "<button id='email-confirm' type='submit' class='btn btn-default'><span class='glyphicon glyphicon-ok'></span></button>" +
                "<button id='email-cancel' type='button' class='btn btn-default'><span class='glyphicon glyphicon-remove'></span></button>" +
            "</form>");
    });

    $('body').on('click','#email-cancel', ()=>{
        $('#email-replace-js').html(`<span class='email'>${userEmail}</span> <a role='button' id='edit-email-btn' class='btn btn-xs btn-default inline'><span id='glyphicon-email-btn-js' class='glyphicon glyphicon-pencil'></span></a>`);
    });

    $('body').on('submit','#email-form', (event)=>{
        event.preventDefault();
        let newEmailArray = $('#email-input').serializeArray();
        let payload = {"user": {"email":newEmailArray[0].value}};
        system.API.PUT(`/user/${user.id}`,payload)
            .catch((err)=>{
                console.warn(err);
            })
            .then((res)=>{
                system.API.GET(`/user/${user.id}`)
                    //reload page if we can't do get request for the user
                    .catch((err)=>{
                        console.warn(err);
                    })
                    //then append accurate up to the minute user info
                    .then((res)=>{
                        userEmail = res.body.user.email;
                        $('.username').html(`${res.body.user.username}`);
                        $('.email').html(`${res.body.user.email}`);
                        $( "#email-cancel" ).trigger( "click" );
                    });
            }); 
    });
};