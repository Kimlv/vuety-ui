
<template>
  <div class="property-grid">
    

    <table>
      <tr v-for="(value, key) in data">
        <td>{{key}}</td><td>{{value}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as ol from 'openlayers'
import OlMapView from './openlayers/OlMapView'

@Component({

  components: {

  },
  props: {


  }
})
export default class PropertyGrid extends Vue {

  data: any = {}
}
</script>

<style lang="scss">
div.property-grid {
  overflow:auto;

  table {
    border-collapse:collapse;
  width:100%;
    td {
      
      padding:4px;
    }
  }
}
</style>

