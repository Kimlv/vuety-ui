<template>
    <div class="vuety-ol-layer-control">

       Abspielgeschwindigkeit:<br/>
       <input type="range" v-model.number="layer.animationSpeed" min="-12" max="12"/> {{layer.speedUpFactor}} x
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

//import * as eb from './OlEventBus'

// Import OpenLayers code and CSS:
import * as ol from 'openlayers'



@Component({})
export default class WMSLayerSeriesAnimationLayerControl extends Vue {

    //###### BEGIN Props #######
    @Prop()
    map: ol.Map;

    @Prop()
    layer : ol.layer.Base;
    //###### END Props #######


}
</script>

<style lang="scss">
div.vuety-ol-layer-control {

    
}
</style>