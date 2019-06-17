import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import Main from 'components/main/main'
import SingerDetail from 'components/singerDetail/singerDetail'
import SingerIndex from 'components/singer/index'
Vue.use(Router)
export default new Router({
  routes: [
    {path: '/', redirect: '/main'},
    {path: '/main',
      component: Main,
      children: [
        {path: '', redirect: 'recommend'},
        {
          path: 'recommend', component: Recommend
        },
        {
          path: 'singerIndex',
          component: SingerIndex,
          children: [
            {
              path: '',
              redirect: 'singer'
            },
            {
              path: 'singer',
              component: Singer
            },
            {
              path: ':id',
              component: SingerDetail
            }
          ]
        },
        {
          path: 'rank', component: Rank
        },
        {
          path: 'search', component: Search
        }]
    }
  ]
})

