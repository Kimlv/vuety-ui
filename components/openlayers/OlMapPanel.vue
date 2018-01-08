<template>
    <div ref="mapDiv" class="vuety-ol-map-panel" />
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

// Import OpenLayers code and CSS:
import * as ol from "openlayers";
import "openlayers/css/ol.css";

@Component({})
export default class OlMapPanel extends Vue {
  //###### BEGIN Props #######
  @Prop() map: ol.Map;
  //###### END Props #######


  created() {
    // Workaround to fix map distortion when the map is embedded
    // in a flex container and the parent element is resized:
    window.setInterval(() => {
      this.map.updateSize();
    }, 500);
  }

  mounted() {
    // Attach map to targe div:
    this.map.setTarget(<Element>this.$refs.mapDiv);    
  }
}
</script>

<style lang="scss">
div.vuety-ol-map-panel {
  // IMPORTANT!:
  height: 100%;
}
</style>