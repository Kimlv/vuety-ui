<template>
    <select class="vuety-month-dropdown" v-model="month">
        <option v-for="(month, index) in months" v-bind:value="index">{{month}}</option>
    </select>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import * as moment from 'moment'

@Component({
    props: {
        'preset': Number
    }
})
export default class MonthDropdown extends Vue {

    preset: number;
    private pMonth: number = 0;

    get month(): number {
        return this.pMonth;
    }

    set month(v: number) {
        if (v >= 0 && v <= 11) {
            this.pMonth = v;
            this.$emit('monthChange', { month: this.month});
        }
    }

    get months(): Array<string> {

        return moment.months();
    }

    mounted() {

        if (this.preset && this.preset != this.month) {
            this.month = this.preset;            
        }
    }

    
}
</script>

