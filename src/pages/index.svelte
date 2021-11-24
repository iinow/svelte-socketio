<script lang="ts">
import { onMount } from 'svelte'

import UserAudioStatusView from '~/lib/UserAudioStatusView.svelte'
import '~/assets/css/global.css'
import Map from '~/lib/Map.svelte'
import { _ } from '~/config/i18n'
import '~/store/socket'
import { postRoom, getRoomIds } from '~/service/api'

function handleCreateRoom() {
  postRoom().subscribe((res) => console.log(res.data))
}

function handleGetRoom() {
  getRoomIds().subscribe((res) => console.log(res.data))
}
onMount(() => {})
</script>

<Map />
<UserAudioStatusView />
<h1>{$_('title')}</h1>
<button on:click="{handleCreateRoom}">방 생성</button>
<button on:click="{handleGetRoom}">방 조회</button>
