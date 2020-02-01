<template>
  <div
    class="leanix-btn inline-block cursor-pointer bg-whitesmoke text-darkslategray border border-whitesmoke hover:bg-silver rounded"
    @click="action(actionArgs)">
    <div v-if="icon" class="inline-block" :class="{ 'mr-1': label }">
      <font-awesome-icon :icon="icon" :spin="spin"/>
    </div>
    <span v-if="label">{{label}}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false
    },
    label: {
      type: String,
      required: false
    },
    action: {
      type: Function,
      required: true
    },
    actionArgs: {
      required: false
    },
    spin: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.leanix-btn
  padding 3px 7px
  height 24px
  transition background 0.18s ease-in-out
</style>
