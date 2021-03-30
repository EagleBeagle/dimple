import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import Home from '../components/Home.vue'
import Auth from '../components/Authentication'
import UserAlbums from '../components/UserAlbums'
import UserPhotos from '../components/UserPhotos'
import Dashboard from '../components/Dashboard'
import PhotoPage from '../components/PhotoPage'

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
    path: '/photos/:username/:id',
    name: 'Photo',
    component: PhotoPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'albums',
        name: 'UserAlbums',
        component: UserAlbums
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
    return next('/dashboard/photos');
  }

  if (to.path === '/') {
    return next('/dashboard/photos')
  }
  

  next();
})

export default router
