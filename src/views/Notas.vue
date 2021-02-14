<template>
    <div class="container">
        
        <v-form
            v-if="agregar"
            @submit.prevent="agregarNota(nota)"
            id="form-nueva-nota"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva Nota</h3>
            <v-text-field
                v-model="nota.nombre"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="nota.descripcion"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nueva-nota"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="editarNota(notaEditar)"
            id="form-editar-nota"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva Nota</h3>
            <v-text-field
                v-model="notaEditar.nombre"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="notaEditar.descripcion"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-nota"
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
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in notas" :key="index">
                    <th scope="row">{{item.nombre}}</th>
                    <td>{{item.descripcion}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicion(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarNota(item._id)"
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
            notas: [],
            nota: {},
            agregar: true,
            notaEditar: {},
        };
    },
    created(){
        this.listarNotas();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarNotas(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('notas', config)
            .then((response) => {
                this.notas = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        agregarNota(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('nueva-nota', this.nota, config)
            .then(res => {
            // Agrega al inicio de nuestro array notas
            //this.notas.unshift(res.data);
            //Al utilizar Vuetify, la propiedad prevent se pierde, y al refrescar la página automáticamente, 
            //el objeto res deja de existir. La función no puede acceder a él, y se ha de refrescar la lista de notas de nuevo, 
            //en vez de añadir la nota nueva.
            this.listarNotas();

            // Alerta de mensaje
            //this.showAlert();
            //this.mensaje.texto = 'Notas Agregada!'
            //this.mensaje.color = 'success';
            })
            .catch( e => {
            console.log(e.response);

            // Alerta de mensaje
            //this.showAlert();
            //this.mensaje.color = 'danger';
            //this.mensaje.texto = e.response.data.error.errors.nombre.message;
            })
        this.notas = {}
        },
        eliminarNota(id){
            this.axios.delete(`nota/${id}`)
            .then(res => {
                let index = this.notas.findIndex( item => item._id === res.data._id )
                this.notas.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        activarEdicion(id){
            this.agregar = false;
            this.axios.get(`nota/${id}`)
            .then(res => {
                this.notaEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarNota(item){
            this.axios.put(`nota/${item._id}`, item)
            .then(res => {
                //let index = this.notas.findIndex( itemNota => itemNota._id === this.notaEditar._id);
                //this.notas[index].nombre = this.notaEditar.nombre;
                //this.notas[index].descripcion = this.notaEditar.descripcion;
                this.notaEditar = {}
                this.listarNotas();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>