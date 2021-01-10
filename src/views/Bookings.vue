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

            <v-text-field
                v-model="booking.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="booking.roomId"
                label="Room"
                required
            ></v-text-field>

            <!--<v-text-field
                v-model="booking.initDate"
                label="Inicio"
                required
            ></v-text-field>-->

            <DatePicker label="Init date" v-on:date="updateInitDate($event, booking)" />
            <TimePicker label="Init time" />

            <v-text-field
                v-model="booking.endDate"
                label="Fin"
                required
            ></v-text-field>

            <v-text-field
                v-model="booking.color"
                label="Color"
                required
            ></v-text-field>

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

            <v-text-field
                v-model="bookingToModify.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="bookingToModify.roomId"
                label="Room"
                required
            ></v-text-field>

            <!--<v-text-field
                v-model="bookingToModify.initDate"
                label="Inicio"
                required
            ></v-text-field>-->

            <DatePicker label="Init date" v-on:date="updateInitDate($event, bookingToModify)" />
            <TimePicker label="Init time" />

            <v-text-field
                v-model="bookingToModify.endDate"
                label="Fin"
                required
            ></v-text-field>

            <v-text-field
                v-model="bookingToModify.color"
                label="Color"
                required
            ></v-text-field>

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
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Room</th>
                        <th scope="col">Init</th>
                        <th scope="col">End</th>
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
                    <td>{{item.color}}</td>
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
export default {
    data() {
        return {
            bookings: [],
            booking: {},
            add: true,
            bookingToModify: {},
        };
    },
    components: {
      DatePicker,
      TimePicker,
    },
    created(){
        this.listBookings();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listBookings(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('bookings', config)
            .then((response) => {
                this.bookings = response.data;
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
        }
    }
};
</script>