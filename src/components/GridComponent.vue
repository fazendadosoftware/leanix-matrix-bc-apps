<template>
  <div class="outer-container overflow-auto relative custom-scrollbar">
    <div class="grid" :style="gridContainerStyle">
      <template v-for="cell in cells">
        <pivot-cell v-if="cell.isPivotCell" :key="cell.id" />
        <year-header-cell v-if="cell.isHeader && cell.axis === 'x'" :key="cell.id" :cell="cell"/>
        <business-capability-header-cell v-if="cell.isHeader && cell.axis === 'y'" :key="cell.id" :cell="cell"/>
        <applications-cell v-if="cell.isContent" :key="cell.id" :cell="cell"/>
      </template>
    </div>
  </div>
</template>

<script>
import PivotCell from '@/components/PivotCell'
import YearHeaderCell from '@/components/YearHeaderCell'
import BusinessCapabilityHeaderCell from '@/components/BusinessCapabilityHeaderCell'
import ApplicationsCell from '@/components/ApplicationsCell'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PivotCell,
    YearHeaderCell,
    BusinessCapabilityHeaderCell,
    ApplicationsCell
  },
  methods: {
    ...mapMutations(['setShowQuarters'])
  },
  computed: {
    ...mapGetters(['years', 'cells', 'gridContainerStyle', 'showQuarters', 'columns']),
    gridContainerStyle () {
      const firstColumnWidth = 200
      const columnWidth = 200
      const columns = this.columns.length
      const width = `width: ${columnWidth + 200 * columns}px;`
      const style = `grid-template-columns: ${firstColumnWidth}px ${columns ? `repeat(${columns}, ${columnWidth}px)` : ''}; ${width}`
      return style
    }
  },
  mounted () {
    setTimeout(() => {
      const { top } = this.$el.getBoundingClientRect()
      this.top = top
    }, 100)
  }
}
</script>
