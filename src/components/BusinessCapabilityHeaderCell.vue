<template>
  <div class="sticky left-0 border bg-blue-400">{{cell.name}} ></div>
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
