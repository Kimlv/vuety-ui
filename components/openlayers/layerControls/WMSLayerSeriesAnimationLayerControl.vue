<template>
    <div class="vuety-ol-layer-control">

       WMS animation layer control!
       {{layer.animationSpeed}}
       <input type="range" v-model.number="layer.animationSpeed" min="0" max="15"/>
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