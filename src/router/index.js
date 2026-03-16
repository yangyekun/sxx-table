import {createRouter, createWebHashHistory} from 'vue-router';
import Khzdlxsl from '../views/khzdlxsl/index.vue';
import Tbqxyl from '../views/tbqxyl/index.vue';
import Zdsltj from '../views/zdsltj/index.vue';
import Zrzxs from '../views/zrzxs/index.vue';
import Zdycbb from '../views/zdycbb/index.vue';
import Cwgdczl from '../views/cwgdczl/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/khzdlxsl', name: 'khzdlxsl',component: Khzdlxsl },
    { path: '/tbqxyl', name: 'tbqxyl',component: Tbqxyl },
    { path: '/zdsltj', name: 'zdsltj',component: Zdsltj },
    { path: '/zrzxs', name: 'zrzxs',component: Zrzxs },
    { path: '/zdycbb', name: 'zdycbb',component: Zdycbb },
    { path: '/cwgdczl', name: 'cwgdczl',component: Cwgdczl },
    { path: '/', name: 'root', redirect: '/tbqxyl' },
    { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/tbqxyl' }
  ]
});

export default router;
