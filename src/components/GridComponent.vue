<template>
  <div class="outer-container" :style="outerContainerStyle">
    <div class="grid bg-red-300" :style="containerStyle">
      <template v-for="cell in cells">
        <pivot-cell v-if="cell.isPivotCell" :key="cell.id" />
        <year-header-cell v-if="cell.isHeader && cell.axis === 'x'" :key="cell.id" :cell="cell"/>
        <business-capability-header-cell v-if="cell.isHeader && cell.axis === 'y'" :key="cell.id" :cell="cell"/>
        <applications-cell v-if="cell.isContent" :key="cell.id" :cell="cell"/>
      </template>
    </div>
    <button @click="setShowQuarters(!showQuarters)">Show Quarters ? {{showQuarters}}</button>
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
    containerStyle () {
      const columns = this.columns.length
      const firstColumnWidth = '200px'
      const columnWidth = '200px'
      const style = `grid-template-columns: ${firstColumnWidth} ${columns ? `repeat(${columns}, ${columnWidth})` : ''};`
      return style
    },
    outerContainerStyle () {
      const columns = this.columns.length
      const columnWidth = 200
      return `width: ${columnWidth + 200 * columns}px;`
    }
  }
}
</script>
