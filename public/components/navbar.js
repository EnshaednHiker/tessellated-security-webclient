import system from '~/system'
import postal from 'postal'

export default function () {

    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });
    
    $(document).click(function (event) {
        let clickover = $(event.target);
        let $navbar = $(".navbar-collapse");               
        let _opened = $navbar.hasClass("in");
        if (_opened === true && !clickover.hasClass("navbar-toggle")) {      
            $navbar.collapse('hide');
        }
    });

    let channel = postal.channel('authentication');

    channel.subscribe('login.successful',loggedInDOM).constraint(isLoggedIn);
    

    channel.subscribe('logout.successful',loggedOutDOM).constraint(()=>{
            return !isLoggedIn();
        });
    
    if(isLoggedIn()){
        loggedInDOM();
    }else{
        loggedOutDOM();
    }

    $('#logout-navbar').click(function(e){
        window.localStorage.removeItem(process.env.TOKEN);
        channel.publish('logout.successful');
        window.location.hash='#/login';
    });

    function isLoggedIn (){  
        return system.authorization(system.identity());
    }
    function loggedInDOM () {
        $('#login-navbar').addClass('hidden');
        $('#logout-navbar').removeClass('hidden');
        $('#account-navbar').removeClass('hidden');
        $('#register-navbar').addClass('hidden');
    }
    function loggedOutDOM (){
        $('#logout-navbar').addClass('hidden');
         $('#login-navbar').removeClass('hidden');
        $('#account-navbar').addClass('hidden');
        $('#register-navbar').removeClass('hidden');
    }
}

