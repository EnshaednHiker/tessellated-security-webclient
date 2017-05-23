import system from '~/system'

export default function () {
    //dump this into a components folder in same level as public, navbar.js
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });

    let user = system.identity();
    let userArray=Object.values(user);
    if(userArray.length > 0){
         $('#navbar').append('<li><a id="logout" role="button">Logout</a></li>');
    };
}

