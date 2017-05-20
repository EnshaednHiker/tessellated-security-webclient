import {Router} from 'director/build/director';

import login from './login';
import main from  './main';
import register from './register';
import about from './about';
import contact from './contact';
import account from './account';

const routes = {
    '/login': login,
    '/': main,
    '/register': register,
    '/contact': contact,
    '/about': about,
    '/account': account 
};

const router = new Router (routes);
router.init('#/');