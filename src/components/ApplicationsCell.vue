<template>
  <div class="border p-1">
    {{label}}
  </div>
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      required: true
    }
  },
  computed: {
    label () {
      const { businessCapabilityId, year, quarter } = this.cell
      return `${year}${quarter !== null ? `-${quarter}` : ''} ${businessCapabilityId}`
    }
  }
}
</script>
