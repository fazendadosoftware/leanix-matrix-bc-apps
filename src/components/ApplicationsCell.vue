<template>
  <div class="border rounded bg-whitesmoke p-1">
    <div
      v-for="application in relatedApplications" :key="application.id"
      class="border bg-white p-1 rounded mb-1 last:mb-0 transition-background"
      :style="getComputedStyle(application.id)">
      {{application.name}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  props: {
    cell: {
      type: Object,
      required: true
    }
  },
  methods: {
    getComputedStyle (applicationId) {
      const legend = this.applicationViewIndex[applicationId] || {}
      const { color, bgColor } = legend
      return `color: ${color}; background-color: ${bgColor};`
    }
  },
  computed: {
    ...mapGetters(['businessCapabilityIndex', 'applicationViewIndex']),
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
  transition background 0.3s ease-in-out
</style>
