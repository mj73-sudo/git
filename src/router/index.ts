// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';
import AppBar from '../components/AppBar.vue';
import Strategies from '../pages/Strategies.vue';
import { setupLayouts } from 'layouts-generated';
import CreatStrategy from '../pages/Creat-Strategy.vue';
import ListSignal from '../pages/ListSignal.vue';
import Responseback from '../pages/Responseback.vue';
import ListSymbol from '../pages/ListSymbol.vue';
import Chart from '../pages/Chart.vue';
import ShowMarket from '../pages/ShowMarket.vue';
import Dashboard from '../pages/Dashboard.vue';
import EditStrategy from "../pages/EditStrategy.vue";


const routes = [
  { path: '/login', component: Login , meta : { layout:'empty' } },
  { path: '/register', component: Register, meta : { layout:'empty' } },
  { path: '/strategies', component: Strategies } ,
  { path: '/creat-strategy', component: CreatStrategy } ,
  { path: '/listsignal', component: ListSignal } ,
  { path: '/responseback', component: Responseback } ,
  { path: '/listsymbol', component: ListSymbol } ,
  { path: '/showmarket', component: ShowMarket } ,
  { path: '/dashboard', component: Dashboard } ,
  { path: '/', component: Dashboard } ,
/*  { path: '/', redirect: '/login', meta : { layout:'empty' } },*/
  { path: '/chart/:id', name: 'ChartPage',component:Chart, props: true },
  { path: '/strategy/:id', name: 'Strategy',component:EditStrategy, props: true },
  { path:'/appbar',component: AppBar },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})


export default router
