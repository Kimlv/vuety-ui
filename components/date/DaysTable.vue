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
import Vue from 'vue'
import Component from 'vue-class-component'

import * as moment from 'moment'


@Component({
    props: {
        'year': Number,
        'month': Number
    }
})
export default class DaysTable extends Vue {
    year: number;
    month: number;
    selectedDay: number = 0;


    get date(): Date {        
        return this.getFirstSunday().add(this.selectedDay, 'days').toDate();
    }

    get weeksInMonth(): number {        
        let month_end = this.getFirstSunday().add(35, 'days').month();

        if (this.month == month_end) {
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
        return moment({ y: this.year, M: this.month, d: 0 });
    }

    getFirstSunday() {
        return this.getFirstDayOfMonth().day("Sunday");
    }

    getDayOfMonth(monthDay: number): number {        
        return this.getFirstSunday().add(monthDay, 'days').date();        
    }

    onDayClick(day: number) {
        this.selectedDay = day;

        console.log(this.date);
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
            background-color: #666;
            color: #fff;
        }
        td:hover {
            background-color: #ccc;
            color: #fff;
        }
    }
}
</style>