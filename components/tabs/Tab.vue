<template>   
    <div v-if="active" class="vuety-tab" role="tabpanel">        
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    props: {
        'title': String
    }
})
export default class Tab extends Vue {
    active: Boolean = false;
    title: string;   
}
</script>

