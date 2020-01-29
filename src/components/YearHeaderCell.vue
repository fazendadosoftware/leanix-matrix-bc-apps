<template>
  <div class="sticky top-0 border bg-green-400">{{cell.label}}</div>
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
