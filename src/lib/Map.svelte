<script lang="ts">
import LibLoader from '~/common/LibLoader.svelte'
import env from '~/config/environment'

let container: HTMLElement

function onLoaded() {
  kakao.maps.load(() => {
    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
      draggable: true,
    })
  })
}
</script>

<LibLoader url="{env().map.url}" on:loaded="{onLoaded}" />
<div bind:this="{container}" class="map"></div>

<style scoped>
.map {
  width: 100vw;
  height: 100vh;
}
</style>
