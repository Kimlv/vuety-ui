<template>
    <div class="vuety-day-month-picker">
        <span class="field" @click="onClick">{{day}}.{{month+1}}</span>
        <div ref="popup" class="popup">
            <vt-month-dropdown ref="monthDropdown" :month="month" @monthChange="onMonthChange" />
            <vt-days-table :year="year" :month="month" :day="day" @change="onDayChange" />
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import MonthDropdown from './MonthDropdown.vue'
import DaysTable from './DaysTable.vue'


@Component({

    components: {
        'vt-days-table': DaysTable,
        'vt-month-dropdown': MonthDropdown
    },

    props: {
        
    }
})
export default class DayMonthPicker extends Vue {

    month: number = 0;
    year: number = 2017;
    day: number = 10;


    // ATTENTION: This must NOT be a property!!!
    getDate(): Date {
        return new Date(this.year, this.month, this.day);
    }

    mounted() {

        let date = new Date(Date.now());

        this.month = date.getMonth();
        this.year = date.getFullYear();
        this.day = date.getDate();
    }

    onClick() {

        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'block';
    }

    onDayChange(evt: any) {
        this.day = evt.day;

        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'none';

        this.$emit('change', {date : this.getDate()});
    }

    onMonthChange(evt: any) {
        this.month = evt.month;

        this.$emit('change', {date : this.getDate()});
    }

}
</script>

<style lang="scss">
div.vuety-day-month-picker {

    

    // NOTE: 'inline-block' (as opposed to 'inline') is required
    // to set the horizontal position of the absolutely positioned popup to
    // the horizontal position of the "input field"
    display: inline-block;
    

    span.field {
        background-color:#fff;
        border: 2px inset;        
        padding: 2px;
    }
    div.popup {
        position:absolute;
        
        display: none;
        background-color: #fff;
        border: 1px solid #000;
        padding: 16px;
        z-index: 99;
        box-shadow: 2px 2px 4px #000;

        select.vuety-month-dropdown {
            margin-bottom: 12px;
        }
    }
}
</style>