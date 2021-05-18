import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/store'
import AuthenticationPage from '@/components/pages/AuthenticationPage'
import UserAlbums from '@/components/pages/UserPage/UserAlbums'
import UserPhotos from '@/components/pages/UserPage/UserPhotos'
import UserPage from '@/components/pages/UserPage'
import PhotoPage from '@/components/pages/PhotoPage'
import ExplorePage from '@/components/pages/ExplorePage'
import GenericErrorPage from '@/components/pages/GenericErrorPage'
import NotFoundErrorPage from '@/components/pages/NotFoundErrorPage'
import ConfirmUser from '@/components/ConfirmUser'
import ForgotPasswordPage from '@/components/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/components/pages/ResetPasswordPage'
import AdminPage from '@/components/pages/AdminPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Authentication',
    component: AuthenticationPage
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: ForgotPasswordPage
  },
  {
    path: '/user/resetpassword/:resetPasswordToken',
    name: 'ResetPassword',
    component: ResetPasswordPage
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
    redirect: '/user/:username/photos/all',
    children: [
      {
        path: 'albums',
        name: 'UserAlbums',
        component: UserAlbums
      },
      {
        path: 'people',
        name: 'UserPeople',
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
    return next('/auth');
  }

  if (to.path === '/auth' && loggedIn) {
    return next(`/explore`);
  }

  if (to.path === '/' && loggedIn) {
    return next(`/explore`)
  }

  if (to.name === 'UserPeople' && to.params.username !== store.state.user.username) {
    return next(`/user/${to.params.username}/photos/all`)
  }
  
  store.dispatch('setErrorHappening', false)
  next();
})

export default router
