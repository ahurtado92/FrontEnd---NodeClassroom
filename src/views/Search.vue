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

            <!--{{filteredInterval}}-->

            <DatePicker label="Init date" />

            <!--<DatePicker label="End date" />-->

            <v-text-field
                v-model="capacity"
                label="Aforo"
            ></v-text-field>

            <!--{{filteredRooms}}-->

            <!--{{bookings}}-->

           

        </v-form>
        
        <p>Fecha: {{nextWeekday}}</p>

        <!--<v-simple-table>
            <template v-slot:default>
                <tbody>
                    <tr v-for="(_id, name, capacity) in filteredRooms" :key="_id">
                        <th scope="row">{{_id}}</th>
                        <td>{{name}}</td>
                        <td>{{capacity}}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>-->

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

        };
    },
    components: {
      DatePicker,
      ColorPicker,
    },
    created(){
        this.getGroups();
        this.getRooms();
        this.getBookings();
        this.getIntervals();
        this.getPeriods();
    },
    computed: {
        ...mapState(['token']),
        filteredRooms () {
            const search = this.capacity;
            if (!search) return this.rooms;
            //return this.rooms.filter(c => c.capacity.indexOf(search) > -1);
            return this.rooms.filter(
                c => c.capacity >= search
            );
        },

        filteredIntervalByPeriod () {
            const search = this.period;
            if (!search) return this.intervals;
            //return this.intervals.filter(c => c.extId.indexOf(search) > -1);
            this.showWeekday = false;
            return this.intervals.filter(
                c => c.periodId === search
            );
        },
        filteredInterval () {
            const search = this.interval;
            if (!search) return this.filteredIntervalByPeriod;
            //return this.intervals.filter(c => c.extId.indexOf(search) > -1);
            return this.filteredIntervalByPeriod.filter(
                c => c._id === search
            );
        },

        nextWeekday () {
            const search = this.day; 
            if (!search) return null;
            const d = moment().day(search);
            const resInitTime = this.filteredInterval[0].initDate.split(":");
            d.set('hour',resInitTime[0])
            d.set('minute',resInitTime[1])
            d.set('second','00')
            return d;
        },

        filteredBookingsByRoom(){
            const search = this.filteredRooms._id;
            if (!search) return this.bookings;
            //return this.intervals.filter(c => c.extId.indexOf(search) > -1);
            return this.bookings.filter(
                c => c.roomId === search
            );
        },

        filteredBookings () {
            const search = this.nextWeekday;
            //const search = this.filteredBookingsByRoom;
            if (!search) return this.bookings;
            return this.bookings.some(c => moment(c.initDate).format('YYYY/MM/DD HH:mm') === search.format('YYYY/MM/DD HH:mm'));
        },
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
    },
};
</script>