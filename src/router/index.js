import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import(/* webpackChunkName: "about" */ '../views/Calendar.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/instances',
    name: 'instances',
    component: () => import(/* webpackChunkName: "about" */ '../views/Instances.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/materials',
    name: 'materials',
    component: () => import(/* webpackChunkName: "about" */ '../views/Materials.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: () => import(/* webpackChunkName: "about" */ '../views/Bookings.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: () => import(/* webpackChunkName: "about" */ '../views/Rooms.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/events',
    name: 'events',
    component: () => import(/* webpackChunkName: "about" */ '../views/Events.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/notas',
    name: 'notas',
    component: () => import(/* webpackChunkName: "about" */ '../views/Notas.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import(/* webpackChunkName: "about" */ '../views/Groups.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue'),
    meta: {requireAuth: true, requireAdmin: true}
  },
  {
    path: '/intervals',
    name: 'intervals',
    component: () => import(/* webpackChunkName: "about" */ '../views/Intervals.vue'),
    meta: {requireAuth: true, requireAdmin: true}
  },
  {
    path: '/periods',
    name: 'periods',
    component: () => import(/* webpackChunkName: "about" */ '../views/Periods.vue'),
    meta: {requireAuth: true, requireAdmin: true}
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: () => import(/* webpackChunkName: "about" */ '../views/Subjects.vue'),
    meta: {requireAuth: true, requireAdmin: true}
  },
  {
    path: '/csvform',
    name: 'CSVForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/CSVForm.vue'),
    meta: {requireAuth: true, requireAdmin: true}
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const rutaProtegida = to.matched.some(record => record.meta.requireAuth);
  const rutaAdmin = to.matched.some(record => record.meta.requireAdmin);
  //console.log(store.state.usuarioDB.data.role);
  if(rutaProtegida && store.state.token === '') {
    next({name: 'login'})
  } else {
    if(rutaAdmin && store.state.usuarioDB.data.role != 'ADMIN'){
      next({name: 'login'})
    }else{
      next();
    }
  }

})

export default router
