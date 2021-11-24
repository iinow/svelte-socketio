<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte'

export let url: string

const dispatch = createEventDispatcher()
let script

onMount(async () => {
  script.addEventListener('load', () => {
    dispatch('loaded')
  })

  script.addEventListener('error', () => {
    dispatch('error')
  })
})
</script>

<svelte:head>
  <script bind:this="{script}" src="{url}"></script>
</svelte:head>
