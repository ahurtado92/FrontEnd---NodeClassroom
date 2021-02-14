<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit.prevent="addInterval(interval)"
            id="form-nuevo-interval"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva franja horaria</h3>
            <v-text-field
                v-model="interval.extId"
                label="extId"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="interval.periodId"
                class="my-2"
                :items="periods"
                label="Periodo"
                item-value="value"
                required
            ></v-overflow-btn>

            <TimePicker label="Init time" v-on:time="($event)=>{interval.initDate = $event}" />
            <TimePicker label="End time" v-on:time="($event)=>{interval.endDate = $event}" />

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-interval"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyInterval(intervalToEdit)"
            id="form-editar-interval"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva franja horaria</h3>
            
            <v-text-field
                v-model="intervalToEdit.extId"
                label="extId"
                required
            ></v-text-field>

            <v-overflow-btn
                v-model="intervalToEdit.periodId"
                class="my-2"
                :items="periods"
                label="Periodo"
                item-value="value"
                required
            ></v-overflow-btn>

            <TimePicker label="Init time" v-on:time="($event)=>{intervalToEdit.initDate = $event}" />
            <TimePicker label="End time" v-on:time="($event)=>{intervalToEdit.endDate = $event}" />

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
                    <th scope="col">ExtId</th>
                    <th scope="col">Periodo</th>
                    <th scope="col">initDate</th>
                    <th scope="col">endDate</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in intervals" :key="index">
                    <th scope="row">{{item.extId}}</th>
                    <td>{{item.periodId}}</td>
                    <td>{{item.initDate}}</td>
                    <td>{{item.endDate}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="editInterval(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="deleteInterval(item._id)"
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
import TimePicker from '@/components/TimePicker.vue';
export default {
    data() {
        return {
            intervals: [],
            interval: {},
            add: true,
            intervalToEdit: {},
            periods: [],
        };
    },
    components: {
      TimePicker,
    },
    created(){
        this.listPeriods();
        this.listIntervals();
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listIntervals(){
            var r = []
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('intervals', config)
            
            .then((response) => {
                response.data.forEach(evt=>{
                    r.push({
                        extId: evt.extId,
                        date: new Date(evt.date).toLocaleString(),
                        endDate: evt.endDate,
                        initDate: evt.initDate,
                        periodId: this.periods.find( pr => pr.value == evt.periodId ).text,
                        __v: evt.__v,
                        _id: evt._id,
                    })
                });
                this.intervals = r;
            })

            .catch((e)=>{
                console.log('error' + e);
            })
        },

        listPeriods(){
            let periodL = []

            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('periods', config)
            .then((response) => {
                periodL = response.data;
                periodL.forEach(evt=>{
                    this.periods.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addInterval(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-interval', this.interval, config)
            .then(res => {
                this.listIntervals();
            })
            .catch( e => {
                console.log(e.response);
            })
            this.intervals = {}
        },
        deleteInterval(id){
            this.axios.delete(`interval/${id}`)
            .then(res => {
                let index = this.intervals.findIndex( item => item._id === res.data._id )
                this.intervals.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editInterval(id){
            this.add = false;
            this.axios.get(`interval/${id}`)
            .then(res => {
                this.intervalToEdit = res.data;
                console.log(this.intervalToEdit)
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyInterval(item){
            this.axios.put(`interval/${item._id}`, item)
            .then(res => {
                this.intervalToEdit = {}
                this.listIntervals();
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