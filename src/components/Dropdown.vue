<template>
  <div class="flex items-center text-darkslategray">
    <span v-if="label" class="mr-1">{{label}}:</span>
    <div class="btn-group relative">
      <div @click="toggleMenu" class="cursor-pointer text-royalblue hover:underline" v-if="selectedOption.label !== undefined">
        {{ selectedOption.label }}
      </div>

      <div @click="toggleMenu" class="dropdown-toggle" v-if="selectedOption.label === undefined">
        {{ placeholderText }}
      </div>

      <div
        v-if="showMenu"
        class="dropdown-menu border border-gainsboro rounded shadow mt-2 bg-white absolute left-0"
        style="z-index: 1000; width: 270px">
        <div v-for="(option, idx) in options" :key="idx">
          <div v-if="option.separator" class="text-darkgray font-bold cursor-default px-4 py-2 border-t">
            {{option.label}}
          </div>
          <div v-else
            class="cursor-pointer hover:bg-gainsboro px-4 py-2"
            @click="updateOption(option)">
              {{ option.label }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  computed: {
    selectedOption: {
      get () {
        return this.selected
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  data () {
    return {
      showMenu: false,
      placeholderText: 'Please select an item'
    }
  },
  props: {
    label: {
      type: String
    },
    options: {
      type: [Array, Object]
    },
    selected: {},
    placeholder: [String],
    closeOnOutsideClick: {
      type: [Boolean],
      default: true
    }
  },
  mounted () {
    this.selectedOption = this.selected
    if (this.placeholder) {
      this.placeholderText = this.placeholder
    }
    if (this.closeOnOutsideClick) {
      document.addEventListener('click', this.clickHandler)
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickHandler)
  },
  methods: {
    updateOption (option) {
      this.selectedOption = option
      this.showMenu = false
      this.$emit('updateOption', this.selectedOption)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    clickHandler (event) {
      const { target } = event
      const { $el } = this
      if (!$el.contains(target)) {
        this.showMenu = false
      }
    }
  }
}
</script>
