import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import Home from '../components/Home.vue'
import Auth from '../components/Authentication'
import Albums from '../components/Albums'
import UserPhotos from '../components/UserPhotos'
import Dashboard from '../components/Dashboard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Authentication',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'albums',
        name: 'Albums',
        component: Albums
      },
      {
        path: 'photos/:album',
        name: 'Photos',
        component: UserPhotos
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const publicPages = ['/auth'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = JSON.parse(localStorage.getItem('user'))
  if (loggedIn && !store.state.user.username) {
    store.dispatch('setUser', loggedIn)
  }

  if (authRequired && !loggedIn) {
    return next('/auth');
  }

  if (to.path === '/auth' && loggedIn) {
    return next('/albums');
  }

  if (to.path === '/') {
    return next('/albums')
  }
  

  next();
})

export default router
