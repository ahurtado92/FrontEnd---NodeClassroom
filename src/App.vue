<template>
  <v-app>
    
    <TopNavbar />

    <v-main>
      <!--<HelloWorld/>-->
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TopNavbar from '@/components/Top-Navbar.vue'
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    TopNavbar
  },
  methods: {
    ...mapActions(['cerrarSesion', 'leerToken'])
  },
  computed: {
    ...mapGetters(['estaActivo'])
  },
  created(){
    this.leerToken();
  },

};
</script>
