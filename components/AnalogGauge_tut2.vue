<template>
    <svg class="analog-gauge" viewBox="0 0 200 115">

        <!--##### BEGIN Group to shift coordinate origin to needle pivot point ##### -->
        <g transform="translate(100,100)">

            <!-- The background disk:-->
            <circle class="background" r="100" />

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

    getFraction(v: number): number {
        return ((v - this.min) / (this.max - this.min));
    }

    get needleAngle_deg() : number {
        return this.getFraction(this.value) * 180;
    } 
}
</script>

<style lang="scss">
svg.analog-gauge {

    circle.background {
        fill: rgb(200, 200, 200)
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