<template>
  <div class="g-progress-bar">
    <div :class="barClass" :style="{
    'height': height,
    'width': '100%',
    'display': percent > 0 ? 'block' : 'none'
  }">
      <div class="progressbar bar bar1" style="width: 0%;"></div>
      <div class="bufferbar bar bar2" style="width: 100%;"></div>
      <div class="auxbar bar bar3" style="width: 0%;"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'g-progress-bar',
    data: () => ({
      percent: 0,
      show: false,
      canSuccess: true,
      speed: 15
    }),
    props: {
      height: {
        type: String,
        default: '4px',
      },
      isGlobal: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      barClass() {
        let classes = ['mdl-progress mdl-js-progress mdl-progress__indeterminate']
        if (!this.canSuccess) {
          classes.push('fail')
        }
        if (this.isGlobal) {
          classes.push('global')
        }
        return classes
      }
    },
    methods: {
      start() {
        this.show = true
        this.canSuccess = true
        if (this._timer) {
          clearInterval(this._timer)
          this.percent = 0
        }
        if (this._hideAppBootsrapLoader) {
          this._hideAppBootsrapLoader = false
        }
        this._timer = setInterval(() => {
          this.increase(this.speed * Math.random())
          if (this.percent > 95) {
            this.percent = 5
          }
        }, 100)
        return this
      },
      startOrContinue() {
        if (!this.show) {
          return this.start()
        } else {
          return this
        }
      },
      set(num) {
        this.show = true
        this.canSuccess = true
        this.percent = Math.floor(num)
        return this
      },
      get() {
        return Math.floor(this.percent)
      },
      increase(num) {
        this.percent = this.percent + Math.floor(num)
        if (this.percent < 5) {
          this.percent = 5
        }
        return this
      },
      decrease(num) {
        this.percent = this.percent - Math.floor(num)
        return this
      },
      finish() {
        this.percent = 100
        this._hideAppBootsrapLoader = true
        this.hide()
        return this
      },
      pause() {
        clearInterval(this._timer)
        return this
      },
      hide() {
        clearInterval(this._timer)
        this._timer = null
        setTimeout(() => {
          Vue.nextTick(() => {
            setTimeout(() => {
              this.percent = 0
              if (this._hideAppBootsrapLoader && document.getElementById('app-bootstrap')) {
                document.getElementById('app-bootstrap').style.display = 'none'
              }
              this.show = false
            }, 80)
          })
        }, 100)
        return this
      },
      fail() {
        this.canSuccess = false
        return this
      }
    }
  }
</script>

