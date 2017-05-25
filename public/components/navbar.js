import system from '~/system'

export default function () {
 
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });

    let user = system.identity();

    let userArray=Object.values(user);

    if(system.authorization(user)){
        $('#login-li').replaceWith('<li id="logout-li"><a href="#login" id="logout" role="button">Logout</a></li>');
        $('#account-navbar').removeClass('hidden');
    }
    if(!(system.authorization(user))){
        $('#logout-li').replaceWith('<li id="login-li"><a id="login" href="#login">Login</a></li>');
        $('#account-navbar').addClass('hidden');
    };

    $('#logout').click(function(e){
        window.localStorage.removeItem(process.env.TOKEN);
    });
}

