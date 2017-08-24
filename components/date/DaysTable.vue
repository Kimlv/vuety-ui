<template>
    <div class="vuety-days-table">
        <table>
            <tr>
                <th v-for="weekday in weekdaysShort">{{weekday}}</th>
            </tr>

            <tr v-for="week in weeksInMonth">
                <td v-for="day in 7" :class="dayFunc(week,day) == selectedDay ? 'selected' : ''" @click="onDayClick(dayFunc(week,day))">
                    {{getDayOfMonth(dayFunc(week,day))}}
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import * as moment from 'moment'


@Component({
    props: {

        'initDate': Date

    }
})
export default class DaysTable extends Vue {


    initDate: Date;
    pDate: Date = new Date(Date.now());

    // ATTENTION: selecteDay is no property due to date object in-place manipulation issues.
    selectedDay: number = 0;

    @Watch('initDate')
    bla(old: Date, n: Date) {
        this.date = this.initDate;
    }

    get date(): Date {
        return this.pDate;
    }

    set date(v: Date) {

     //  if (v.getFullYear() != this.pDate.getFullYear() || v.getMonth() != this.pDate.getMonth() || v.getDay() != this.pDate.getDay()) {

            this.pDate = v;

            let oDate = this.getFirstSunday();
            let d = moment(this.pDate);
            this.selectedDay = d.diff(oDate, 'days');

     
       // }
    }


    get weeksInMonth(): number {
        let month_end = this.getFirstSunday().add(35, 'days').month();

        if (this.date.getMonth() == month_end) {
            return 6;
        }
        return 5;
    }

    get weekdaysShort(): Array<string> {
        return moment.weekdaysShort();
    }

    dayFunc(week: number, weekday: number): number {
        return (week - 1) * 7 + (weekday - 1);
    }


    // ATTENTION: Defining firstDayOfMont() and getFirstSunday() as get properties won't work. 
    // Dates will be wrong, likely due to some unwanted in-place object modification.
    getFirstDayOfMonth(): any {
        return moment({ y: this.pDate.getFullYear(), M: this.pDate.getMonth(), d: 0 });
    }

    getFirstSunday() {
        return this.getFirstDayOfMonth().day("Sunday");
    }

    getDayOfMonth(monthDay: number): number {
        return this.getFirstSunday().add(monthDay, 'days').date();
    }

    mounted() {
        if (this.initDate) {
            this.date = this.initDate;
        }
    }

    onDayClick(day: number) {
        this.date = this.getFirstSunday().add(day, 'days').toDate();

               this.$emit('change', { date: this.date });
    }
}
</script>

<style lang="scss">
div.vuety-days-table {
    table {
        td {
            cursor: pointer;
            border-radius: 6px;
            padding: 4px;
            text-align: right;
        }

        td.selected {
            border: 1px solid #000;
            padding: 3px;
            background-color: #88d;
            color: #fff;
        }
        td:hover {
            background-color: #ccc;
            color: #fff;
        }
    }
}
</style>