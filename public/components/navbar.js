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

    let user = system.identity();
    let access = system.authorization(user);

    let channel = postal.channel();

    let navBarAuthorized = channel.subscribe('navbar.authorized',function(){
            $('#login-li').replaceWith('<li id="logout-li"><a href="#login" id="logout" role="button">Logout</a></li>');
            $('#account-navbar').removeClass('hidden');
        }).constraint(function(){
                return access === true;
        });
    channel.publish('navbar.authorized');

    let navBarNotAuthorized = channel.subscribe('navbar.notAuthorized',function(){
            $('#logout-li').replaceWith('<li id="login-li"><a id="login" href="#login">Login</a></li>');
            $('#account-navbar').addClass('hidden');
        }).constraint(function(){
            return access !== true;
        });
    channel.publish('navbar.notAuthorized');


    $('#logout').click(function(e){
        window.localStorage.removeItem(process.env.TOKEN);
        window.location.reload();
    });
}

