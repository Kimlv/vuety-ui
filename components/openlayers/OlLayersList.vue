<template>
    <div class="vuety-ol-layers-list">
        <ul v-for="(layer,index) of getLayers()">
            <li :class="'layerSettings ' + getSettingsPanelClass(layer)">
                <h3 @click="onLayerHeadingClick(layer, $event)">{{layer.get('title')}}</h3>
                <div>

                    Sichtbar:
                    <input type="checkbox" :checked="layer.getVisible()" @click="onCheckboxClick(layer, $event)" /><br/>

                    Transparenz:
                    <input type="range" min="0" max="1" step="0.01" :value="layer.getOpacity()" @input="onLayerOpacitySliderInput(layer, $event)" />
                    <br />

                    

                    <component :is="getLayerControlComponentType(layer)" :layer="layer" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import {
  Component,
  Inject,
  Model,
  Prop,
  Vue,
  Watch
} from "vue-property-decorator";

// Import OpenLayers code:
import * as ol from "openlayers";

@Component({})
export default class OlLayersList extends Vue {
  //###### BEGIN Props #######
  @Prop() map: ol.Map;
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

  getSettingsPanelClass(layer: ol.layer.Base): string {
    let lay: any = <any>layer;

    return lay.showTocPanel ? "show" : "hide";
  }

  onCheckboxClick(layer: ol.layer.Base, evt: MouseEvent) {
    let elem = <HTMLInputElement>evt.target;

    layer.setVisible(elem.checked);
  }

  onButtonFitExtentClick(layer: ol.layer.Base, evt: MouseEvent) {
    try {
      this.map.getView().fit(layer.getExtent());
    } catch (e) {}
  }

  onLayerHeadingClick(layer: ol.layer.Base, evt: MouseEvent) {
    
    let lay: any = <any>layer;

    if (typeof lay.showTocPanel == "undefined") {
      lay.showTocPanel = false;
    }

    lay.showTocPanel = !lay.showTocPanel;

    this.$forceUpdate();
  }

  onLayerOpacitySliderInput(layer: ol.layer.Base, evt: MouseEvent) {
    let elem = <HTMLInputElement>evt.target;

    let val = parseFloat(elem.value);

    if (val == 0) {
      layer.setVisible(false);
    } else {
      layer.setVisible(true);
      layer.setOpacity(val);
    }
  }
}
</script>

<style lang="scss">
div.vuety-ol-layers-list {
  > ul {
    margin: 0;
    padding: 0;

    > li {
      list-style: none;

      > div {
        padding: 8px;
      }

      > h3 {
        background-color: #e0e0e0;
        font-weight: normal;
        margin: 0;
        padding: 8px;
        padding-left: 1em;
        background-size: 0.5em;
        background-repeat: no-repeat;
        background-position: 6px;
 
        user-select:none;
        -webkit-user-select: none; /* webkit (safari, chrome) browsers */
        -moz-user-select: none; /* mozilla browsers */
        -khtml-user-select: none; /* webkit (konqueror) browsers */
        -ms-user-select: none; /* IE10+ */

        &:hover {
          background-color: #ccc;
        }
      }

      &.hide {
        > div {
          display: none;
        }

        > h3 {
          background-image: url("/images/arrow-right.svg");
        }
      }

      &.show {
        > h3 {
          background-image: url("/images/arrow-down.svg");
        }
      }
    }
  }
}
</style>