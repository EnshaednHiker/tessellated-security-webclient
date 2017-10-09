import {Router} from 'director/build/director';

import login from './login';
import main from  './main';
import register from './register';
import about from './about';
import contact from './contact';
import account from './account';
import components from './components';
import css from './index.css'

const routes = {

    '/': main,
    '/contact': contact,
    '/about': about,
    '/account': account 
};

const router = new Router (routes);
router.init('#/');


components.navbar();

