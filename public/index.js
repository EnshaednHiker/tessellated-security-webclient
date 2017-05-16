import {Router} from 'director/build/director';

import login from './login';
import main from  './main';

const routes = {
    '/login': login,
    '/': main
};

const router = new Router (routes);
router.init('#/');