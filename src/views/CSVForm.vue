<template>
<div class="container">
    <!--<vue-csv-import v-model="parseCsv" :map-fields="{
        id: 'id', 
        group: 'group', 
        teacher: 'teacher', 
        subject: 'subject', 
        classroom: 'classroom', 
        weekday: 'weekday', 
        interval: 'interval'
    }">
    </vue-csv-import>-->

    <!--<vue-csv-import
        v-model="parseCsv"
        url=""
        :map-fields="['id', 'group', 'teacher', 'subject', 'classroom', 'weekday', 'interval']"
    >-->
    <vue-csv-import 
        v-model="parseCsv" 
        :map-fields="['id', 'group', 'teacher', 'subject', 'classroom', 'weekday', 'interval']"
        :fields="{
            id: {
                required: true, 
                label: 'id'
            }, 
            group: {
                required: false, 
                label: 'group'
            }, 
            teacher: {
                required: true, 
                label: 'teacher'
            },
            subject: {
                required: true, 
                label: 'subject'
            },
            classroom: {
                required: true, 
                label: 'classroom'
            }, 
            weekday: {
                required: true, 
                label: 'weekday'
            }, 
            interval: {
                required: true, 
                label: 'interval'
            },
        }"
    >
        <template slot="hasHeaders" slot-scope="{headers, toggle}">
            <label>
                <input type="checkbox" id="hasHeaders" :value="headers" @change="toggle">
                Headers?
            </label>
        </template>

        <template slot="error">
            File type is invalid
        </template>

        <template slot="thead">
            <tr>
                <th>My Fields</th>
                <th>Column</th>
            </tr>
        </template>

        <vue-csv-map :auto-match="true"></vue-csv-map>

        <template slot="next" slot-scope="{load}">
            <!--<button @click.prevent="load">load!</button>-->
            <v-btn
                color="blue"
                class="mx-2"
                @click.stop="load"
            >Load file</v-btn>
        </template>

        <vue-csv-submit v-slot="{submit}">
            <button @click.prevent="submit()">Submit!!</button>
        </vue-csv-submit>

    </vue-csv-import>
    <v-btn
            color="green"
            class="mx-2"
            @click.stop="submit()"
        >Send</v-btn>
    </div>
</template>

<script>
import { VueCsvImport } from 'vue-csv-import';
import { mapState } from 'vuex';
import moment from 'moment'
export default {
    name: 'CSVForm',
    data() {
        return {
            parseCsv: null,
            modCSV: null,
            elementCSV: null,
            eventCSV: null,
            events: [],
            rooms: [],
            periods: [],
            thisPeriod: null,
            intervals: [],
            users: [],
            groups: [],
            subjects: [],
        };
    },
    components: {
        VueCsvImport
    },
    computed: {
        ...mapState(['token'])
    },
    created () {
        this.getEvents();
        this.getRooms();
        this.getIntervals();
        this.getPeriods();
        this.getUsers();
        this.getGroups();
        this.getSubjects();
    },
    methods: {
        submit(){
            
            this.modifyBeforeSubmit();

        },

        modifyBeforeSubmit(){

            let config = {
                headers: {
                    token: this.token
                }
            }
            
            this.parseCsv.forEach(element => {
                var evt = []
                var i = this.intervals.find( (item) => item.extId == element.interval )
                var p = this.thisPeriod = this.periods.find((item) => item._id == i.periodId )
                var intWeeks = moment(p.endDate).diff(moment(p.initDate), 'weeks')

                let id = element.id
                let group = this.groups.find( (item) => item.name == element.group )
                let teacher = this.users.find( (item) => item.uname == element.teacher )
                let subject = this.subjects.find( (item) => item.name == element.subject )
                let classroom = this.rooms.find( (item) => item.name == element.classroom )
                let weekday = element.weekday
                let interval = i._id
                let resInitTime = i.initDate.split(":");
                let resEndTime = i.endDate.split(":");
                let period = p

                var iDateTime = moment(p.initDate);
                var iDoW = iDateTime.day(weekday)
                iDoW.set('hour',resInitTime[0])
                iDoW.set('minute',resInitTime[1])

                var eDateTime = moment(p.initDate);
                var eDoW = eDateTime.day(weekday)
                eDoW.set('hour',resEndTime[0])
                eDoW.set('minute',resEndTime[1])

                if(!this.eventCSV || this.eventCSV.find(x => x.extId == id)==undefined){
                    evt.push({
                        extId: id,
                        group: group._id,
                        creatorId: teacher._id,
                        subject: subject._id,
                        roomId: classroom._id,
                        weekday: weekday,
                        interval: interval,
                    })

                    this.axios.post('new-event', evt, config)
                    .then(res => {
                        this.$router.push({ name: 'events' });
                    })
                    .catch( e => {
                        console.log(e.response);
                    })

                    for (let iter=0; iter<intWeeks; iter++){
                        var r = [];

                        r.push({
                            extId: id,
                            group: group._id,
                            creatorId: teacher._id,
                            name: subject.name,
                            roomId: classroom._id,
                            weekday: weekday,
                            interval: interval,
                            initDate: iDoW.format('YYYY/MM/DD HH:mm'),
                            endDate: eDoW.format('YYYY/MM/DD HH:mm'),
                            color: subject.color,
                        })
                        
                        iDoW.add(1, 'week'); 
                        eDoW.add(1, 'week'); 

                        this.upload(r);

                    }
                }

            });
        },

        upload(r,eventCSV){

            let config = {
                headers: {
                    token: this.token
                }
            }

            this.axios.post('new-booking', r, config)
            .then(res => {
                parseCsv = null;
                modCSV = null;
                elementCSV = null;
            })
            .catch( e => {
                console.log(e.response);
            })
        },

        getEvents(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('events', config)
            .then((response) => {
                this.events = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        getRooms(){
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

        getIntervals(){
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

        getPeriods(){
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

        getUsers(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('usuarios', config)
            .then((response) => {
                this.users = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        getGroups() {
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('groups', config)
            .then((response) => {
                this.groups = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        getSubjects() {
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('subjects', config)
            .then((response) => {
                this.subjects = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        }
    }
}
</script>