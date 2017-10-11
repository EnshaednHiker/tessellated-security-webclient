import {Router} from 'director/build/director';

import main from  './main';
import about from './about';
import account from './account';
import components from './components';
import css from './index.css'
import bootstrapSocialCSS from '~/assets/styles/bootstrap-social.css';
import fontAwesome from '~/assets/styles/font-awesome.min.css';
// import backgroundPicXS from '~/assets/sleeping-city-sleep-night_extraSmall.jpeg'
// import backgroundPicSm from '~/assets/sleeping-city-sleep-night_small.jpeg'
// import backgroundPicMed from '~/assets/sleeping-city-sleep-night_medium.jpeg'
// import backgroundPicLg from '~/assets/sleeping-city-sleep-night_large.jpeg'
// import backgroundPicXL from '~/assets/sleeping-city-sleep-night_extraLarge.jpeg'

const routes = {

    '/': main,
    '/about': about,
    '/account': account 
};

const router = new Router (routes);
router.init('#/');


components.navbar();

