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
}
</script>