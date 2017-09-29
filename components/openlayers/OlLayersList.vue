<template>
    <div class="vuety-ol-layers-list">
        <ul v-for="layer of getLayers()">
            <li>
                <h3>{{layer.get('title')}}</h3>
                <div class="layerSettings">

                    Sichtbarkeit:
                    <input type="range" min="0" max="1" step="0.01" :value="layer.getOpacity()" @input="onLayerOpacitySliderInput(layer, $event)" />
                    <br />

                    <input type="button" value="Fit Extent" @click="onButtonFitExtentClick(layer, $event)" />

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

    getLayerControlComponentType(layer: ol.layer.Base): string {
        // TODO: 2 Make this dynamic

        let l = <any>layer;

        if (typeof l.className == "undefined") {
            return "";
        }

        return l.className + "-control";

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
        let elem = <HTMLInputElement>evt.target;

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

    >ul {
        margin: 0;
        padding: 0;

        >li {
            list-style: none;

            >div {
                padding: 8px;
            }

            >h3 {
                background-color: #ccc;
                font-weight: normal;
                margin: 0;
                padding: 8px;
            }
        }
    }
}
</style>