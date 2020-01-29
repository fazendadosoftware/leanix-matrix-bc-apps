<template>
  <div id="app">
    <header-component v-if="false"/>
    <grid-component />
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
