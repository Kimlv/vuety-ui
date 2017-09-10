<template>
    <select class="vuety-month-dropdown" v-model="month">
        <option v-for="(month, index) in months" v-bind:value="index">{{month}}</option>
    </select>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import * as moment from 'moment'

@Component({})
export default class MonthDropdown extends Vue {

    @Prop({ default: 0 })
    value: number;

    private pMonth: number = 0;

   /*
    @Watch('value')
    bla(old: Date, n: Date) {
        this.month = this.value;
    }
*/
    //################ BEGIN Computed properties #################
    get month(): number {
        return this.pMonth;
    }

    set month(v: number) {
        if (v >= 0 && v <= 11 && v != this.pMonth) {
            this.pMonth = v;
            this.$emit('input', this.pMonth);
        }
    }

    get months(): Array<string> {

        return moment.months();
    }
    //################ END Computed properties #################

    created() {
        this.month = this.value;
    }
}
</script>