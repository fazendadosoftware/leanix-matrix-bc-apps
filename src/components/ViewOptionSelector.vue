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
    ...mapGetters(['getViewOptions', 'getViewKey', 'translations']),
    viewOptions () {
      const viewOptions = this.getViewOptions(this.factSheetType)
        .map(({ label, key, type }) => {
          if (type === 'FIELD') label = this.$lx.translateField(this.factSheetType, key)
          else if (type === 'FIELD_TARGET_FS') {
            let [ relName, targetFsType, targetField ] = key.split('.')
            relName = this.$lx.translateRelation(relName)
            targetField = this.$lx.translateField(targetFsType, targetField)
            label = `${relName}: ${targetField}`
          } else if (type === 'FIELD_RELATION') {
            let [ relName, relField ] = key.split('.')
            relName = this.$lx.translateRelation(relName)
            label = `${relName}: ${relField}`
          }
          return { label, key, type }
        })
      return viewOptions
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
