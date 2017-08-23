<template>
    <div class="vuety-days-table">
        <table>
            <tr>
                <th v-for="weekday in weekdaysShort">{{weekday}}</th>
            </tr>

            <tr v-for="week in weeksInMonth">
                <td v-for="day in 7">{{getDayOfMonth((week -1 )*7 + (day-1))}}</td>
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

    get weeksInMonth(): number {
        let firstDayOfMonth = moment({ y: this.year, M: this.month, d: 0 });
        // https://stackoverflow.com/questions/39213990/moment-js-get-the-sunday-before-a-given-date

        let firstSundayBefore = firstDayOfMonth.day("Sunday");
        
        let month_end = firstSundayBefore.add(35, 'days').month();
        
        if (this.month == month_end) {
            return 6;
        }
        return 5;
    }

    getDayOfMonth(monthDay: number): number {

        let firstDayOfMonth = moment({ y: this.year, M: this.month, d: 0 });
        let firstSundayBefore = firstDayOfMonth.day("Sunday");

        let day = firstSundayBefore.add(monthDay, 'days');
        return day.date();
    }



    get weekdaysShort(): Array<string> {
        return moment.weekdaysShort();
    }
}
</script>

