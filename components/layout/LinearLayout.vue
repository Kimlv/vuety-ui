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

    display: flex;
    

    &.row {
        flex-direction: row;
        align-items: stretch;
        height: 100%;
    }

    &.col {
        flex-direction: column;
    }

    >* {
        aborder:4px solid #ff0;
        // 'width:100%'' is SUPER IMPORTANT here to ensure correct rendering in Firefox!!!
        width: 100%;        
    }
}
</style>