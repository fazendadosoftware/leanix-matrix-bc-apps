<template>
  <div class="flex items-center mr-3 mt-2 mb-6">
    <div class="flex-1 flex flex-col mr-8">
      <div class="flex items-center mb-2">
        <view-option-selector class="w-1/3" factSheetType="Application"/>
        <view-legend factSheetType="Application"/>
      </div>
      <div class="flex items-center">
        <view-option-selector class="w-1/3" factSheetType="BusinessCapability"/>
        <view-legend factSheetType="BusinessCapability"/>
      </div>
    </div>
    <leanix-button
      class="mr-1 rotate-icon"
      :label="`${!showQuarters ? 'Expand' : 'Collapse'} quarters`"
      :icon="showQuarters ? 'chevron-down' : 'chevron-right'"
      :action="setShowQuarters" :action-args="!showQuarters"/>
    <leanix-button
      class="mr-1"
      :label="`${shouldCollapseChildren ? 'Collapse' : 'Expand'} all children`"
      :icon="shouldCollapseChildren ? 'chevron-down' : 'chevron-right'"
      :action="toggleAllBusinessCapabilitiesChildren"/>
    <leanix-button icon="sync" :action="fetchDataset" :spin="loadingDataset"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ViewOptionSelector from '@/components/ViewOptionSelector'
import LeanixButton from '@/components/LeanixButton'
import ViewLegend from '@/components/ViewLegend'
export default {
  components: { ViewOptionSelector, LeanixButton, ViewLegend },
  methods: {
    ...mapActions(['fetchDataset']),
    ...mapMutations(['setShowQuarters']),
    toggleAllBusinessCapabilitiesChildren () {
      if (this.expandedBusinessCapabilities.length) this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length)
      else this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length, ...this.dataset.map(({ id }) => id))
    }
  },
  computed: {
    ...mapGetters(['showQuarters', 'expandedBusinessCapabilities', 'dataset', 'loadingDataset']),
    shouldCollapseChildren () {
      return this.expandedBusinessCapabilities.length > 0
    }
  }
}
</script>
