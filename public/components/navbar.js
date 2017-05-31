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
        $('#login-li').replaceWith('<li id="logout-li"><a id="logout-navbar"  role="button">Logout</a></li>');
        $('#account-navbar').removeClass('hidden');
    }
    function loggedOutDOM (){
        $('#logout-li').replaceWith('<li id="login-li"><a id="login-navbar" href="#login">Login</a></li>');
        $('#account-navbar').addClass('hidden');
    }
}

