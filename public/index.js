import {Router} from 'director/build/director';

import main from  './main';
import about from './about';
import account from './account';
import components from './components';
import css from './index.css'

const routes = {

    '/': main,
    '/about': about,
    '/account': account 
};

const router = new Router (routes);
router.init('#/');


components.navbar();

