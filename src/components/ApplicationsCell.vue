<template>
  <div class="border rounded bg-whitesmoke p-1">
    <div
      v-for="application in relatedApplications" :key="application.id"
      class="border bg-white p-1 rounded mb-1 last:mb-0 transition-background flex items-center justify-center leading-tight hover:underline"
      :style="getComputedStyle(application)">
      <div class="cursor-pointer truncate-4-lines text-center" @click="openFactSheetPreview(application)">
        {{application.name}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  props: {
    cell: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['openFactSheetPreview']),
    getComputedStyle (application) {
      const { id, lifecycle = {} } = application
      if (this.viewKey === 'lifecycle') {
        // default style should be N/A
        let style
        let { phases = [] } = lifecycle === null ? {} : lifecycle
        if (!phases.length) return style
        let { year, quarter } = this.cell
        const cellDate = moment().set('year', year)
        if (quarter !== null) cellDate.set('quarter', quarter)
        let cellStart = cellDate.startOf(quarter === null ? 'year' : 'quarter').format('YYYY-MM-DD')
        let cellEnd = cellDate.endOf(quarter === null ? 'year' : 'quarter').format('YYYY-MM-DD')

        phases.every(({ phase, startDate }) => {
          startDate = moment(startDate)
          if (startDate.isBefore(cellStart)) {
            const { color, bgColor } = this.lifecycleFieldMetadata[phase] || {}
            style = !color && !bgColor ? undefined : `color: ${color}; background-color: ${bgColor};`
          } else if (startDate.isBetween(cellStart, cellEnd)) {
            const { color, bgColor } = this.lifecycleFieldMetadata[phase] || {}
            style = !color && !bgColor ? undefined : `color: ${color}; background-color: ${bgColor};`
            return false
          }
          return true
        })
        return style
      } else {
        const legend = this.applicationViewIndex[id] || {}
        const { color, bgColor } = legend
        return !color && !bgColor ? undefined : `color: ${color}; background-color: ${bgColor};`
      }
    }
  },
  computed: {
    ...mapGetters(['businessCapabilityIndex', 'applicationViewIndex', 'getViewKey']),
    lifecycleFieldMetadata () {
      return (this.$lx.getFactSheetFieldMetaData('Application', 'lifecycle') || {}).values
    },
    viewKey () {
      return this.getViewKey('Application')
    },
    relatedApplications () {
      const { businessCapabilityId, year, quarter } = this.cell
      const indexEntry = this.businessCapabilityIndex[businessCapabilityId] || {}
      let { relatedApplications = [], parentId } = indexEntry
      if (parentId) {
        let relatedApplicationsIndex = relatedApplications
          .reduce((accumulator, application) => ({ ...accumulator, [application.id]: application }), {})
        if (!this.businessCapabilityIndex[parentId]) throw Error(`business Capability ${parentId} not found in then index`)
        const parentRelatedApplications = ((this.businessCapabilityIndex[parentId] || {}).relatedApplications || [])
        relatedApplicationsIndex = parentRelatedApplications
          .reduce((accumulator, application) => {
            const { id } = application
            if (!accumulator[id]) accumulator[id] = application
            return accumulator
          }, relatedApplicationsIndex)
        relatedApplications = Object.values(relatedApplicationsIndex)
      }
      relatedApplications = relatedApplications
        .filter(({ lifecycle }) => {
          if (lifecycle !== null) {
            const { phases = [] } = lifecycle
            if (phases.length) {
              const { phase, startDate } = phases[phases.length - 1]
              if (phase === 'endOfLife') {
                const t = moment(startDate)
                const applicationObsolete = (year > t.year()) || (year === t.year() && quarter !== null && quarter > t.quarter())
                return !applicationObsolete
              }
            }
          }
          return true
        })
      return relatedApplications
    },
    label () {
      const { businessCapabilityId, year, quarter } = this.cell
      return `${year}${quarter !== null ? `-${quarter}` : ''} ${businessCapabilityId}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.transition-background
  transition background 0.2s ease-in-out
</style>
