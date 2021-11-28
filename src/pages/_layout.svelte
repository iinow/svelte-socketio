<script lang="ts">
import { goto, layout } from '@roxi/routify'

import { user } from '~/store/auth'
import '~/assets/css/global.css'

let show = $layout.path === '/signIn'

if (!show) {
  show = !!$user
  if (!show) {
    $goto('/signIn')
  }
}
</script>

<slot />

<style global>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
