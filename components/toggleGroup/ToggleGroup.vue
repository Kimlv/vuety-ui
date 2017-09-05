<template>
    <ul class="vuety-toggle-group">
        <slot/>
    </ul>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import ToggleOption from './ToggleOption.vue';

@Component({})
export default class ToggleGroup extends Vue {

    //######## BEGIN Props ########
    @Prop()
    value: any;
    //######## END Props ########

    pValue: any;

    // ATTENTION: This must not be a computed property!
    getValue(): any {
        return this.pValue;
    }

    mounted() {

        if (typeof this.value != "undefined") {
            this.pValue = this.value;
        }
        else {
            if (this.$children.length > 0 && this.$children[0] instanceof ToggleOption) {
                this.setValue((<ToggleOption>this.$children[0]).value);
            }
        }
    }

    setValue(v: any) {
        this.pValue = v;

        // Redraw children (required to update the individual options' active state):
        this.$forceUpdate();

        this.$emit('change', { value: this.pValue });
    }
}
</script>

<style lang="scss"></style>

