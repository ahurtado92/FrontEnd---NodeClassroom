<template>
    
        
        <v-app-bar app>

            <v-menu
                left
                bottom
                class="hidden-sm-and-up"
            >
                <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" class="hidden-sm-and-up">
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>
                </v-btn>
                </template>

                <v-list v-if="estaActivo && !isAdmin">

                    <v-list-item
                        v-for="(item, index) in noConditionItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                        v-for="(item, index) in activeItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-title>
                            <v-btn
                                text
                                @click="cerrarSesion()"
                            >
                                <v-icon left dark>lock</v-icon>
                                Logout
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-list v-if="estaActivo && isAdmin">

                    <v-list-item
                        v-for="(item, index) in noConditionItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                        v-for="(item, index) in activeItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                        v-for="(item, index) in adminItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-title>
                            <v-btn
                                text
                                @click="cerrarSesion()"
                            >
                                <v-icon left dark>lock</v-icon>
                                Logout
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-list v-if="!estaActivo">

                    <v-list-item
                        v-for="(item, index) in noConditionItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                        v-for="(item, index) in notActiveItems" :key="index"
                        @click="() => {}"
                    >
                        <v-list-item-title>
                            <v-btn
                                text
                                :to=item.path
                            >
                                <v-icon left dark>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-btn>
                        </v-list-item-title>
                        
                    </v-list-item>
                </v-list>

            </v-menu>
            
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer">
                {{ appTitle }}
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            
            <v-toolbar-items class="hidden-xs-only">
                
                <v-btn
                    text
                    :to="'/'"
                >
                    <v-icon left dark>home</v-icon>
                    Home
                </v-btn>

                <v-btn
                    text
                    :to="'/calendar'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>calendar_today</v-icon>
                    Cal
                </v-btn>

                <v-btn
                    text
                    :to="'/instances'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>pan_tool</v-icon>
                    Inst
                </v-btn>

                <v-btn
                    text
                    :to="'/materials'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>weekend</v-icon>
                    Mat
                </v-btn>

                <v-btn
                    text
                    :to="'/bookings'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>bookmarks</v-icon>
                    Reservas
                </v-btn>

                <v-btn
                    text
                    :to="'/rooms'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>room</v-icon>
                    Espacios
                </v-btn>

                <v-btn
                    text
                    :to="'/events'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>local_activity</v-icon>
                    Evts
                </v-btn>

                <v-btn
                    text
                    :to="'/notas'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>note</v-icon>
                    Notas
                </v-btn>
                
                <v-btn
                    text
                    :to="'/groups'"
                    v-if="estaActivo"
                >
                    <v-icon left dark>group</v-icon>
                    Groups
                </v-btn>

                <v-btn
                    text
                    :to="'/users'"
                    v-if="estaActivo && isAdmin"
                >
                    <v-icon left dark>face</v-icon>
                    Users
                </v-btn>

                <v-btn
                    text
                    @click="cerrarSesion()"
                    v-if="estaActivo"
                >
                    <v-icon left dark>lock</v-icon>
                    Logout
                </v-btn>
                <v-btn
                    text
                    :to="'/login'"
                    v-if="!estaActivo"
                >
                    <v-icon left dark>lock_open</v-icon>
                    Login
                </v-btn>
            </v-toolbar-items>
        </v-app-bar>
  
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'TopNavbar',
    data(){
        return {
            appTitle: 'Awesome App',
            sidebar: false,
            menuItems: [
                { title: 'Home', path: '/', icon: 'home', conditions: "" },
                { title: 'Calendario', path: '/calendar', icon: 'calendar_today', conditions: 'estaActivo' },
                { title: 'Instancias', path: '/instances', icon: 'pan_tool', conditions: 'estaActivo' },
                { title: 'Material', path: '/materials', icon: 'weekend', conditions: 'estaActivo' },
                { title: 'Reservas', path: '/bookings', icon: 'bookmarks', conditions: 'estaActivo' },
                { title: 'Espacios', path: '/rooms', icon: 'room', conditions: 'estaActivo' },
                { title: 'Eventos', path: '/events', icon: 'local_activity', conditions: 'estaActivo' },
                { title: 'Notas', path: '/notas', icon: 'note', conditions: 'estaActivo' },
                { title: 'Groups', path: '/groups', icon: 'group', conditions: 'estaActivo' },
                { title: 'Users', path: '/users', icon: 'face', conditions: 'estaActivo && isAdmin' },
                { title: 'Login', path: '/login', icon: 'lock_open', conditions: '!estaActivo'},
            ]
        }
    },
    methods: {
        ...mapActions(['cerrarSesion', 'leerToken'])
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
        this.createdMenuItems = this.menuItems;
    }
}
</script>