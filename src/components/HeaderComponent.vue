<template>
  <div class="bg-yellow-500 mb-2 p-2">
    <button
      class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      @click="setShowQuarters(!showQuarters)">
      Show Quarters? {{showQuarters}}
    </button>
    <button
      class="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="setShowQuarters(!showQuarters)">
      Show Children? {{showQuarters}}
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setShowQuarters'])
  },
  computed: {
    ...mapGetters(['showQuarters'])
  }
}
</script>
