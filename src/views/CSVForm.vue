<template>
<div class="container">
    <!--<vue-csv-import v-model="parseCsv" :map-fields="{
        id: 'id', 
        group: 'group', 
        teacher: 'teacher', 
        assignature: 'assignature', 
        classroom: 'classroom', 
        weekday: 'weekday', 
        interval: 'interval'
    }">
    </vue-csv-import>-->

    <vue-csv-import
        v-model="parseCsv"
        url=""
        :map-fields="['id', 'group', 'teacher', 'assignature', 'classroom', 'weekday', 'interval']"
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
            <button @click.prevent="load">load!</button>
        </template>

        <vue-csv-submit v-slot="{submit}">
            <button @click.prevent="submit()">Submit!!</button>
        </vue-csv-submit>

    </vue-csv-import>
    <v-btn
            color="error"
            class="mx-2"
            @click.stop="submit()"
        >Add</v-btn>
    </div>
</template>

<script>
import { VueCsvImport } from 'vue-csv-import';
import { mapState } from 'vuex';
export default {
    name: 'CSVForm',
    data() {
        return {
            parseCsv: null,
        };
    },
    components: {
        VueCsvImport
    },
    computed: {
        ...mapState(['token'])
    },
    methods: {
        submit(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('csv-load', this.parseCsv, config)
            .then(res => {
                //this.listIntervals();
                console.log('OK!!!')
            })
            .catch( e => {
                console.log(e.response);
            })
            this.parseCsv = null
        },
    }
}
</script>