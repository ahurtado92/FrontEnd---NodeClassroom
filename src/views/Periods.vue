<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit.prevent="addPeriod(period)"
            id="form-nuevo-period"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo periodo lectivo</h3>
            <v-text-field
                v-model="period.name"
                label="Nombre"
                required
            ></v-text-field>

            <DatePicker label="Init date" v-on:date="($event)=>{period.initDate = $event}" />
            <DatePicker label="End date" v-on:date="($event)=>{period.endDate = $event}" />

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-period"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyPeriod(periodToEdit)"
            id="form-editar-period"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva franja horaria</h3>
            
            <v-text-field
                v-model="periodToEdit.name"
                label="Nombre"
                required
            ></v-text-field>

            <Dateicker label="Init date" v-on:date="($event)=>{periodToEdit.initDate = $event}" />
            <DatePicker label="End date" v-on:date="($event)=>{periodToEdit.endDate = $event}" />

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-interval"
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
                    <th scope="col">Fecha inicial</th>
                    <th scope="col">Fecha final</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in periods" :key="index">
                    <th scope="row">{{item._id}}</th>
                    <td>{{item.name}}</td>
                    <td>{{new Date(item.initDate).toDateString()}}</td>
                    <td>{{new Date(item.endDate).toDateString()}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="editPeriod(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="deletePeriod(item._id)"
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
import DatePicker from '@/components/DatePicker.vue';
export default {
    data() {
        return {
            periods: [],
            period: {},
            add: true,
            periodToEdit: {},
        };
    },
    components: {
      DatePicker,
    },
    created(){
        this.listPeriods();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
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

        addPeriod(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-period', this.period, config)
            .then(res => {
                this.listPeriods();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.periods = {}
        },
        deletePeriod(id){
            this.axios.delete(`period/${id}`)
            .then(res => {
                let index = this.periods.findIndex( item => item._id === res.data._id )
                this.periods.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editPeriod(id){
            this.add = false;
            this.axios.get(`period/${id}`)
            .then(res => {
                this.periodToEdit = res.data;
                console.log(this.periodToEdit)
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyPeriod(item){
            this.axios.put(`period/${item._id}`, item)
            .then(res => {
                this.periodToEdit = {}
                this.listPeriods();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
        updateTime(v,d){
            d=v;
        },
    }
};
</script>