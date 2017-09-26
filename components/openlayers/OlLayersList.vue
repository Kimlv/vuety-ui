<template>
    <div class="vuety-ol-layers-list">

        <ul v-for="layer of getLayers()">
            <li>
                {{layer.get('title')}} 
                <input type="checkbox" :checked="layer.getVisible()" @click="onCheckboxClick(layer, $event)" />
                <br />
                <input type="button" value="Fit Extent" @click="onButtonFitExtentClick(layer, $event)"/>
            </li>
        </ul>
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



    onCheckboxClick(layer: ol.layer.Base, evt: MouseEvent) {
       
        let val = !layer.getVisible();
        layer.setVisible(val);
    }

    onButtonFitExtentClick(layer: ol.layer.Base, evt: MouseEvent) {
       
        try {
            this.map.getView().fit(layer.getExtent());
        }
        catch(e) {
            
        }
    }
}
</script>

<style lang="scss">
div.vuety-ol-map-layers-list {
    
}
</style>