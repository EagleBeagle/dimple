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
import GenericErrorPage from '../components/GenericErrorPage'
import NotFoundErrorPage from '../components/NotFoundErrorPage'
import ConfirmUser from '../components/ConfirmUser'
import ForgotPassword from '../components/ForgotPassword'
import ResetPassword from '../components/ResetPassword'
import AdminPage from '../components/AdminPage'

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
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/user/resetpassword/:resetPasswordToken',
    name: 'ResetPassword',
    component: ResetPassword
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
    path: '/user/confirm/:confirmationToken',
    name: 'Confirm',
    component: ConfirmUser
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExplorePage
  },
  {
    path: '/error',
    name: 'GenericError',
    component: GenericErrorPage
  },
  {
    path: '/notfounderror',
    name: 'ContentNotFoundError',
    component: NotFoundErrorPage
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage
  },
  {
    path: '*',
    name: 'PageNotFoundError',
    component: NotFoundErrorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['Authentication', 'Confirm', 'ForgotPassword', 'ResetPassword'];
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = JSON.parse(localStorage.getItem('user'))
  if (loggedIn && !store.state.user.username) {
    store.dispatch('setUser', loggedIn)
  }

  if (!loggedIn) {
    store.dispatch('unsetUser')
  }

  if (authRequired && !loggedIn) {
    console.log('itt')
    return next('/auth');
  }

  if (to.path === '/auth' && loggedIn) {
    return next(`/explore`);
  }

  if (to.path === '/' && loggedIn) {
    return next(`/explore`)
  }
  
  store.dispatch('setErrorHappening', false)
  next();
})

export default router
