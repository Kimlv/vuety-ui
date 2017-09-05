<template>
    <li :class="cssClass()" @click="onClick" @touchstart="onClick">
        <slot/>
    </li>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import ToggleGroup from './ToggleGroup.vue';

@Component({})
export default class ToggleOption extends Vue {

    @Prop()
    value : any;    

    cssClass(): string {
        
        let parent = <ToggleGroup> this.$parent;

        let result = "vuety-toggle-option";

        
        if (parent.getValue() == this.value) { result += " active" }

        return result;
    }

    onClick(evt : Event) {

        let parent = <ToggleGroup> this.$parent;
        parent.setValue(this.value);
    }
}
</script>

<style lang="scss">
li.vuety-toggle-option {
    cursor: pointer;
}
</style>