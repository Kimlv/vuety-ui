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

    @Prop({ default: 0 })
    value: number;


    needleAngle_deg: number = 0;

    get needleTransform(): string {

        return "translate(100,100) rotate(" + this.needleAngle_deg + ")";
    }


    mounted() {

        window.setInterval(() => {
            this.needleAngle_deg += (this.value - this.needleAngle_deg) * 0.1;
        }, 50);
    }
}
</script>

<style lang="scss">
svg.vuety-analog-gauge {
}
</style>

