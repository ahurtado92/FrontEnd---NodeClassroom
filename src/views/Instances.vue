<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit.prevent="addInstance(instance)"
            id="new-instance-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva instancia</h3>

            <v-text-field
                v-model="instance.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="instance.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="instance.image"
                label="Imagen"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="new-instance-form"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyInstance(instanceToModify)"
            id="edit-instance-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Modify instance</h3>

            <v-text-field
                v-model="instanceToModify.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="instanceToModify.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="instanceToModify.image"
                label="Imagen"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="edit-instance-form"
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
                        <th scope="col">Imagen</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in instances" :key="index">
                    <th scope="row">{{item.id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.image}}</td>
                    <td>{{item.date}}</td>
                    
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="editInstance(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="deleteInstance(item._id)"
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
            instances: [],
            instance: {},
            add: true,
            instanceToModify: {},
        };
    },
    created(){
        this.listInstances();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listInstances(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('instances', config)
            .then((response) => {
                this.instances = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addInstance(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-instance', this.instance, config)
            .then(res => {
            this.listInstances();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.instances = {}
        },
        deleteInstance(id){
            this.axios.delete(`instance/${id}`)
            .then(res => {
                let index = this.instances.findIndex( item => item._id === res.data._id )
                this.instances.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editInstance(id){
            this.add = false;
            this.axios.get(`instance/${id}`)
            .then(res => {
                this.instanceToModify = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyInstance(item){
            this.axios.put(`instance/${item._id}`, item)
            .then(res => {
                this.instanceToModify = {}
                this.listInstances();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
    }
};
</script>