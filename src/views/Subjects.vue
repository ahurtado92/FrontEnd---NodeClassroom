<template>
    <div class="container">
        <v-form
            v-if="agregar"
            @submit.prevent="addSubject(subject)"
            id="form-nuevo-subject"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Grupo</h3>
            <v-text-field
                v-model="subject.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="subject.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-subject"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="editarSubject(subjectEditar)"
            id="form-editar-subject"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Grupo</h3>
            <v-text-field
                v-model="subjectEditar.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="subjectEditar.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-subject"
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
                    <tr v-for="(item, index) in subjects" :key="index">
                    <th scope="row">{{item._id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.date}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicionSubject(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarSubject(item._id)"
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
            subjects: [],
            subject: {},
            agregar: true,
            subjectEditar: {},
        };
    },
    created(){
        this.listarSubjects();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarSubjects(){
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
        },

        addSubject(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-subject', this.subject, config)
            .then(res => {
            this.listarSubjects();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.subjects = {}
        },
        eliminarSubject(id){
            this.axios.delete(`subject/${id}`)
            .then(res => {
                let index = this.subjects.findIndex( item => item._id === res.data._id )
                this.subjects.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        activarEdicionSubject(id){
            this.agregar = false;
            this.axios.get(`subject/${id}`)
            .then(res => {
                this.subjectEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarSubject(item){
            this.axios.put(`subject/${item._id}`, item)
            .then(res => {
                this.subjectEditar = {}
                this.listarSubjects();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>