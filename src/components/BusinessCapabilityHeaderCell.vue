<template>
  <div
    class="sticky left-0 flex items-center bg-darkslategray text-white font-bold text-md p-1 rounded border"
    :style="`${cell.style};${style}`">
    <div
      v-if="Array.isArray(cell.children) && cell.children.length"
      class="cursor-pointer px-2" @click="toggleExpandedBusinessCapability">
      <font-awesome-icon class="transition-transform" icon="chevron-right" :class="isExpanded ? 'rotate-90' : ''"/>
    </div>
    <div class="truncate-4-lines cursor-pointer hover:underline" @click="openFactSheetPreview(cell)">{{cell.name}}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    cell: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['expandedBusinessCapabilities', 'businessCapabilityViewIndex']),
    isExpanded () {
      return this.expandedBusinessCapabilities.indexOf(this.cell.id) > -1
    },
    style () {
      const { id } = this.cell
      const legend = this.businessCapabilityViewIndex[id] || {}
      const { color, bgColor } = legend
      const style = !color && !bgColor ? undefined : `color: ${color}; background-color: ${bgColor};`
      return style
    }
  },
  methods: {
    ...mapActions(['openFactSheetPreview']),
    toggleExpandedBusinessCapability () {
      const index = this.expandedBusinessCapabilities.indexOf(this.cell.id)
      if (index === -1) this.expandedBusinessCapabilities.push(this.cell.id)
      else this.expandedBusinessCapabilities.splice(index, 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .transition-transform
    transition transform 0.2s ease-in-out
</style>
