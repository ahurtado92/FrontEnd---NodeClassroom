<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit.prevent="addMaterial(material)"
            id="new-material-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Material</h3>

            <v-text-field
                v-model="material.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="material.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="material.image"
                label="Imagen"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="new-material-form"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyMaterial(materialToModify)"
            id="edit-material-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Modify material</h3>

            <v-text-field
                v-model="materialToModify.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="materialToModify.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-text-field
                v-model="materialToModify.image"
                label="Imagen"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="edit-material-form"
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
                    <tr v-for="(item, index) in materials" :key="index">
                    <th scope="row">{{item.id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.image}}</td>
                    <td>{{item.date}}</td>
                    
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="editMaterial(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="deleteMaterial(item._id)"
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
            materials: [],
            material: {},
            add: true,
            materialToModify: {},
        };
    },
    created(){
        setTimeout(() => {
            this.listMaterials();
        }, 300)
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listMaterials(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('materials', config)
            .then((response) => {
                this.materials = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addMaterial(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-material', this.material, config)
            .then(res => {
            this.listMaterials();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.materials = {}
        },
        deleteMaterial(id){
            this.axios.delete(`material/${id}`)
            .then(res => {
                let index = this.materials.findIndex( item => item._id === res.data._id )
                this.materials.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editMaterial(id){
            this.add = false;
            this.axios.get(`material/${id}`)
            .then(res => {
                this.materialToModify = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyMaterial(item){
            this.axios.put(`material/${item._id}`, item)
            .then(res => {
                this.materialToModify = {}
                this.listMaterials();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
    }
};
</script>