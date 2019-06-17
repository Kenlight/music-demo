<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots" @touchstart="goImg">
        <span class="dot" v-for="(item,index) in dots" :data-index="index"  :class="currentIndex ===index?'active':''"></span>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }

    },
    data() {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    created() {
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    // keep-alive 组件激活的时候调用
    activated() {
      this.currentIndex = this.slider.getCurrentPage().pageX === 5 ? 4 : this.slider.getCurrentPage().pageX
      if (this.autoPlay) {
        this._play()
      }
    },
    // keep-alive组件停用时调用。
    deactivated() {
      clearTimeout(this.time)
    },
    methods: {
      goImg(e) {
        clearTimeout(this.times)
        let index = parseInt(e.target.getAttribute('data-index'))
        this.slider.goToPage(index)
      },
      // 动态计算slidergroup宽度
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let sliderWidth = this.$refs.slider.clientWidth
        let width = 0
        for (let i = 0, len = this.children.length; i < len; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          // 无限循环前后多一个dom的宽度，所以总宽度 *2
          width += sliderWidth * 2
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化小圆点
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      // 配置beet-scroolc 轮播插件参数
      _initSlider() {
        this.slider = new BScroll('.slider', {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.1,
            speed: 400
          },
          click: true
        })
// beet-scrool实例下的scrollEnd时间，没个轮播完成后需要做的事情
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.times)
            // 每个轮播完成后需要重新调用_play()
            this._play()
          }
        })
      },
      _play() {
        let self = this
        this.times = setTimeout(function() {
          self.slider.next()
        }, this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.times)
    }
  }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position:relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
