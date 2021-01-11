<template>
    <v-color-picker
      class="ma-2"
      hide-inputs
      v-model="color"
      @update:color="save"
    ></v-color-picker>
</template>
<script>
export default {
    name: 'ColorPicker',
    props: ['defaultColor'],
    data(){
        return {
            color: null,
        }
    },
    methods: {
      save (color) {
        this.$emit('color', this.color)
      },
    },
    created: {
      exec() {
        console.log(this.defaultColor)
      }
    }
}
</script>