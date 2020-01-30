<template>
  <div class="sticky left-0 top-0 z-50 bg-white" :style="cell.style"/>
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      required: true
    }
  }
}
</script>
