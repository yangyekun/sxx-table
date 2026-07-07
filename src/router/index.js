import {createRouter, createWebHashHistory} from 'vue-router';
import Khzdlxsl from '../views/khzdlxsl/index.vue';
import Tbqxyl from '../views/tbqxyl/index.vue';
import Zdsltj from '../views/zdsltj/index.vue';
import Zrzxs from '../views/zrzxs/index.vue';
import Zdycbb from '../views/zdycbb/index.vue';
import Cwgdczl from '../views/cwgdczl/index.vue';
import Xqzdgztz from '../views/xqzdgztz/index.vue';
import Lookxqzdgztz from '../views/lookxqzdgztz/index.vue';
import Dzxskctzsw from '../views/dzxskctzsw/index.vue';
import Ycsjyctb from '../views/ycsjyctb/index.vue';
import Ylszyb from '../views/ylszyb/index.vue';
// 逐日蓄水量
import Zrxsl from '../views/zrxsl/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/khzdlxsl', name: 'khzdlxsl',component: Khzdlxsl },
    { path: '/dzxskctzsw', name: 'dzxskctzsw',component: Dzxskctzsw },
    { path: '/tbqxyl', name: 'tbqxyl',component: Tbqxyl },
    { path: '/zdsltj', name: 'zdsltj',component: Zdsltj },
    { path: '/zrzxs', name: 'zrzxs',component: Zrzxs },
    { path: '/zdycbb', name: 'zdycbb',component: Zdycbb },
    { path: '/cwgdczl', name: 'cwgdczl',component: Cwgdczl },
    { path: '/xqzdgztz', name: 'xqzdgztz',component: Xqzdgztz },
    { path: '/ycsjyctb', name: 'ycsjyctb',component: Ycsjyctb },
    { path: '/ylzyb', name: 'ylzyb',component: Ylszyb },
    { path: '/zrxsl', name: 'zrxsl',component: Zrxsl },
    { path: '/lookxqzdgztz', name: 'lookxqzdgztz',component: Lookxqzdgztz },
    { path: '/', name: 'root', redirect: '/tbqxyl' },
    { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/tbqxyl' }
  ]
});

export default router;
