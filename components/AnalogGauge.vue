<template>
    <svg class="vuety-analog-gauge" viewBox="0 0 200 115">

        <!--##### BEGIN Group to shift coordinate origin to needle pivot point ##### -->
        <g transform="translate(100,100)">

            <!-- The background disk:-->
            <circle class="background" r="100" />

            <!-- The number markings: -->
            <text v-for="marking in markings" class="marking" :transform="'translate(' + marking.x + ',' + marking.y + ')'">
                {{marking.v}}
            </text>

            <!-- The label: -->
            <text class="label" y="-22">
                {{label}}
            </text>

            <!-- The needle: -->
            <g class="needle" :transform="'rotate(' + needleAngle_deg + ')'">
                <polygon points="0,-7 -70,0 0,7" />
                <circle r="7" />
            </g>

        </g>
        <!--##### END Group to shift coordinate origin to needle pivot point ##### -->
    </svg>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class AnalogGauge extends Vue {

    //########## BEGIN Props ##########
    @Prop({ default: "" })
    label: string;

    @Prop({ default: 1 })
    max: number;

    @Prop({ default: 0 })
    min: number;

    @Prop({ default: 0 })
    value: number;
    //########## END Props ##########

    //######## BEGIN Configuration members #########
    cfg_maxAngle_deg: number = 180;
    cfg_minAngle_deg: number = 0;
    cfg_numMarkingSteps: number = 10;
    cfg_markingsRadius: number = 83;
    //######## END Configuration members #########

    //######## BEGIN State members #########
    updateInterval_ms: number = 50;
    needleAngle_deg: number = 0;
    //######## END State members #########

    //############### BEGIN get/set properties #################
    get markings(): Array<any> {

        let result = new Array();

        let stepSize = (this.max - this.min) / this.cfg_numMarkingSteps;
        for (let ii = this.min; ii <= this.max; ii += stepSize) {

            let a = (this.cfg_minAngle_deg + this.getFraction(ii) * (this.cfg_maxAngle_deg - this.cfg_minAngle_deg)) * (Math.PI / 180.0);

            result.push({
                x: -Math.cos(a) * this.cfg_markingsRadius,
                y: -Math.sin(a) * this.cfg_markingsRadius,
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
    }

    getFraction(v: number): number {
        return ((v - this.min) / (this.max - this.min));
    }

    @Watch('value')
    updateNeedle() {

        let targetAngle_deg = this.cfg_minAngle_deg + this.getFraction(this.value) * (this.cfg_maxAngle_deg - this.cfg_minAngle_deg);

        let diff = targetAngle_deg - this.needleAngle_deg;

        if (Math.abs(diff) < (this.max - this.min) * 0.001) {
            this.needleAngle_deg = targetAngle_deg;
        }
        else {
            this.needleAngle_deg += diff * 0.01;
            window.setTimeout(this.updateNeedle, this.updateInterval_ms);
        }
    }
}
</script>

<style lang="scss">
svg.vuety-analog-gauge {

    circle.background {
        fill: rgb(200, 200, 200)
    }

    text.marking {
        font-size: 13.5px;
        dominant-baseline: central;
        text-anchor: middle;
    }

    text.label {
        font-size: 16px;
        font-weight: bold;
        text-anchor: middle;
    }

    g.needle {
        fill: rgb(200, 0, 0)
    }
}
</style>

