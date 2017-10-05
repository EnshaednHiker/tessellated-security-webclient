import system from '~/system'
import postal from 'postal'
import css from './navbar.css'

export default function () {

    //if any links in the navbar are clicked, the hamburger menu collapses back into hide mode
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
        
    });

    //this duplicative code reads the page on page load, when at the top, the navbar is rendered transparent
    if (window.scrollY < 1){
        $('#outermost-navbar').addClass('navbar-at-top');
    }
    else {
        $('#outermost-navbar').removeClass('navbar-at-top');
    }
    //while this block reads the page every time the page scrolls, handles rendering navbar transparency when at top and whether the hamburger button has been clicked
    $(document).scroll( () => {
        let boolean = $('#hamburger-button').hasClass('collapsed');
        if (window.scrollY < 1 && !boolean){
            $('#outermost-navbar').removeClass('navbar-at-top');
        }
        else if (window.scrollY < 1 && boolean) {
            $('#outermost-navbar').addClass('navbar-at-top');
        }
        else {
            $('#outermost-navbar').removeClass('navbar-at-top');
        }
    });

    $(document).on('click','#hamburger-button',function(e) {
        let boolean = $('#hamburger-button').hasClass('collapsed');
        if(window.scrollY < 1 && !boolean){
            $('#outermost-navbar').removeClass('navbar-at-top');
        }
        else if (window.scrollY < 1 && boolean ) {
            $('#outermost-navbar').addClass('navbar-at-top');
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

