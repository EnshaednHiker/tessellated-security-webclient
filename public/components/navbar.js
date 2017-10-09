import system from '~/system'
import postal from 'postal'
import css from './navbar.css'
import SweetScroll from "sweet-scroll";

export default function () {

    const scrollOptions =
        {
            trigger: "[data-scroll]",       // Selector for trigger (must be a valid css selector)
            header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
            duration: 1000,                 // Specifies animation duration in integer
            delay: 0,                       // Specifies timer for delaying the execution of the scroll in milliseconds
            easing: "easeOutQuint",         // Specifies the pattern of easing
            offset: 0,                      // Specifies the value to offset the scroll position in pixels
            verticalScroll: true,           // Enable the vertical scroll
            horizontalScroll: false,        // Enable the horizontal scroll
            stopScroll: true,               // When fired wheel or touchstart events to stop scrolling
            updateURL: true,               // Update the URL hash on after scroll (true | false | "push" | "replace")
            preventDefault: true,           // Cancels the container element click event
            stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
            outputLog: false,               // Specify level of output to log
            quickMode: false,               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)
            
            // Callbacks
            beforeScroll: null,
            afterScroll: null,
            cancelScroll: null,
            completeScroll: null,
            stepScroll: null
        }

    document.addEventListener("DOMContentLoaded", () => {
        const sweetScroll = new SweetScroll(scrollOptions);
    }, false);
    
    
    //if any links in the navbar are clicked, the hamburger menu collapses back into hide mode
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }  
    });

    //this duplicative code reads the page on page load, when at the top, the navbar is rendered transparent
    if (window.scrollY < 1 && window.location.hash !== '#/account' || window.scrollY < 1 && window.location.hash !== '#account'){
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
        else if (window.scrollY < 1 && window.location.hash === '#/account' || window.scrollY < 1 && window.location.hash === '#account') {
            $('#outermost-navbar').removeClass('navbar-at-top');
        }
        else if (window.scrollY < 1 && boolean) {
            $('#outermost-navbar').addClass('navbar-at-top');
        }
        else {
            $('#outermost-navbar').removeClass('navbar-at-top');
        }
    });
    //add code to handle clicking nav links so that if any link but main ("#") is clicked,
    //class "navbar-at-top" is removed.

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
    }
    else{
        loggedOutDOM();
    }

    

    $('#logout-navbar').click(function(e){
        window.localStorage.removeItem(process.env.TOKEN);
        channel.publish('logout.successful');
        window.location.hash='#';
    });

    function isLoggedIn (){  
        return system.authorization(system.identity());
    }
    function loggedInDOM () {
        let user = system.identity();
        $('#login-navbar').addClass('hidden');
        $('#logout-navbar').removeClass('hidden');
        $('#account-navbar').removeClass('hidden');
        $('#user-account-span').html(user.username);
        
    }
    function loggedOutDOM (){
        $('#logout-navbar').addClass('hidden');
         $('#login-navbar').removeClass('hidden');
        $('#account-navbar').addClass('hidden');
    }
}

