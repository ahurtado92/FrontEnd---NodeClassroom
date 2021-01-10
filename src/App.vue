<template>
  <v-app id="inspire">
    
    
      <!--<TopNavbar />-->
      <!--<RightNavbar />-->
      
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <RightNavbar />
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>NodeClassroom</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <!--<HelloWorld/>-->
        <v-card
          elevation="10"
          max-width="100%"

          class="mt-4 mx-auto"
        >
          <router-view></router-view>
        </v-card>
      </v-main>
    
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TopNavbar from '@/components/Top-Navbar.vue'
import RightNavbar from '@/components/Right-Navbar.vue'
import Sidebarmenu from '@/components/sidebar-menu.vue';
//import HelloWorld from './components/HelloWorld';

export default {
  data: () => ({ drawer: null }),
  name: 'App',
  components: {
    TopNavbar,
    RightNavbar,
    Sidebarmenu,
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
