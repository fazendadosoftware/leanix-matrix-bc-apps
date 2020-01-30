<template>
  <div class="flex items-center mt-4 p-1" style="width: 500px">
    {{factSheetType}}
    <v-select
      class="ml-2 flex-1 bg-white"
      :clearable="true"
      :options="viewOptions"
      :reduce="item => item.key"
      v-model="viewOption"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    factSheetType: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapMutations(['setViewKey'])
  },
  computed: {
    ...mapGetters(['getViewOptions', 'getViewKey']),
    viewOptions () {
      return this.getViewOptions(this.factSheetType)
    },
    viewOption: {
      get () {
        return this.getViewKey(this.factSheetType)
      },
      set (key) {
        this.setViewKey({ factSheetType: this.factSheetType, viewKey: key === null ? undefined : key })
      }
    }
  }
}
</script>
