import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import Home from '../components/Home.vue'
import Auth from '../components/Authentication'
import UserAlbums from '../components/UserAlbums'
import UserPhotos from '../components/UserPhotos'
import UserPage from '../components/UserPage'
import PhotoPage from '../components/PhotoPage'
import ExplorePage from '../components/ExplorePage'

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
    path: '/user/:username',
    name: 'UserPage',
    component: UserPage,
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
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExplorePage
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
    return next(`/user/${store.state.user.username}/photos/all`);
  }

  if (to.path === '/' && loggedIn) {
    return next(`/user/${store.state.user.username}/photos/all`)
  }
  

  next();
})

export default router
