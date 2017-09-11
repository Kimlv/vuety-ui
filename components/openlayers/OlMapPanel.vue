<template>
    <div ref="mapDiv" class="vuety-ol-map-panel" />
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import * as eb from './OlEventBus'

// Import OpenLayers code and CSS:
import * as ol from 'openlayers'
import 'openlayers/css/ol.css'

@Component({})
export default class OlMapPanel extends Vue {

    //###### BEGIN Props #######
    @Prop()
    map: ol.Map;
    //###### END Props #######


    created() {
      
        //############ BEGIN Register map event handlers #############
        this.map.on('singleclick', this.onMapSingleclick);
        this.map.on('moveend', this.onMapMoveend);
        //############ END Register map event handlers #############

        // Workaround to fix map distortion when the map is embedded 
        // in a flex container and the parent element is resized:
        window.setInterval(() => {
            this.map.updateSize();
        }, 500);
    }


    mounted() {

        // Attach map to targe div:
        this.map.setTarget(<Element>this.$refs.mapDiv);

        eb.bus.$emit('hello', this);
    }


    onMapMoveend(evt: ol.MapBrowserEvent) {
        console.log("moveend");
        this.$emit('mapClick', evt);
    }

    onMapSingleclick(evt: ol.MapBrowserEvent) {
        console.log("click");
        this.$emit('mapClick', evt);
    }
}
</script>

<style lang="scss">
div.vuety-ol-map-panel {
    // IMPORTANT!:    
    height: 100%;
}
</style>