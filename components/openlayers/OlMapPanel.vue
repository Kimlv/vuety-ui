<template>
    <div ref="mapDiv" class="vuety-ol-map-panel" />
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

// Import OpenLayers code and CSS:
import * as ol from 'openlayers'
import 'openlayers/css/ol.css'

@Component({
    props: {
        lon: Number,
        lat: Number,
        zoom: Number
    }
})
export default class OlMapPanel extends Vue {

    //###### BEGIN Props #######
    lon: number;
    lat: number;
    zoom: number;
    //###### END Props #######

    map: ol.Map = new ol.Map({});

    mounted() {
        let zoom = this.zoom ? this.zoom : 1;
        let lon = this.lon ? this.lon : 0;
        let lat = this.lat ? this.lat : 0;

        //############ BEGIN Create OpenLayers map instance #############
        this.map = new ol.Map({
            target: <Element>this.$refs.mapDiv,
            layers: [

                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([lon, lat]),
                zoom: zoom
            })
        });
        //############ END Create OpenLayers map instance #############        

        // Register map click event:
        this.map.on('singleclick', this.onMapClick);


        // Workaround to fix map distortion when the map is embedded in a flex container
        // and the flexible parent element is resized:

        window.setInterval(() => {
            this.map.updateSize();
        }, 500);
    }

    onMapClick(evt: ol.MapBrowserEvent) {
        this.$emit('mapClick', evt);
    }
}
</script>