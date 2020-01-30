<template>
  <div class="outer-container overflow-auto relative custom-scrollbar">
    <div class="inner-container grid" :style="gridContainerStyle">
      <template v-for="cell in cells">
        <pivot-cell v-if="cell.isPivotCell" :key="cell.id" :cell="cell"/>
        <year-header-cell v-if="cell.isHeader && cell.axis === 'x'" :key="cell.id" :cell="cell"/>
        <business-capability-header-cell v-if="cell.isHeader && cell.axis === 'y'" :key="cell.id" :cell="cell" :style="getComputedStyle(cell)"/>
        <div v-if="cell.isBusinessCapabilityEmptyHeader" :key="cell.id" class="bg-darkgray rounded border" :style="getComputedStyle(cell)"/>
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
  data: () => ({
    gridGapPx: 2,
    firstColumnWidthPx: 200,
    columnWidthPx: 200
  }),
  methods: {
    ...mapMutations(['setShowQuarters']),
    getComputedStyle (cell) {
      const { level, isBusinessCapabilityEmptyHeader } = cell
      if (level === 2 || isBusinessCapabilityEmptyHeader) {
        return `position: sticky;left:${this.columnWidthPx + this.gridGapPx}px`
      }
      return ''
    }
  },
  computed: {
    ...mapGetters(['years', 'cells', 'gridContainerStyle', 'showQuarters', 'columns', 'expandedBusinessCapabilities']),
    bcsDrilledDown () {
      return this.expandedBusinessCapabilities.length > 0
    },
    gridContainerStyle () {
      const columns = this.columns.length
      const width = `width: ${this.columnWidthPx + this.columnWidthPx * columns}px;`
      const style = `grid-gap:${this.gridGapPx}px;grid-template-columns: ${this.firstColumnWidthPx}px ${this.bcsDrilledDown ? `${this.firstColumnWidthPx}px` : ''}  ${columns ? `repeat(${columns}, ${this.columnWidthPx}px)` : ''}; ${width}`
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
