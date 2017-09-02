<template>
    <svg class="vuety-analog-gauge" viewBox="0 0 200 115">

        <g transform="translate(100,100)">
            <!-- The background:-->
            <circle r="100" fill="rgb(200,200,200)" />

            <!-- ####### BEGIN The labels ####### -->
            <g v-for="marking in markings" :transform="'translate(' + marking.x + ',' + marking.y + ')'">
                <text alignment-baseline="central" font-size="13" text-anchor="middle">{{marking.v}}</text>
            </g>
            <!-- ####### END The labels ####### -->

            <text y="-25" font-size="16" font-weight="bold" text-anchor="middle">
                {{label}}
            </text>

            <!-- The needle: -->
            <line x1="0" y1="0" x2="-70" y2="0" style="stroke:rgb(200,0,0);stroke-width:3" :transform="'rotate(' + this.needleAngle_deg + ')'" />
            <circle r="8" fill="rgb(200,0,0)" />
        </g>
    </svg>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class AnalogGauge extends Vue {

    //########## BEGIN Props ##########
    @Prop({ default: "" })
    label : string;

    @Prop({ default: 1 })
    max: number;

    @Prop({ default: 0 })
    min: number;

    @Prop({ default: 0 })
    value: number;
    //########## END Props ##########

    updateIntervalHandle: number = -1;
    updateInterval_ms: number = 50;

    needleAngle_deg: number = 0;

    cfg_maxAngle_deg: number = 180;
    cfg_minAngle_deg: number = 0;
    cfg_numLabelSteps: number = 10;
    cfg_labelRadius: number = 83;


    @Watch('value')
    onValueChange(n: number, o: number) {

        // Set up update timer if it isn't already set up:
        if (this.updateIntervalHandle == -1) {
            this.updateIntervalHandle = window.setInterval(this.updateNeedle, this.updateInterval_ms);
        }
    }

    //############### BEGIN get/set properties #################
    get markings(): Array<any> {

        let result = new Array();

        let stepSize = (this.max - this.min) / this.cfg_numLabelSteps;
        for (let ii = this.min; ii <= this.max; ii += stepSize) {

            let a = (this.cfg_minAngle_deg + this.getPercent(ii) * (this.cfg_maxAngle_deg - this.cfg_minAngle_deg)) * (Math.PI / 180.0);

            result.push({
                x: -Math.cos(a) * this.cfg_labelRadius,
                y: -Math.sin(a) * this.cfg_labelRadius,
                v: ii
            });
        }

        return result;
    }
    //############### END get/set properties #################

    created() {

        this.needleAngle_deg = this.cfg_minAngle_deg;

        if (this.max <= this.min) {
            console.warn("Vuety UI Analog Gauge: 'min' should be smaller than 'max'!");
        }

        // NOTE: Initial set-up of the update interval is required, 
        // the @Watch('value') is not enough!
        this.updateIntervalHandle = window.setInterval(this.updateNeedle, this.updateInterval_ms);
    }

    getPercent(v: number): number {
        return ((v - this.min) / (this.max - this.min));
    }

    updateNeedle() {

        let targetAngle_deg = this.cfg_minAngle_deg + this.getPercent(this.value) * (this.cfg_maxAngle_deg - this.cfg_minAngle_deg);

        let diff = targetAngle_deg - this.needleAngle_deg;

        if (Math.abs(diff) < 0.1) {
            this.needleAngle_deg = targetAngle_deg;

            // Clear update interval:
            window.clearInterval(this.updateIntervalHandle);
            this.updateIntervalHandle = -1;
        }
        else {
            this.needleAngle_deg += diff * 0.1;
        }
    }
}
</script>

<style lang="scss">

</style>

