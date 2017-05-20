import view from './view.html'
import $ from 'jquery'
import system from '~/system'


export default function () {
    $('#wrapper').html(view);
    $('#registerForm').submit(function(event){
        event.preventDefault();
        system.API.POST('/users',{payload:system.security.encrypt({})});
    });
    //build jquery to build form object, include validation of fields,
    //handle CORS so that the server can accept requests from other domains
}
