<template>
    <div class="vuety-day-month-picker">

        <span class="field" @click="onClick">{{day}}.{{month+1}}</span>
        
        <div ref="popup" class="popup">

            <vt-month-dropdown ref="monthDropdown" :preset="month" @monthChange="onMonthChange" />

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
        'preset': Number
    }
})
export default class DayMonthPicker extends Vue {




    month: number = 0;
    year: number = 2017;
    day: number = 1;


    onClick() {

let popup = <HTMLDivElement> this.$refs.popup;

popup.style.display = 'block';
    }

    onDayChange(evt: any) {
        this.day = evt.day;
        let popup = <HTMLDivElement> this.$refs.popup;

popup.style.display = 'none';
    }

    onMonthChange(evt: any) {
        this.month = evt.month;


    }

}
</script>

<style lang="scss">
div.vuety-day-month-picker {
    display:inline;

span.field {
    border:2px inset;
    display:inline;
    padding:2px;
}
    div.popup {
        position:absolute;
        display:none;
        background-color: #fff;
        border: 1px solid #000;
        padding: 16px;
        z-index:99;

        select.vuety-month-dropdown {
            margin-bottom:12px;
            
        }
    }

    
}
</style>