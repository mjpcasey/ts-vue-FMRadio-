import Audio from '@/pages/fmRadio-zyh/FMAudio.vue';
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Audio',
      component: Audio,
    },
  ],
});
