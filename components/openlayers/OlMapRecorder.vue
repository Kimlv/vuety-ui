<template>
    <div class="vuety-ol-map-recorder">
        
        <button @click="onButtonStartClick" :disabled="recording">Start</button>
        <button @click="onButtonStopClick" :disabled="!recording">Stop</button>

        <p class="recording" v-if="recording">Aufzeichnung läuft...</p>

        <h4>Bisherige Aufzeichnungen:</h4>
        <ul v-for="(url,index) of videoUrls">
            <li><a :href="url" target="new">Video {{index + 1}}</a></li>
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

// Import OpenLayers code and CSS:
import * as ol from "openlayers";

@Component({})
export default class OlMapPanel extends Vue {
  //###### BEGIN Props #######
  @Prop() map: ol.Map;
  //###### END Props #######

  postcomposeCanvas: HTMLCanvasElement;

  recorder: any;
  recording: boolean = false;
  videoUrls: Array<string> = [];

  mounted() {
    this.map.on("postcompose", (event: any) => {
      if (this.postcomposeCanvas != event.context.canvas) {
        console.log("canvas update!");
        this.postcomposeCanvas = event.context.canvas;

        if (typeof this.recorder != "undefined") {
          this.recorder.stopRecording();
        }

        this.recorder = RecordRTC(this.postcomposeCanvas, {
          type: "canvas",
          showMousePointer: true
        });
      }
    });
  }

  onButtonStartClick(evt: MouseEvent) {
    this.recorder.reset();

    this.recorder.startRecording();
    this.recording = true;
    console.log("Recording started!");
  }

  onButtonStopClick(evt: MouseEvent) {
    this.recorder.stopRecording((url: string) => {
      this.recording = false;
      console.log(url);
      this.videoUrls.push(url);
    });

    console.log("Recording stopped!");
  }
}
</script>

<style lang="scss">
div.vuety-ol-map-recorder {
  padding: 8px;

  p.recording {
    color: #f00;
  }
}
</style>