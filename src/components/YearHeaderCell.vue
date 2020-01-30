<template>
  <div class="sticky top-0 p-1 text-white bg-dodgerblue font-semibold tracking-wider text-lg flex justify-center items-center rounded" style="font-size: 1.2em">
    {{cell.label}}
  </div>
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
