<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit.prevent="addBooking(booking)"
            id="new-booking-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Reserva</h3>

            <v-text-field
                v-model="booking.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="booking.group"
                class="my-2"
                :items="groups"
                label="Group"
                item-value="text"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="booking.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="booking.roomId"
                class="my-2"
                :items="rooms"
                label="Espacio"
                item-value="value"
                required
            ></v-overflow-btn>


            <v-datetime-picker
                label="Inicio"
                v-model="booking.initDate">
            </v-datetime-picker>

            <v-datetime-picker
                label="Final"
                v-model="booking.endDate">
            </v-datetime-picker>

            <ColorPicker label="Color" v-on:color="updateColor($event, booking)" />

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="new-booking-form"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyBooking(bookingToModify)"
            id="edit-booking-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Modify booking</h3>

            <v-text-field
                v-model="bookingToModify.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="bookingToModify.roomId"
                class="my-2"
                :items="groups"
                label="Grupo"
                item-value="value"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="bookingToModify.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="bookingToModify.roomId"
                class="my-2"
                :items="rooms"
                label="Espacio"
                item-value="value"
                required
            ></v-overflow-btn>

            <v-datetime-picker
                v-bind:label="new Date(bookingToModify.initDate).toLocaleString()"
                v-model="bookingToModify.initDate">
            </v-datetime-picker>

            <v-datetime-picker
                v-bind:label="new Date(bookingToModify.endDate).toLocaleString()"
                v-model="bookingToModify.endDate">
            </v-datetime-picker>

            <ColorPicker label="Color" v-on:color="updateColor($event, bookingToModify)" />

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="edit-booking-form"
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
                    <th scope="row">{{item.name}}</th>
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
                    
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="editBooking(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="deleteBooking(item._id)"
                        >Eliminar</v-btn>
                    </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import DatePicker from '@/components/DatePicker.vue';
import TimePicker from '@/components/TimePicker.vue';
import ColorPicker from '@/components/ColorPicker.vue';
export default {
    data() {
        return {
            bookings: [],
            booking: {},
            rooms: [],
            groups: [],
            add: true,
            bookingToModify: {},
        };
    },
    components: {
      DatePicker,
      TimePicker,
      ColorPicker,
    },
    created(){
        this.getGroups();
        this.getRooms();
        setTimeout(() => {
            this.getBookings();
        }, 300)
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listBookings(){
            var r = []
            var room = null
            let config = {
                headers: {
                    token: this.token
                }
            }

            if(this.rooms){
                this.axios.get('bookings', config)
                .then((response) => {
                    response.data.forEach(evt=>{
                        const g = this.groups.find( (item) => item.value == evt.group )
                        let gId = [];
                        if(g !== undefined){
                            gId = g
                        }
                        r.push({
                            accessGroups: evt.accessGroups,
                            accessUsers: evt.accessUsers,
                            color: evt.color,
                            date: new Date(evt.date).toLocaleString(),
                            description: evt.description,
                            endDate: new Date(evt.endDate).toLocaleString(),
                            initDate: new Date(evt.initDate).toLocaleString(),
                            group: gId.text,
                            material: evt.material,
                            modGroups: evt.modGroups,
                            modUsers: evt.modUsers,
                            name: evt.name,
                            roomId: this.rooms.find( room => room.value == evt.roomId ).text,
                            __v: evt.__v,
                            _id: evt._id,
                        })
                    });
                    this.bookings = r;
                })
                .catch((e)=>{
                    console.log('error' + e);
                })
            }
        },

        listRooms(){
            let roomL = []

            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('rooms', config)
            .then((response) => {
                roomL = response.data;
                roomL.forEach(evt=>{
                    this.rooms.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addBooking(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-booking', this.booking, config)
            .then(res => {
            this.listBookings();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.bookings = {}
        },
        deleteBooking(id){
            this.axios.delete(`booking/${id}`)
            .then(res => {
                let index = this.bookings.findIndex( item => item._id === res.data._id )
                this.bookings.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editBooking(id){
            this.add = false;
            this.axios.get(`booking/${id}`)
            .then(res => {
                this.bookingToModify = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyBooking(item){
            this.axios.put(`booking/${item._id}`, item)
            .then(res => {
                this.bookingToModify = {}
                this.listBookings();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
        updateInitDate(v,d){
            d.initDate=v;
        },
        updateEndDate(v,d){
            d.endDate=v;
        },
        updateColor(v,c){
            c.color=v.hex;
        },

        listGroups(){
            let groupL = []
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('groups', config)
            .then((response) => {
                groupL = response.data;
                groupL.forEach(evt=>{
                    this.groups.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        async getGroups(){
                await this.listGroups();
        },

        async getRooms(){
                await this.listRooms();
        },

        async getBookings(){
                await this.listBookings();
        }
    }
};
</script>