<style lang="scss">
  $blue: #276cda;

  .g-progress-bar {
    &.global {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      width: 0;
      transition: width 0.2s, opacity 0.4s;
      opacity: 1;
      background-color: $blue;
      z-index: 999999;
    }

    .mdl-progress {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      z-index: 10000;
    }

    .mdl-progress > .bar {
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 0;
      transition: width .2s cubic-bezier(.4, 0, .2, 1)
    }

    .mdl-progress > .progressbar {
      background-color: $blue;
      z-index: 1;
      left: 0
    }

    .mdl-progress > .bufferbar {
      background-image: linear-gradient(to right, rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), linear-gradient(to right, $blue, $blue);
      z-index: 0;
      left: 0
    }

    .mdl-progress > .auxbar {
      right: 0
    }

    @supports (-webkit-appearance:none) {
      .mdl-progress:not(.mdl-progress--indeterminate):not(.mdl-progress--indeterminate) > .auxbar, .mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate) > .auxbar {
        background-image: linear-gradient(to right, rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), linear-gradient(to right, $blue, $blue);
        mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=")
      }
    }

    .mdl-progress:not(.mdl-progress--indeterminate) > .auxbar, .mdl-progress:not(.mdl-progress__indeterminate) > .auxbar {
      background-image: linear-gradient(to right, rgba(255, 255, 255, .9), rgba(255, 255, 255, .9)), linear-gradient(to right, $blue, $blue)
    }

    .mdl-progress.mdl-progress--indeterminate > .bar1, .mdl-progress.mdl-progress__indeterminate > .bar1 {
      animation-name: indeterminate1
    }

    .mdl-progress.mdl-progress--indeterminate > .bar1, .mdl-progress.mdl-progress__indeterminate > .bar1, .mdl-progress.mdl-progress--indeterminate > .bar3, .mdl-progress.mdl-progress__indeterminate > .bar3 {
      background-color: $blue;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear
    }

    .mdl-progress.mdl-progress--indeterminate > .bar3, .mdl-progress.mdl-progress__indeterminate > .bar3 {
      background-image: none;
      animation-name: indeterminate2
    }

    @keyframes indeterminate1 {
      0% {
        left: 0%;
        width: 0%
      }
      50% {
        left: 25%;
        width: 75%
      }
      75% {
        left: 100%;
        width: 0%
      }
    }

    @keyframes indeterminate2 {
      0%, 50% {
        left: 0%;
        width: 0%
      }
      75% {
        left: 0%;
        width: 25%
      }
      100% {
        left: 100%;
        width: 0%
      }
    }

    .mdl-navigation {
      display: flex;
      flex-wrap: nowrap;
      box-sizing: border-box
    }

    .mdl-navigation__link {
      color: #424242;
      text-decoration: none;
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0;
      opacity: .87
    }

    .mdl-navigation__link .material-icons {
      vertical-align: middle
    }

    .mdl-layout {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      -webkit-overflow-scrolling: touch
    }

    .mdl-layout.is-small-screen .mdl-layout--large-screen-only {
      display: none
    }

    .mdl-layout:not(.is-small-screen) .mdl-layout--small-screen-only {
      display: none
    }

    .mdl-layout__container {
      position: absolute;
      width: 100%;
      height: 100%
    }

    .mdl-layout__title, .mdl-layout-title {
      display: block;
      position: relative;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-size: 20px;
      line-height: 1;
      letter-spacing: .02em;
      font-weight: 400;
      box-sizing: border-box
    }

    .mdl-layout-spacer {
      flex-grow: 1
    }

    .mdl-layout__drawer {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      width: 240px;
      height: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
      box-sizing: border-box;
      border-right: 1px solid #e0e0e0;
      background: #fafafa;
      transform: translateX(-250px);
      transform-style: preserve-3d;
      will-change: transform;
      transition-duration: .2s;
      transition-timing-function: cubic-bezier(.4, 0, .2, 1);
      transition-property: transform;
      color: #424242;
      overflow: visible;
      overflow-y: auto;
      z-index: 5
    }

    .mdl-layout__drawer.is-visible {
      transform: translateX(0)
    }

    .mdl-layout__drawer.is-visible ~ .mdl-layout__content.mdl-layout__content {
      overflow: hidden
    }

    .mdl-layout__drawer > * {
      flex-shrink: 0
    }

    .mdl-layout__drawer > .mdl-layout__title, .mdl-layout__drawer > .mdl-layout-title {
      line-height: 64px;
      padding-left: 40px
    }

    @media screen and (max-width: 1024px) {
      .mdl-layout__drawer > .mdl-layout__title, .mdl-layout__drawer > .mdl-layout-title {
        line-height: 56px;
        padding-left: 16px
      }
    }

    .mdl-layout__drawer .mdl-navigation {
      flex-direction: column;
      align-items: stretch;
      padding-top: 16px
    }

    .mdl-layout__drawer .mdl-navigation .mdl-navigation__link {
      display: block;
      flex-shrink: 0;
      padding: 16px 40px;
      margin: 0;
      color: #757575;
    }

    @media screen and (max-width: 1024px) {
      .mdl-layout__drawer .mdl-navigation .mdl-navigation__link {
        padding: 16px
      }
    }
  }
</style>
