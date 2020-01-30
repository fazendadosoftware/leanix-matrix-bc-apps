<template>
  <div class="bg-yellow-500 mb-2 p-2">
    <button
      class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      @click="setShowQuarters(!showQuarters)">
      Show Quarters? {{showQuarters}}
    </button>
    <button
      class="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
      @click="toggleAllBusinessCapabilitiesChildren()">
      Toggle all Children?
    </button>
    <button
      class="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="fetchDataset()">
      Reload
    </button>
    <view-option-selector factSheetType="Application"/>
    <view-option-selector factSheetType="BusinessCapability"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ViewOptionSelector from '@/components/ViewOptionSelector'
export default {
  components: { ViewOptionSelector },
  methods: {
    ...mapActions(['fetchDataset']),
    ...mapMutations(['setShowQuarters']),
    toggleAllBusinessCapabilitiesChildren () {
      if (this.expandedBusinessCapabilities.length) this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length)
      else this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length, ...this.dataset.map(({ id }) => id))
    }
  },
  computed: {
    ...mapGetters(['showQuarters', 'expandedBusinessCapabilities', 'dataset'])
  }
}
</script>
