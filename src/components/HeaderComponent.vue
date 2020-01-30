<template>
  <div class="bg-yellow-500 mb-2 p-2">
    <button
      class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      @click="setShowQuarters(!showQuarters)">
      Show Quarters? {{showQuarters}}
    </button>
    <button
      class="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="toggleAllBusinessCapabilitiesChildren()">
      Toggle all Children?
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setShowQuarters']),
    toggleAllBusinessCapabilitiesChildren () {
      if (this.expandedBusinessCapabilities.length) this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length)
      else this.expandedBusinessCapabilities.splice(0, this.expandedBusinessCapabilities.length, ...this.businessCapabilities.map(({ id }) => id))
    }
  },
  computed: {
    ...mapGetters(['showQuarters', 'expandedBusinessCapabilities', 'businessCapabilities'])
  }
}
</script>
