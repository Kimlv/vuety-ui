<template>
    <div class="vuety-day-month-picker">
        <span class="field" @click="onClick">{{pDate.getDate()}}.{{pDate.getMonth()+1}}</span>

        <div ref="popup" class="popup">
            <vt-month-dropdown ref="monthDropdown" :month="pDate.getMonth()" @change="onMonthChange" />        
            <vt-days-table :date="pDate" :max="max" :min="min" @change="onDayChange" />
        </div>
    </div>
</template>

<script lang="ts">

// TODO: 2 Enable closing of popup with ESC key

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import MonthDropdown from './MonthDropdown.vue'
import DaysTable from './DaysTable.vue'

@Component({

    components: {
        'vt-days-table': DaysTable,
        'vt-month-dropdown': MonthDropdown
    }
})
export default class DayMonthPicker extends Vue {

    //####### BEGIN Props #######
    @Prop({default : new Date()})
    date: Date;

    @Prop()
    min : Date;

    @Prop()
    max : Date;
    //####### END Props #######
    
    pDate : Date;

    created() {
        this.pDate = new Date(this.date.getTime());
    }

    onClick() {
        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'block';
    }

    onDayChange(evt: any) {
        
        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'none';

        this.pDate = new Date(this.pDate.getFullYear(), this.pDate.getMonth(), evt.day);
        this.$forceUpdate();
        this.$emit('change', { date: this.pDate });
    }

    onMonthChange(evt: any) {                
        this.pDate = new Date(this.pDate.getFullYear(), evt.month, this.pDate.getDate());        
        this.$forceUpdate();
        this.$emit('change', { date: this.pDate });
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
        background-color: #fff;
        border: 2px inset;
        padding: 2px;
    }
    div.popup {
        position: absolute;

        display: none;
        background-color: #fff;
        border: 1px solid #000;
        padding: 16px;
        z-index: 99;
        box-shadow: 0px 0 5px rgba(0, 0, 0, 0.4);

        select.vuety-month-dropdown {
            margin-bottom: 12px;
        }
    }
}
</style>