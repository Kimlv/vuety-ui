<template>
    <select class="vuety-month-dropdown" v-model="value">
        <option v-for="(month, index) in months" v-bind:value="index">{{month}}</option>
    </select>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import * as moment from 'moment'

@Component({
    props: {
        'month': Number
    }
})
export default class MonthDropdown extends Vue {

    month: number;
    private pMonth: number = 0;

    get value(): number {
        return this.pMonth;
    }


    @Watch('month')
    bla(old: Date, n: Date) {
        this.value = this.month;
    }

    set value(v: number) {
        if (v >= 0 && v <= 11 && v != this.pMonth) {
            this.pMonth = v;
            this.$emit('monthChange', { month: this.pMonth });
        }
    }

    get months(): Array<string> {

        return moment.months();
    }



    mounted() {

        if (this.month) {
            this.value = this.month;
        }
    }


}
</script>

