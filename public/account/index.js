import view from './view.html'
import css from './view.css'
import $ from 'jquery'
import system from '~/system'

export default function () {
    let user = system.identity();
    let userArray=Object.values(user);
    if(userArray.length===0){
         window.location.hash='#/login';
    };
    $('#wrapper').html(view);
    //GET request
    $('.username').append(`${user.username}`)
    $('.email').append(`${user.email}`)
    system.API.GET(`/user/${user.id}/tessel`)
    //then append devices
    .then( (res) => {
        console.log(res);
    })
    
};