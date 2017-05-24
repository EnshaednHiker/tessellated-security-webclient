import view from './view.html'
import * as device from './device.js'
import css from './view.css'
import system from '~/system'

export default function () {
    //create system.authorization to decrypt token and check exp and int.
    
    let user = system.identity();
    let userArray=Object.values(user);
    if(userArray.length===0){
         window.location.hash='#/login';
    };
    //system.authorization(user) returns true if the decoded token has not expired
    if(!(system.authorization(user))){
        window.location.hash='#/login';
    };
    $('#wrapper').html(view);
    //GET request for user
    system.API.GET(`/user/${user.id}`)
        //reload page if we can't do get request for the user
        .catch((err)=>{
            console.warn(err);
            window.location.reload();
        })
        //then append accurate up to the minute user info
        .then((res)=>{
            let user = system.security.decrypt(res.body.user.token);
            $('.username').append(`${user.username}`);
            $('.email').append(`${user.email}`);
        });
    system.API.GET(`/user/${user.id}/tessel`)
        //reload page if we can't do get request for devices
        .catch((err)=>{
            console.warn(err);
            window.location.reload();
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
                console.warn(err.response.text);
            })
            .then((res)=>{
                $('#deviceWell').html(device.buildDevicesHTML(res.body.user.devices));
                $('#deviceWell').addClass("well well-sm");
                this.reset();
            });
    });
    
    $('a.deleteDeviceJS').click(function(){
        console.log(this);
        //let device = system.security.decrypt(this);
        
        //system.API.DELETE(`/user/${user.id}/tessel/:tesselID`)
        

    });
};