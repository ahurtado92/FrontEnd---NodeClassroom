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

    <vue-csv-import
        v-model="parseCsv"
        url=""
        :map-fields="['id', 'group', 'teacher', 'subject', 'classroom', 'weekday', 'interval']"
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
        this.getRooms();
        this.getIntervals();
        this.getPeriods();
        this.getUsers();
        this.getGroups();
        this.getSubjects();
    },
    methods: {
        submit(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            
            //console.log(this.rooms[0]._id);
            this.modCSV = this.modifyBeforeSubmit();
            console.log(this.modCSV);

            /*this.axios.post('csv-load', this.modCSV, config)
            .then(res => {
                //this.listIntervals();
                console.log('OK!!!')
            })
            .catch( e => {
                console.log(e.response);
            })
            this.parseCsv = null*/
        },

        modifyBeforeSubmit(){
            var r = [];
            this.parseCsv.forEach(element => {
                //var room = this.rooms.find( (item) => item.name == element.classroom )
                var i = this.intervals.find( (item) => item.extId == element.interval )
                var p = this.thisPeriod = this.periods.find((item) => item._id == i.periodId )
                var intWeeks = moment(p.endDate).diff(moment(p.initDate), 'weeks') //Interval of weeks in period of that element

                r.push({
                    id: element.id,
                    //group: element.group,
                    group: this.groups.find( (item) => item.name == element.group )._id,
                    //teacher: element.teacher,
                    teacher: this.users.find( (item) => item.uname == element.teacher )._id,
                    //subject: element.subject,
                    subject: this.subjects.find( (item) => item.name == element.subject )._id,
                    //classroom: element.classroom,
                    classroom: this.rooms.find( (item) => item.name == element.classroom )._id,
                    weekday: element.weekday,
                    //interval: element.interval
                    //interval: this.intervals.find( (item) => item.extId == element.interval )._id
                    interval: i._id,
                    period: p,
                })
            });
            return r;
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
                //console.log(this.rooms);
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
                //console.log(this.intervals);
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
                //console.log(this.users);
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
                //console.log(this.groups);
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
                //console.log(this.subjects);
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        }
    }
}
</script>