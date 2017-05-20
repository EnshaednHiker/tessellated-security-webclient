//file needs to serve as mediator between our API and the client
import request from 'superagent'; 
import security from '~/system/security';

export function GET () {
 
}

export function PUT () {
    
}

export function POST (url, data) {
    return new Promise (function(resolve, reject){
        Request('post',url)
            .send(data)
            .end(function(err,res){
                if (err){reject(err)}
                
                else{resolve(res)}
            })
    });
}

export function DELETE () {
    
}

function Request (action, url) {
    //convention I"m using is that the base URL has no trailing slash while the routes have a leading slash
    return request[action](process.env.API+url)
            .set('Content-Type','application/json')
            //save to local storage as a constant called token
            .set('Authorization',`Bearer ${window.localStorage.getItem('token')}`)
}

