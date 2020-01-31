<template>
  <div class="flex items-center">
    <span v-if="label" class="mr-1">{{label}}:</span>
    <div class="btn-group relative">
      <li @click="toggleMenu" class="cursor-pointer text-royalblue hover:underline" v-if="selectedOption.label !== undefined">
        {{ selectedOption.label }}
      </li>

      <li @click="toggleMenu" class="dropdown-toggle" v-if="selectedOption.label === undefined">
        {{ placeholderText }}
      </li>

      <ul class="dropdown-menu absolute left-0 z-50" v-if="showMenu">
        <li v-for="(option, idx) in options" :key="idx">
          <div
            class="cursor-pointer text-sm hover:bg-gainsboro"
            @click="updateOption(option)">
              {{ option.label }}
          </div>
        </li>
      </ul>
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

<style lang="stylus" scoped>
.dropdown-menu {
  top: 100%;
  z-index: 1000
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
}
.dropdown-menu > li > a {
  padding: 10px 30px;
  display: block;
  clear: both;
  font-weight: normal;
  line-height: 1.6;
  color: #333333;
  white-space: nowrap;
  text-decoration: none;
}
.dropdown-menu > li > a:hover {
  background: #efefef;
  color: #409fcb;
}
.dropdown-menu > li {
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0;
}
.caret {
  width: 0;
  position: absolute;
  top: 19px;
  height: 0;
  margin-left: -24px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  right: 10px;
}
li {
  list-style: none;
}
</style>
