<template>
  <div id="app" class="overflow-y-hidden container mx-auto">
    <header-component/>
    <grid-component ref="grid" :style="`max-height: ${gridMaxHeight}px`"/>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent'
import GridComponent from '@/components/GridComponent'
export default {
  name: 'app',
  components: {
    HeaderComponent,
    GridComponent
  },
  data: () => ({
    gridMaxHeight: 0
  }),
  methods: {
    computeGridMaxHeight () {
      let gridMaxHeight = 0
      if (this.$refs.grid) {
        const { top } = this.$refs.grid.$el.getBoundingClientRect()
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        gridMaxHeight = vh - top
      }
      this.gridMaxHeight = gridMaxHeight
    }
  },
  mounted () {
    setTimeout(() => this.computeGridMaxHeight(), 100)
    window.addEventListener('resize', this.computeGridMaxHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.computeGridMaxHeight)
  }
}
</script>

<style lang="stylus">
body
  margin 0

#app
  font-family Axiforma, "Helvetica Neue", Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  font-size 12px

.custom-scrollbar
  &::-webkit-scrollbar-track
    -webkit-box-shadow inset 0 0 6px rgba(0,0,0,0.3)
    background-color grey-100
  &::-webkit-scrollbar
    width 0.5em
    height 0.5em
    background-color: transparent
  &::-webkit-scrollbar-thumb
    background-color #a9a9a9
    outline 1px solid #708090
</style>
