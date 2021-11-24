<script lang="ts">
import '~/assets/css/global.css'
import Map from '~/lib/Map.svelte'
import { _ } from '~/config/i18n'
</script>

<Map />
<h1>{$_('title')}</h1>
