<script lang="ts">
import { onMount } from 'svelte'

import UserAudioStatusView from '~/lib/UserAudioStatusView.svelte'
import '~/assets/css/global.css'
import Map from '~/lib/Map.svelte'
import { _ } from '~/config/i18n'
import { joinRoom } from '~/store/socket'
import { postRoom, getRoomIds } from '~/service/api'

let roomId: string

function handleCreateRoom() {
  postRoom().subscribe((res) => (roomId = res.data.roomId))
}

function handleGetRoom() {
  getRoomIds().subscribe((res) => console.log(res.data))
}

function handleJoinRoom() {
  joinRoom(roomId)
}
onMount(() => {})
</script>

<UserAudioStatusView />
<h1>{$_('title')}</h1>
<button on:click="{handleCreateRoom}">방 생성</button>
<button on:click="{handleGetRoom}">방 조회</button>
<input type="text" placeholder="방 아이디" bind:value="{roomId}" />
<button on:click="{handleJoinRoom}">방 조회</button>
<Map />
