<template>
  <yu-xcascader v-model="actionValue" @change="onChange" :show-all-levels="true" :request-type="requestType" :data-url="dataUrl" :props="props" separator="," filterable v-bind="$attrs"></yu-xcascader>
</template>

<script>
export default {
  name: 'StandardCascader',
  inheritAttrs: false,
  props: {
    attributes: {
      type: Array,
      default: () => ['prov', 'city', 'area', 'town', 'village']
    },
    dataUrl: {
      type: String,
      default: backend.appOcaService + '/api/adminsmlookupdict/dictcodetreebycode'
    },
    requestType: {
      type: String,
      default: 'POST'
    },
    props: {
      type: Object,
      default: function () {
        return {
          value: 'value',
          label: 'label',
          children: 'children'
        }
      }
    },
    value: {
      type: [String, Array],
      default: ''
    }
  },
  data() {
    return {
      actionValue: [],
      stopExcute: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        if (this.stopExcute) {
          this.stopExcute = false
          return
        }
        if (val) {
          this.handleReverse()
        }
      }
    }
  },
  methods: {
    onChange(val, oldVal) {
      const { formdata } = this.$parent.elForm
      this.attributes.forEach((item, index) => {
        formdata[item] = val[index]
      })
      this.stopExcute = true
      const emitVal = val.filter(value => !!value).join(',')
      this.$emit('input', emitVal)
      this.$emit('change', emitVal)
    },
    handleReverse() {
      const res = []
      if (this.value && typeof this.value === 'string') {
        const values = this.value.split(',')
        for (let i = 0; i < values.length; i++) {
          values[i] && res.push(values[i])
        }
      }
      this.actionValue = res.length > 0 ? res : this.value
    }
  }
}
</script>

<style>
</style>