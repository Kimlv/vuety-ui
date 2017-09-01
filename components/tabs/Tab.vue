<template>
    <div v-if="active" class="vuety-tab" role="tabpanel">
        <slot/>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Tab extends Vue {

    @Prop({ default: "Tab" })
    title: string;

    active: Boolean = false;
}
</script>

