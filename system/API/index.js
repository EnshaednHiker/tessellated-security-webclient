//file needs to serve as mediator between our API and the client
import request from 'superagent'; 
import security from '~/system/security';

export function GET (url, query) {
    return new Promise (function(resolve, reject){
        Request('get',url)
            .query(query || {})
            .end(function(err,res){
                if (err){reject(err)}
                
                else{
                    resolve(res);
                }
            })
    });
}

export function PUT (url,data) {
    return new Promise (function(resolve, reject){
        Request('put',url)
            .send(data)
            .end(function(err,res){
                if (err){reject(err)}
                
                else{
                    resolve(res);
                }
            })
    });      
}

export function POST (url, data) {
    return new Promise (function(resolve, reject){
        Request('post',url)
            .send(data)
            .end(function(err,res){
                if (err){reject(err)}
                
                else{
                    resolve(res);
                }
            })
    });
}

export function DELETE () {
    return new Promise (function(resolve, reject){
        Request('get',url)
            .query(query || {})
            .end(function(err,res){
                if (err){reject(err)}
                
                else{
                    resolve(res);
                }
            })
    });
}

function Request (action, url) {
    let token = window.localStorage.getItem(process.env.TOKEN);
    
    //convention I"m using is that the base URL has no trailing slash while the routes have a leading slash
    return request[action](process.env.API+url)
            .set('Content-Type','application/json')
            //save to local storage as a constant called token
            .set('Authorization',`Bearer ${token}`)
}


