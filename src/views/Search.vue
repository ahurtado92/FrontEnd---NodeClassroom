<template>
    <div class="container">
        <v-form
            id="search-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Buscar y reservar</h3>

            <v-overflow-btn
                v-model="period"
                class="my-2"
                :items="periods"
                label="Periodo"
                item-text="name"
                item-value="_id"
                required
            ></v-overflow-btn>

            <v-overflow-btn 
                v-model="interval"
                :disabled= showWeekday
                class="my-2"
                :items="filteredIntervalByPeriod"
                label="Hora de inicio"
                item-text="initDate"
                item-value="_id"
            ></v-overflow-btn>

            <v-overflow-btn 
                v-model="interval"
                :disabled= showWeekday
                class="my-2"
                :items="filteredIntervalByPeriod"
                label="Hora final"
                item-text="endDate"
                item-value="_id"
            ></v-overflow-btn>

            <v-overflow-btn
                v-model="day"
                class="my-2"
                :items="weekdays"
                label="Dia de la semana"
                item-text="text"
                item-value="value"
            ></v-overflow-btn>

            <v-text-field
                v-model="capacity"
                label="Aforo"
            ></v-text-field>

            <v-text-field
                v-model="bookingName"
                label="Nombre"
                required
            ></v-text-field>

            <ColorPicker label="Color" v-on:color="updateColor($event)" />

        </v-form>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Aforo</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredNotBookedRooms" :key="index">
                    <th scope="row">{{item.name}}</th>
                    <td>{{item.description}}</td>
                    <td>{{item.capacity}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="bookRoom(item._id)"
                        >Reservar</v-btn>
                        
                    </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

    </div>

</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex';
import DatePicker from '@/components/DatePicker.vue';
import ColorPicker from '@/components/ColorPicker.vue';
export default {
    data() {
        return {
            weekdays: [
                { text: 'Lunes', value: 1 },
                { text: 'Martes', value: 2 },
                { text: 'Miércoles', value: 3 },
                { text: 'Jueves', value: 4 },
                { text: 'Viernes', value: 5 },
                { text: 'Sábado', value: 6 },
                { text: 'Domingo', value: 7 },
            ],

            bookings: [],
            rooms: [],
            groups: [],
            intervals: [],
            periods: [],

            capacity: null,
            day: null,
            interval:null,
            period:null,
            showWeekday: true,

            bookingName: null,
            bookingColor: '',

        };
    },
    components: {
      DatePicker,
      ColorPicker,
    },
    created(){
        setTimeout(() => {
            this.getGroups();
            this.getRooms();
            this.getBookings();
            this.getIntervals();
            this.getPeriods();
        }, 300)
    },
    computed: {
        ...mapState(['token']),
        filteredRooms () {
            const search = this.capacity;
            if (!search) return this.rooms;
            return this.rooms.filter(
                c => c.capacity >= search
            );
        },

        filteredIntervalByPeriod () {
            const search = this.period;
            if (!search) return this.intervals;
            this.showWeekday = false;
            return this.intervals.filter(
                c => c.periodId === search
            );
        },
        filteredInterval () {
            const search = this.interval;
            if (!search) return this.filteredIntervalByPeriod;
            return this.filteredIntervalByPeriod.filter(
                c => c._id === search
            );
        },

        nextWeekday () {
            const search = this.day; 
            if (!search) return null;
            const today = moment();
            const d = moment().day(search);
            
            const resInitTime = this.filteredInterval[0].initDate.split(":");
            d.set('hour',resInitTime[0])
            d.set('minute',resInitTime[1])
            d.set('second','00')
            while( d < today){d.add(1, 'w');}
            return d;
        },

        filteredBookingsByRoom(){
            let search = []
            if (!search) return this.bookings;
            this.filteredRooms.forEach(evt=>{search.push(this.bookings.filter(c => c.roomId == evt._id))})
            return search
        },

        filteredBookings () {
            let arr = []
            const search = this.nextWeekday;
            if (!search) return this.filteredBookingsByRoom;
            this.filteredBookingsByRoom.forEach(
                evt=>{arr.push(evt.some(c => moment(c.initDate).format('YYYY/MM/DD HH:mm') === search.format('YYYY/MM/DD HH:mm')))}
            )
            return arr
        },
        filteredNotBookedRooms() {
            let arr = []
            const search = this.filteredBookings;
            
            if (!search) return this.filteredRooms;
                        
            for (const [key, value] of search.entries()) {
                if(!value){
                    arr.push(this.rooms.filter(c => c._id == this.filteredBookingsByRoom[key][0].roomId)[0])
                }
                
            }

            return arr
        }
    },
    methods:{

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

        listIntervals(){

            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('intervals', config)
            .then((response) => {
                this.intervals = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        listPeriods(){

            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('periods', config)
            .then((response) => {
                this.periods = response.data;
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
        },

        async getIntervals(){
                await this.listIntervals();
        },

        async getPeriods(){
                await this.listPeriods();
        },

        updateColor(v){
            this.bookingColor = v.hex;
        },

        bookRoom(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            
            let booking = [];

            const resEndTime = this.filteredInterval[0].endDate.split(":");

            let nextEndWeekday = this.nextWeekday.clone();
            nextEndWeekday.set('hour',resEndTime[0])
            nextEndWeekday.set('minute',resEndTime[1])
            nextEndWeekday.set('second','00')

            booking.push({
                name: this.bookingName,
                roomId: item,
                initDate: this.nextWeekday.format('YYYY/MM/DD HH:mm'),
                endDate: nextEndWeekday.format('YYYY/MM/DD HH:mm'),
                color: this.bookingColor
            });

            this.axios.post('new-booking', booking, config)
            .then(res => {
                console.log(res);
            })
            .catch( e => {
                console.log(e.response);
            })
            
            this.bookings = []
            this.rooms = []
            this.groups = []
            this.intervals = []
            this.periods = []

            this.capacity = null
            this.day = null
            this.interval = null
            this.period = null
            this.showWeekday = true

            this.bookingName = null,
            this.bookingColor = '',
            
            this.getGroups();
            this.getRooms();
            this.getBookings();
            this.getIntervals();
            this.getPeriods();

        },

    },
};
</script>