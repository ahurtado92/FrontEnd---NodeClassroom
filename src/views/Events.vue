<template>
    <div class="container">
        <v-form
            v-if="agregar"
            @submit.prevent="agregarEvento(evento)"
            id="form-nuevo-evento"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Evento</h3>
            <v-text-field
                v-model="evento.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="evento.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-evento"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="editarEvento(eventoEditar)"
            id="form-editar-evento"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Evento</h3>
            <v-text-field
                v-model="eventoEditar.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="eventoEditar.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-evento"
            >Actualizar</v-btn>

            <v-btn
                class="mr-4"
                color="danger"
                @click.stop="agregar = true"
            >Cancelar</v-btn>

        </v-form>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in eventos" :key="index">
                    <th scope="row">{{item._id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.date}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicionEvento(item._id)"
                        >Editar</v-btn>
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
            evento: {},
            agregar: true,
            eventoEditar: {},
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

        agregarEvento(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-event', this.evento, config)
            .then(res => {
            this.listarEventos();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.eventos = {}
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
        activarEdicionEvento(id){
            this.agregar = false;
            this.axios.get(`event/${id}`)
            .then(res => {
                this.eventoEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarEvento(item){
            this.axios.put(`event/${item._id}`, item)
            .then(res => {
                this.eventoEditar = {}
                this.listarEventos();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>