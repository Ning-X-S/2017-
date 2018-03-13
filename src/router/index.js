import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../components/package/HelloWorld.vue'], resolve)
    },
    {
      path: 'one',
      component: resolve => require(['../components/package/One.vue'], resolve)
    }
  ]
})
