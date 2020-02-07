<template>
  <div class="flex items-center">
    <div
      v-for="legendItem in legendItems"
      :key="legendItem.id"
      class="flex flex-0 items-center mr-8"
     >
      <div class="circle mr-2" :style="getComputedStyle(legendItem)"/>
      <div>{{legendItem.value === '__missing__' ? 'N/A' : legendItem.value}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    factSheetType: {
      type: String,
      required: true
    }
  },
  methods: {
    getComputedStyle (legendItem) {
      const { bgColor, color } = legendItem
      let style = `color: ${color}; background-color: ${bgColor};`
      if (bgColor === '#ffffff') style += 'border: 1px solid #ccc'
      return style
    }
  },
  computed: {
    ...mapGetters(['reportSetup', 'getViewKey', 'getViewOptions', 'getLegendIndex']),
    viewOption () {
      const viewKey = this.getViewKey(this.factSheetType)
      const viewOption = this.getViewOptions(this.factSheetType).find(({ key }) => key === viewKey) || {}
      return viewOption
    },
    legendItems () {
      const legendItems = Object.values(this.getLegendIndex(this.factSheetType))
        .filter(({ value }) => value !== 'HIDDEN_IN_MATRIX')
        .map(item => {
          const { key, type } = this.viewOption
          let { value } = item
          if (type === 'FIELD') {
            value = this.$lx.translateFieldValue(this.factSheetType, key, value)
          } else if (type === 'FIELD_TARGET_FS') {
            // eslint-disable-next-line
            const [relName, targetFsType, field] = key.split('.')
            value = this.$lx.translateFieldValue(targetFsType, field, value)
          }
          return { ...item, value }
        })
        .sort((itemA, itemB) => itemA.id - itemB.id)
      return legendItems
    }
  }
}
</script>

<style lang="stylus" scoped>
.circle
  width 20px
  height 20px
  border-radius 10px
</style>
