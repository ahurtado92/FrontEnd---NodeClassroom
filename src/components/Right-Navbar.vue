<template v-slot:prepend>
      
      <v-list dense>

        <v-list-item>
          <v-list-item-avatar>
            <!--<img src="https://randomuser.me/api/portraits/women/81.jpg">-->
            <v-icon>account_box</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{this.unm}}</v-list-item-title>
            <v-list-item-subtitle v-if="estaActivo">Logged In</v-list-item-subtitle>
            <v-list-item-subtitle v-else>Log In First!</v-list-item-subtitle>
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

        <v-list-item
          text
          @click="cerrarSesion()"
          v-if="estaActivo"
        >
          <v-list-item-icon>
              <v-icon>lock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
          text
          :to="'/login'"
          v-else
        >
          <v-list-item-icon>
              <v-icon>lock_open</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

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
          { title: 'Franjas', icon: 'group', path: 'intervals'  },
          { title: 'Periodos', icon: 'group', path: 'periods'  },
          { title: 'Asignaturas', icon: 'group', path: 'subjects'  },
          { title: 'CSV', icon: 'group', path: 'csvform'  },
        ],
        uname: null,
        unm: null,
      }
    },
    methods: {
        ...mapActions(['cerrarSesion', 'leerToken']),
        ...mapGetters(['getUsername']),
        setUname:  function () {
          this.uname = this.getUsername();
        },
        setUnm:  function () {
          this.unm = this.uname;
        },
    },
    watch: {
      uname: function () {
        this.setUnm();
      }
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
        //this.uname = this.getUsername();
        this.setUname();
        this.createdMenuItems = this.items;
    }
  }
</script>