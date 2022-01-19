import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _b812e7f8 = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _5462178e = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _37704962 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _6a35d7e2 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _22fd7e7d = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _cfb09b72 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _9ca15148 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _b812e7f8,
    children: [{
      path: "",
      component: _5462178e,
      name: "home"
    }, {
      path: "/login",
      component: _37704962,
      name: "login"
    }, {
      path: "/register",
      component: _37704962,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _6a35d7e2,
      name: "profile"
    }, {
      path: "/settings/",
      component: _22fd7e7d,
      name: "settings"
    }, {
      path: "/editor",
      component: _cfb09b72,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _9ca15148,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
