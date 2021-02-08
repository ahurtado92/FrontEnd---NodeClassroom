<template>
    <div class="container">
        <div v-if="!showBookingsByRoom">
            <v-form
                v-if="add"
                @submit.prevent="addRoom(room)"
                id="new-room-form"
                ref="form"
                lazy-validation
            >
                <h3 class="text-center">Agregar nuevo Espacio</h3>

                <v-text-field
                    v-model="room.name"
                    label="Nombre"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="room.description"
                    label="Descripción"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="room.localisation"
                    label="Localización"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="room.capacity"
                    label="Aforo"
                    required
                ></v-text-field>

                <!--<v-text-field
                    v-model="room.image"
                    label="Imagen"
                    required
                ></v-text-field>-->

                <v-btn
                    block
                    class="mr-4"
                    type="submit"
                    color="success"
                    form="new-room-form"
                >Añadir</v-btn>

            </v-form>

            <v-form
                v-if="!add"
                @submit.prevent="modifyRoom(roomToEdit)"
                id="edit-room-form"
                ref="form"
                lazy-validation
            >
                <h3 class="text-center">Modify room</h3>

                <v-text-field
                    v-model="roomToEdit.name"
                    label="Nombre"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="roomToEdit.description"
                    label="Descripción"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="roomToEdit.localisation"
                    label="Localización"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="roomToEdit.capacity"
                    label="Aforo"
                    required
                ></v-text-field>

                <!--<v-text-field
                    v-model="roomToEdit.image"
                    label="Imagen"
                    required
                ></v-text-field>-->

                <v-btn
                    class="mr-4"
                    type="submit"
                    color="success"
                    form="edit-room-form"
                >Actualizar</v-btn>

                <v-btn
                    class="mr-4"
                    color="danger"
                    @click.stop="add = true"
                >Cancelar</v-btn>

            </v-form>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Localización</th>
                            <th scope="col">Aforo</th>
                            <!--<th scope="col">Fecha de creación</th>-->
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in rooms" :key="index">
                        <th scope="row">{{item.name}}</th>
                        <td>{{item.description}}</td>
                        <td>{{item.localisation}}</td>
                        <td>{{item.capacity}}</td>
                        <!--<td>{{item.date}}</td>-->
                        <td>
                            <v-btn
                                color="green"
                                class="mx-2"
                                @click.stop="bookingsByRoom(item._id)"
                            >Reservas</v-btn>
                            <v-btn
                                color="primary"
                                class="mx-2"
                                @click.stop="editRoom(item._id)"
                            >Editar</v-btn>
                            <v-btn
                                color="error"
                                class="mx-2"
                                @click.stop="deleteRoom(item._id)"
                            >Eliminar</v-btn>
                        </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        
        </div>

        


        <v-simple-table v-else>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Room</th>
                        <th scope="col">Init</th>
                        <th scope="col">End</th>
                        <th scope="col">Grupo</th>
                        <th scope="col">Color</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in bookings" :key="index">
                    <th scope="row">{{item.id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.roomId}}</td>
                    <td>{{item.initDate}}</td>
                    <td>{{item.endDate}}</td>
                    <td>{{item.group}}</td>
                    <td>
                        <v-sheet
                            v-bind:color="item.color"
                            elevation="1"
                            height="30"
                            width="30"
                            rounded
                        ></v-sheet>
                    </td>
                    <td>{{item.date}}</td>
                    
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            rooms: [],
            room: {},
            add: true,
            roomToEdit: {},
            showBookingsByRoom: false,
            bookings: [],
        };
    },
    created(){
        this.listRooms();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listRooms(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('rooms', config)
            .then((response) => {
                this.rooms = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addRoom(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-room', this.room, config)
            .then(res => {
            this.listRooms();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.rooms = {}
        },
        deleteRoom(id){
            this.axios.delete(`room/${id}`)
            .then(res => {
                let index = this.rooms.findIndex( item => item._id === res.data._id )
                this.rooms.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editRoom(id){
            this.add = false;
            this.axios.get(`room/${id}`)
            .then(res => {
                this.roomToEdit = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyRoom(item){
            this.axios.put(`room/${item._id}`, item)
            .then(res => {
                this.roomToEdit = {}
                this.listRooms();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
        bookingsByRoom(id){
            this.showBookingsByRoom = true;
            this.axios.get(`bookingsByRoom/${id}`)
            .then(res => {
                this.bookings = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        }
    }
};
</script>