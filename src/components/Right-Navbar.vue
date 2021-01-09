<template v-slot:prepend>
      
      <v-list dense>

        <v-list-item>
          <v-list-item-avatar>
            <!--<img src="https://randomuser.me/api/portraits/women/81.jpg">-->
            <v-icon>account_box</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{this.uname}}</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to=item.path
        >
          
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>

        </v-list-item>

        <v-list-group style="margin-left: -16px" no-action>

          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon><v-icon>account_box</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="primary--text">
                  <p>Titles</p>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item >
            <v-list-item-icon><v-icon>account_box</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                <p>Subtitle</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>

        <v-list-group style="margin-left: -16px" no-action>

          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon><v-icon>account_box</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="primary--text">
                  <p>Titles</p>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item >
            <v-list-item-icon><v-icon>account_box</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                <p>Subtitle</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item >
            <v-list-item-icon><v-icon>account_box</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                <p>Subtitle2</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>

      </v-list>


</template>

<script>
import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'RightNavbar',
    data () {
      return {
        drawer: null,
        appTitle: 'Awesome App',
        items: [
          { title: 'Home', icon: 'home', path: '/' },
          { title: 'Notas', icon: 'note', path: 'notas'  },
          { title: 'Users', icon: 'mdi-account-group-outline', path: 'users'  },
          { title: 'Calendario', icon: 'calendar_today', path: 'calendar'  },
          { title: 'Instancias', icon: 'pan_tool', path: 'instances'  },
          { title: 'Material', icon: 'weekend', path: 'materials'  },
          { title: 'Reservas', icon: 'bookmarks', path: 'bookings'  },
          { title: 'Espacios', icon: 'room', path: 'rooms'  },
          { title: 'Eventos', icon: 'local_activity', path: 'events'  },
          { title: 'Grupos', icon: 'group', path: 'groups'  },
        ],
        uname: null,
      }
    },
    methods: {
        ...mapActions(['cerrarSesion', 'leerToken']),
        ...mapGetters(['getUsername']),
    },
    computed: {
        ...mapGetters(['estaActivo','isAdmin']),
        noConditionItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions===""
            })
        },
        activeItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="estaActivo"
            })
        },
        notActiveItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="!estaActivo"
            }) 
        },
        adminItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="estaActivo && isAdmin"
            }) 
        },

    },
    created(){
        this.leerToken();
        this.uname = this.getUsername();
        this.createdMenuItems = this.menuItems;
    }
  }
</script>