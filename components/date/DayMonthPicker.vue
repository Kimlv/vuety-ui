<template>
    <span class="vuety-day-month-picker">
        <input type="text" @click="onClick" :value="inputFieldString" readonly="true">        
        <div ref="popup" class="popup">
            <vt-month-dropdown v-model="month" />
            <vt-days-table v-model="date" @input="onDayInput" />
        </div>
    </span>
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
    @Prop({ default: function() { return new Date(Date.now()); } })
    value: Date;
    //####### END Props #######

    //################### BEGIN Computed Properties ######################
    get date(): Date {
        return this.value;
    }

    set date(v: Date) {
        this.$emit('input', v);
    }

    get inputFieldString() : string {
        return this.value.getDate() + "." +  (this.value.getMonth() +1);
    }

    get month(): number {
        return this.value.getMonth();
    }

    set month(v: number) {
         this.$emit('input', new Date(this.value.getFullYear(), v, this.value.getDate()));
    }
    //################### END Computed Properties ######################


    created() {
        this.date = new Date(this.value.getTime());
    }

    onClick() {
        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'block';
    }

    onDayInput(evt: any) {

        let popup = <HTMLDivElement>this.$refs.popup;
        popup.style.display = 'none';
    }
}
</script>

<style lang="scss">
span.vuety-day-month-picker {

    input {
        padding-left:28px;
        width:44px;

        background-image:url("calendar.svg");
        background-size:20px 20px;
        background-repeat:no-repeat;
        background-position:3px center;        
    }

    div.popup {
        position: fixed;
        left: 50%;
        top: 50%;
        
        transform: translate(-50%, -50%);


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