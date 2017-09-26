<template>
    <div class="vuety-ol-layers-list">

        <ul v-for="layer of getLayers()">
            <li>
                <h3>{{layer.get('title')}}</h3>
                <div class="layerSettings">
                    <!--
                    Sichtbar <input type="checkbox" :checked="layer.getVisible()" @click="onCheckboxClick(layer, $event)" />
                    <br/>
                    -->

                    Sichtbarkeit 
                    <input type="range" min="0" max="1" step="0.01" :value="layer.getOpacity()" @input="onLayerOpacitySliderInput(layer, $event)" />
                    <br />

                    <input type="button" value="Fit Extent" @click="onButtonFitExtentClick(layer, $event)" />

<!--
                    <vt-ol-abstract-layer-control :layer="layer"/>
-->
                    <component :is="getLayerControlComponentType(layer)" :layer="layer" />
                </div>

            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'


// Import OpenLayers code:
import * as ol from 'openlayers'

import OlAbstractLayerControl from './layerControls/OlAbstractLayerControl.vue'
import WMSLayerSeriesAnimationLayerControl from './layerControls/WMSLayerSeriesAnimationLayerControl.vue'

Vue.component('vt-ol-abstract-layer-control', OlAbstractLayerControl);
Vue.component('vt-ol-wms-layer-series-animation-layer-control', WMSLayerSeriesAnimationLayerControl);

@Component({})
export default class OlLayersList extends Vue {

    //###### BEGIN Props #######
    @Prop()
    map: ol.Map;
    //###### END Props #######


    getLayers(): ol.layer.Base[] {

        if (this.map != null) {

            return this.map.getLayers().getArray();
        }
        return [];

    }

    created() {
        let layer = new ol.layer.Base({});

    }


    getLayerControlComponentType(layer : ol.layer.Base) : string {
        return "vt-ol-wms-layer-series-animation-layer-control";
        //return "vt-ol-abstract-layer-control";
    }


    onCheckboxClick(layer: ol.layer.Base, evt: MouseEvent) {

        let val = !layer.getVisible();
        layer.setVisible(val);
    }

    onButtonFitExtentClick(layer: ol.layer.Base, evt: MouseEvent) {

        try {
            this.map.getView().fit(layer.getExtent());
        }
        catch (e) {

        }
    }

    onLayerOpacitySliderInput(layer: ol.layer.Base, evt: MouseEvent) {
        let elem = <HTMLInputElement> evt.target;

        let val = parseFloat(elem.value);

        if (val == 0) {
            layer.setVisible(false);
        }
        else {
            layer.setVisible(true);
            layer.setOpacity(val);
        }

        
    }
}
</script>

<style lang="scss">
div.vuety-ol-layers-list {

    > ul {
        margin:0;
        padding:0;

        > li {
            list-style: none;

            > div {
                padding:8px;
            }

            > h3 {
                background-color:#ccc;
                font-weight:normal;
                margin:0;
                padding:8px;
            }
        }
    }
}
</style>