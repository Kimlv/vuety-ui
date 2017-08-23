
<template>
    <div class="ol-map-view">
        <div ref="mapDiv" class="map" ></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Import OpenLayers code and CSS:
import * as ol from 'openlayers'
import 'openlayers/css/ol.css'

@Component({
    props: {
        center: {},
        zoom: Number
    }
})
export default class OlMapView extends Vue {

    //###### BEGIN Props #######
    center: ol.Coordinate;
    zoom: number;
    //###### END Props #######

    map: ol.Map;



    mounted() {

        //############ BEGIN Create OpenLayers map instance #############
        this.map = new ol.Map({
            target: <Element>this.$refs.mapDiv,
            layers: [
              /*
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
                */
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat(this.center),
                zoom: this.zoom
            })
        });
        //############ END Create OpenLayers map instance #############        

        // Register map click event:
        this.map.on('singleclick', this.onMapClick);
    }

    onMapClick(evt: ol.MapBrowserEvent) {
        this.$emit('mapClick', evt);
    }
}

</script>

<style lang="scss">
div.ol-map-view {

    position:relative;
    
    div.map {
       height:100%;
    }
}
</style>

