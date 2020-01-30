<template>
  <div class="flex items-center mt-4 p-1" style="width: 300px">
    Application View
    <v-select
      class="ml-2 flex-1 bg-white"
      :clearable="false"
      :options="applicationViewOptions"
      v-model="viewOption"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setApplicationViewKey'])
  },
  computed: {
    ...mapGetters(['applicationViewOptions']),
    viewOption: {
      get () {
        return this.applicationViewKey
      },
      set ({ key } = {}) {
        if (!key) return
        this.setApplicationViewKey(key)
        console.log('SETTING VAL', key)
      }
    }
  }
}
</script>
