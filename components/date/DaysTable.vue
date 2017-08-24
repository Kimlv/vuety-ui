<template>
    <div class="vuety-days-table">
        <table>
            <tr>
                <th v-for="weekday in weekdaysShort">{{weekday}}</th>
            </tr>

            <tr v-for="week in weeksInMonth">
                <td v-for="day in 7">

                    <div v-if="isMyMonth(week,day)" :class="dayClass(week,day)" @click="onDayClick(dayFunc(week,day))">
                        {{getDayOfMonth(dayFunc(week,day))}}
                    </div>
                    <div v-else class="otherMonth">
                        {{getDayOfMonth(dayFunc(week,day))}}
                    </div>
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
        'year': Number,
        'month': Number,
        'day': Number
    }
})
export default class DaysTable extends Vue {

    //######## BEGIN Props ########
    year: number;
    month: number;
    day: number;
    //######## END Props ########

    pDay: number;


    get weeksInMonth(): number {
        let month_end = this.getFirstSunday().add(35, 'days').month();

        if (this.getDate().getMonth() == month_end) {
            return 6;
        }
        return 5;
    }

    get weekdaysShort(): Array<string> {
        return moment.weekdaysShort();
    }

    dayClass(week: number, day: number): string {

        let result = "thisMonth ";

        let d = moment(this.getDate());

        let diff = d.diff(this.getFirstSunday(), 'days');

        if (this.dayFunc(week, day) == diff) {
            result += " selected";
        }

        return result;
    }

    dayFunc(week: number, weekday: number): number {
        return (week - 1) * 7 + (weekday - 1);
    }

    // ATTENTION: This must NOT be a property!!!
    getDate(): Date {
        return new Date(this.year, this.month, this.pDay);
    }



    // ATTENTION: Defining firstDayOfMont() and getFirstSunday() as get properties won't work. 
    // Dates will be wrong, likely due to some unwanted in-place object modification.
    getFirstDayOfMonth(): any {
        return moment({ y: this.getDate().getFullYear(), M: this.getDate().getMonth(), d: 0 });
    }

    getFirstSunday() {
        return this.getFirstDayOfMonth().day("Sunday");
    }

    getDayOfMonth(monthDay: number): number {
        return this.getFirstSunday().add(monthDay, 'days').date();
    }


    created() {

        // NOTE: We must do this on create(), not on mounted()
        if (this.day) {
            this.pDay = this.day;
        }
    }


    isMyMonth(week: number, day: number) {

        let date = this.getFirstSunday().add(this.dayFunc(week, day), 'days').toDate();
        return date.getMonth() == this.getDate().getMonth();
    }

    onDayClick(day: number) {

        let d = this.getFirstSunday().add(day, 'days');
        this.pDay = - (this.getFirstDayOfMonth().diff(d, 'days')) + 1;

        // NOTE: $forceUpdate() is required here to update the highlighed day, since
        // this.pDay is not watched.
        this.$forceUpdate();

        // ATTENTION: We must fire the 'change' event only on manual clicking, 
        // not when the date is set from outside!
        // This prevents infinite event loops.
        this.$emit('change', { day: this.pDay, date: this.getDate() });
    }
}
</script>

<style lang="scss">
div.vuety-days-table {
    table {

        div {
            border-radius: 6px;
            padding: 4px;
            text-align: right;
        }


        div.otherMonth {
            color: #ccc;
        }

        div.selected {
            border: 1px solid #000;
            padding: 3px;
            background-color: #88d;
            color: #fff;
        }
        div.thisMonth:hover {
            cursor: pointer;
            background-color: #ccc;
            color: #fff;
        }
    }
}
</style>