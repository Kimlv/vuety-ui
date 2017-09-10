<template>
    <div class="vuety-days-table">          
        <table>
            <tr>
                <th v-for="weekday in weekdaysShort()">{{weekday}}</th>
            </tr>

            <tr v-for="week in weeksInMonth()">
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

@Component({})
export default class DaysTable extends Vue {

    //######## BEGIN Props ########
    @Prop({default : function() { return new Date(Date.now());} })
    value: Date;
    //######## END Props ########

    //################ BEGIN Computed properties #################
    weeksInMonth(): number {
        let month_end = this.getFirstSunday().add(35, 'days').month();

        return (this.value.getMonth() == month_end) ? 6 : 5;
    }

    weekdaysShort(): Array<string> {
        return moment.weekdaysShort();
    }
    //################ END Computed properties #################


    dayClass(week: number, day: number): string {

        let result = "thisMonth ";

        let d = moment(this.value);

        let diff = d.diff(this.getFirstSunday(), 'days');

        if (this.dayFunc(week, day) == diff) {
            result += " selected";
        }

        return result;
    }

    dayFunc(week: number, weekday: number): number {
        return (week - 1) * 7 + (weekday - 1);
    }

    // ATTENTION: Defining firstDayOfMont() and getFirstSunday() as computed properties won't work. 
    // Dates will be wrong, likely due to some unwanted in-place object modification.
    getFirstDayOfMonth(): any {
        return moment({ y: this.value.getFullYear(), M: this.value.getMonth(), d: 0 });
    }

    getFirstSunday() {
        return this.getFirstDayOfMonth().day("Sunday");
    }

    getDayOfMonth(monthDay: number): number {
        return this.getFirstSunday().add(monthDay, 'days').date();
    }

    isMyMonth(week: number, day: number) {

        let date = this.getFirstSunday().add(this.dayFunc(week, day), 'days').toDate();

/*
        if ((this.min instanceof Date &&  date < this.min) || (this.max instanceof Date && date > this.max)) {
            return false;
        }
*/
        if (date.getMonth() != this.value.getMonth()) {
            return false;
        }

        return true;
    }

    onDayClick(day: number) {

        let d = this.getFirstSunday().add(day, 'days');
        let mday = - (this.getFirstDayOfMonth().diff(d, 'days')) + 1;

        this.$emit('input',new Date(this.value.getFullYear(), this.value.getMonth(), mday));
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