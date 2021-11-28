<script lang="ts">
import { user } from '~/store/auth'
</script>

{#if $user !== null}
  <slot />
{/if}
