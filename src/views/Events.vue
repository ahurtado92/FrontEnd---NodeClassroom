<template>
    <div class="container">

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">extId</th>
                    <th scope="col">Grupo</th>
                    <th scope="col">Asignatura</th>
                    <th scope="col">Clase</th>
                    <th scope="col">Dia</th>
                    <th scope="col">Intervalo</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in eventos" :key="index">
                    <th scope="row">{{item.extId}}</th>
                    <td>{{item.group}}</td>
                    <td>{{item.subject}}</td>
                    <td>{{item.roomId}}</td>
                    <td>{{item.weekday}}</td>
                    <td>{{item.interval}}</td>
                    <td>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarEvento(item._id)"
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
import moment from 'moment'
export default {
    data() {
        return {
            eventos: [],
            groups: [],
            subjects: [],
            classrooms: [],
            intervals: []
        };
    },
    created(){
        
        this.getGroups();
        this.getSubjects();
        this.getClassrooms();
        this.getIntervals();
        setTimeout(() => {
            this.listarEventos();
        }, 300)
        
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarEventos(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            var r = []
            this.axios.get('events', config)
            .then((response) => {
                response.data.forEach(evt=>{
                    const g = this.groups.find( (item) => item.value == evt.group )
                    let gId = null;
                    if(g !== undefined){
                        gId = g.text
                    }
                    const s = this.subjects.find( (item) => item.value == evt.subject )
                    let sId = null;
                    if(s !== undefined){
                        sId = s.text
                    }
                    const c = this.classrooms.find( (item) => item.value == evt.roomId )
                    let cId = null;
                    if(c !== undefined){
                        cId = c.text
                    }
                    const i = this.intervals.find( (item) => item.value == evt.interval )
                    let iId = null;
                    if(i !== undefined){
                        iId = i.text
                    }
                    r.push({
                        extId: evt.extId,
                        group: gId,
                        creatorId: evt.creatorId,
                        subject: sId,
                        roomId: cId,
                        weekday: moment().day(evt.weekday).format('dddd'),
                        interval: iId,
                        date: new Date(evt.date).toLocaleString(),
                    })
                });
                this.eventos = r;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        eliminarEvento(id){
            this.axios.delete(`event/${id}`)
            .then(res => {
                let index = this.eventos.findIndex( item => item._id === res.data._id )
                this.eventos.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
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

        listSubjects(){
            let subjectL = []
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('subjects', config)
            .then((response) => {
                subjectL = response.data;
                subjectL.forEach(evt=>{
                    this.subjects.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
            setTimeout(() => {
                // do other things
                }, 100)
        },
        listClassrooms(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('rooms', config)
            .then((response) => {
                response.data.forEach(evt=>{
                    this.classrooms.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },
        listIntervals(){
            let intervalL = []
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('intervals', config)
            .then((response) => {
                intervalL = response.data;
                intervalL.forEach(evt=>{
                    this.intervals.push({
                        text: evt.extId,
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
        async getSubjects(){
                await this.listSubjects();
        },
        async getClassrooms(){
                await this.listClassrooms();
        },
        async getIntervals(){
                await this.listIntervals();
        },
    }
};
</script>