<template>
    <select class="vuety-month-dropdown" v-model="value">
        <option v-for="(month, index) in months" v-bind:value="index">{{month}}</option>
    </select>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import * as moment from 'moment'

@Component({})
export default class MonthDropdown extends Vue {

    @Prop({ default: 0 })
    month: number;

    private pMonth: number = 0;

    @Watch('month')
    bla(old: Date, n: Date) {
        this.value = this.month;
    }

    //################ BEGIN Computed properties #################
    get value(): number {
        return this.pMonth;
    }

    set value(v: number) {
        if (v >= 0 && v <= 11 && v != this.pMonth) {
            this.pMonth = v;
            this.$emit('change', { month: this.pMonth });
        }
    }

    get months(): Array<string> {

        return moment.months();
    }
    //################ END Computed properties #################

    created() {
        this.value = this.month;
    }
}
</script>