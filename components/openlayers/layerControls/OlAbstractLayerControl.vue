<template>
    <div class="vuety-ol-layer-control">

       Layer control!
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

//import * as eb from './OlEventBus'

// Import OpenLayers code and CSS:
import * as ol from 'openlayers'



@Component({})
export default class OlLayersList extends Vue {

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