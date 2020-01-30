<template>
  <div class="bg-yellow-500 mb-2">
     <button @click="setShowQuarters(!showQuarters)">Show Quarters ? {{showQuarters}}</button>
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
