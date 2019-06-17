<template>
    <scroll
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      :data="data"
      class="listview"
      ref="listview">
      <ul>
        <li v-for="group in data" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <uL>
            <li  @click="singerClick(item)" v-for="item in group.items" class="list-group-item">
              <img class="avatar" v-lazy="item.avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </uL>
        </li>
      </ul>
      <!--右部的快速入口-->
      <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li class="item" v-for='(item, index) in shortcutList'
              :data-index="index"
              :class="{'current':currentIndex===index}">{{item}}</li>
        </ul>
      </div>
      <div class="list-fixed" ref="fixed" v-show="fixedTitle">
        <div class="fixed-title">{{fixedTitle}}</div>
      </div>
    </scroll>
</template>

<script>
    import Scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/singer'

    const ANCHOR_HEIGHT = 18
    const DIFF_TITLE = 30
    export default {
      props: {
        data: {
          type: Array,
          default: []
        }
      },
      data() {
        return {
          scrollY: -1,
          currentIndex: 0,
          diff: -1
        }
      },
      created() {
        this.probeType = 3
        this.listenScroll = true
        this.touch = {}
        this.listHeight = []
      },
      computed: {
        shortcutList() {
          return this.data.map((list) => {
            return list.title.slice(0, 1)
          })
        },
        fixedTitle() {
          if (this.scrollY > 0) {
            return ''
          }
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
      },
      methods: {
        singerClick(item) {
          this.$emit('singerClick', item)
        },
        onShortcutTouchStart(e) {
          let cutIndex = getData(e.target, 'index')
          this.touch.y1 = e.touches[0].pageY
          this.touch.index = cutIndex
          this._scrollTo(cutIndex)
        },
        onShortcutTouchMove(e) {
          this.touch.y2 = e.touches[0].pageY
          let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
          let anchorIndex = delta + parseInt(this.touch.index)
          this._scrollTo(anchorIndex)
        },
        scroll(pos) {
          this.scrollY = pos.y
        },
        _calculateHeight() {
          let listGroup = this.$refs.listGroup
          let height = 0
          this.listHeight.push(height)
          for (let i = 0; i < listGroup.length; i++) {
            let item = listGroup[i]
            height += item.clientHeight
            this.listHeight.push(height)
          }
        },
        _scrollTo(index) {
          if (!index && index !== 0) {
            return
          }
          if (index < 0) {
            index = 0
          } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2
          }
          this.scrollY = this.listHeight[index]
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        }
      },
      watch: {
        data() {
          setTimeout(() => {
            this._calculateHeight()
          }, 20)
        },
        scrollY(newY) {
          const listHeight = this.listHeight
          // 当滚动到顶部，newY>0
          if (newY > 0) {
            this.currentIndex = 0
            return
          }
          // 在中间部分滚动
          for (let i = 0; i < listHeight.length - 1; i++) {
            let height1 = listHeight[i]
            let height2 = listHeight[i + 1]
            if (-newY >= height1 && -newY < height2) {
              this.currentIndex = i
              this.diff = height2 + newY
              return
            }
          }
          // 当滚动到底部，且-newY大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2
        },
        diff (newVal) {
          let fixedTop = (newVal > 0 && newVal < DIFF_TITLE) ? newVal - DIFF_TITLE : 0
          if (this.fixedTop === fixedTop) {
            return
          }
          this.fixedTop = fixedTop
          this.$refs.fixed.style.transform = `translate(0,${fixedTop}px)`
        }
      },
      components: {Scroll}
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
