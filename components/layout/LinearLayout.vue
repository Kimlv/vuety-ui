<template>
    <div :class="'vuety-linear-layout ' + cssClass">
        <slot/>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class LinearLayout extends Vue {

    @Prop({ default: 'col' })
    direction: string;

    get cssClass(): string {
        return this.direction == 'col' ? 'col' : 'row';
    }
}
</script>

<style lang="scss">
div.vuety-linear-layout {

    min-height:0; // ATTENTION: min-height:0 is required for "overflow:auto/scroll" on child elements to work in Firefox!!!
    align-items: stretch;
    display: flex;
    flex: 1; // Important!
    flex-basis: auto; // Important!
    height: 100%;

    &.col {
        flex-direction: column;
    }

    &.row {
        flex-direction: row;        
    }

    >* {
        flex: 1;
    }    
}
</style>