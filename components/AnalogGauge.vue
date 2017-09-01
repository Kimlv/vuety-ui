<template>
    <svg class="vuety-analog-gauge" viewBox="0 0 200 100">

        <circle cx="100" cy="100" r="100" fill="rgb(200,200,200)" />

        <line x1="0" y1="0" x2="-90" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" :transform="needleTransform" />
    </svg>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class AnalogGauge extends Vue {

    //########## BEGIN Props ##########
    @Prop({ default: 1 })
    max : number;

    @Prop({ default: 0 })
    min : number;

    @Prop({ default: 0 })
    value: number;
    //########## END Props ##########

    updateIntervalHandle : number;
    updateInterval_ms : number = 50;

    pNeedleAngle_deg: number = 0;

    maxAngle_deg : number = 180;

    //############### BEGIN get/set properties #################
    get needleAngle_deg() : number {
        return this.pNeedleAngle_deg;
    }

    set needleAngle_deg(v : number) {
        this.pNeedleAngle_deg = Math.max(0, Math.min(v, this.maxAngle_deg));
    }

    
    get needleTransform(): string {
        return "translate(100,100) rotate(" + this.needleAngle_deg + ")";
    }
    //############### END get/set properties #################

    created() {

        if (this.max <= this.min) {
            console.warn("Vuety UI Analog Gauge: 'min' should be smaller than 'max'!");
        }

        // Set up update timer:
        this.updateIntervalHandle = window.setInterval(() => {

            let targetAngle = ((this.value - this.min) / (this.max - this.min)) * this.maxAngle_deg;

            this.needleAngle_deg += (targetAngle - this.needleAngle_deg) * 0.1;
        }, this.updateInterval_ms);
    }
}
</script>

<style lang="scss">

</style>

