<template>
    <div class="container">

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">extId</th>
                    <th scope="col">Group</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Classroom</th>
                    <th scope="col">Weekday</th>
                    <th scope="col">Interval</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in eventos" :key="index">
                    <th scope="row">{{item.extId}}</th>
                    <td>{{item.subject}}</td>
                    <td>{{item.roomId}}</td>
                    <td>{{item.weekday}}</td>
                    <td>{{item.interval}}</td>
                    <td>{{item.date}}</td>
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
export default {
    data() {
        return {
            eventos: [],
        };
    },
    created(){
        this.listarEventos();
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
            this.axios.get('events', config)
            .then((response) => {
                this.eventos = response.data;
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
    }
};
</script>