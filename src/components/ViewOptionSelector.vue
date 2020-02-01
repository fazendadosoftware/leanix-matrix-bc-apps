<template>
  <div class="flex items-center p-1">
    <dropdown :label="`${translatedFactSheetType} view`" :options="viewOptions" :selected="viewOption" @input="viewOption = $event" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Dropdown from '@/components/Dropdown'
export default {
  props: {
    factSheetType: {
      type: String,
      required: true
    }
  },
  components: { Dropdown },
  methods: {
    ...mapMutations(['setViewKey'])
  },
  computed: {
    ...mapGetters(['getViewOptions', 'getViewKey', 'reportSetup']),
    translatedFactSheetType () {
      const translatedFactSheetType = (((((this.reportSetup || {}).settings || {}).translations || {}).factSheetTypes) || {})[this.factSheetType + '.plural']
      return translatedFactSheetType
    },
    viewOptions () {
      const categoryOrder = ['FIELD', 'FIELD_RELATION', 'FIELD_TARGET_FS', 'TAG', 'BUILT_IN']
      const categoryLabels = {
        FIELD: 'FIELDS ON FACT SHEET',
        FIELD_RELATION: 'FIELDS ON RELATIONS',
        FIELD_TARGET_FS: 'FIELDS ON RELATED FACT SHEETS',
        TAG: 'TAGS',
        BUILT_IN: 'BUILT IN'
      }

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
          } else if (type === 'BUILT_IN') {
            const tlabel = this.$lx.translateCustomKey(key)
            console.log('BUILD IN', type, key, label, 'T', tlabel)
          } else {
            // console.log('UNTRALSNATE')
          }
          return { label, key, type }
        })
        .sort((optionA, optionB) => {
          const indexOfTypeA = categoryOrder.indexOf(optionA.type)
          const indexOfTypeB = categoryOrder.indexOf(optionB.type)
          return indexOfTypeA - indexOfTypeB
        })
        .reduce((accumulator, option, i, options) => {
          const { type } = option
          const previousType = accumulator.length ? accumulator[accumulator.length - 1].type : undefined
          if (type !== previousType) accumulator.push({ type, label: categoryLabels[type] || type, separator: true })
          accumulator.push(option)
          return accumulator
        }, [])
      return viewOptions
    },
    viewOption: {
      get () {
        const viewKey = this.getViewKey(this.factSheetType)
        const viewOption = this.viewOptions.find(({ key }) => key === viewKey) || {}
        return viewOption
      },
      set (value) {
        const { key } = value
        if (!key) return
        this.setViewKey({ factSheetType: this.factSheetType, viewKey: key === null ? undefined : key })
      }
    }
  }
}
</script>
