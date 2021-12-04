<script lang="ts">
import Peer from 'peerjs'
import { from } from 'rxjs'
import { onMount } from 'svelte'

import UserAudioStatusView from '~/lib/UserAudioStatusView.svelte'
import Map from '~/lib/Map.svelte'
import { _ } from '~/config/i18n'
import { joinRoom, client } from '~/store/socket'
import { postRoom, getRoomIds, getUserIds } from '~/service/api'

let roomId: string
let peer: Peer
let mySocketId: string
let targetSocketId: string
let message: string
let targetConnection: Peer.DataConnection
let elAudio: HTMLVideoElement
let elAudio2: HTMLVideoElement

onMount(() => {
  console.log(navigator.mediaDevices)
  client.socketId.subscribe((socketId) => {
    if (socketId) {
      console.log(`들어옴, ${socketId}`)
      mySocketId = socketId
      peer = new Peer(mySocketId)
      peer.on('open', (id) => console.log(`peer open ${id}`))
      peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          console.log(data)
        })
      })
      peer.on('call', (call) => {
        console.log('전화왔쑝,', call)
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            call.answer(stream)
            call.on('stream', (remoteStream) => {
              console.log('여기에 모 오나?')
              elAudio2.srcObject = remoteStream
              elAudio2.play()
            })
          })
      })
    }
  })
})

function handleCreateRoom() {
  postRoom().subscribe((res) => (roomId = res.data.roomId))
}

function handleGetRoom() {
  getRoomIds().subscribe((res) => console.log(res.data))
}

function handleJoinRoom() {
  joinRoom(roomId)
}

function handleGetUserIds() {
  getUserIds().subscribe((res) => console.log(res.data))
}

function openAudio() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      const call = peer.call(targetSocketId, stream)
      call.on('stream', (remoteStream) => {
        elAudio.srcObject = remoteStream
        elAudio.play()
      })
    })
}

function connectPeer() {
  targetConnection = peer.connect(targetSocketId)
}

function sendMessageToPeer() {
  targetConnection.send(message)
}

function handleEchoAudio() {
  from(navigator.mediaDevices.getUserMedia({ audio: true })).forEach(
    (stream) => {
      elAudio.srcObject = stream
      elAudio.play()
    }
  )
}
</script>

<UserAudioStatusView />
<h1>{$_('title')}</h1>
<button on:click="{handleCreateRoom}">방 생성</button>
<button on:click="{handleGetRoom}">방 조회</button>
<input type="text" placeholder="방 아이디" bind:value="{roomId}" />
<button on:click="{handleJoinRoom}">enter room</button>
<button on:click="{openAudio}">오디오 열기</button>
<button on:click="{handleGetUserIds}">사용자 아이디 가져오기</button>
<span>
  <div>내 아이디: {mySocketId}</div>
  <div>
    상대방 아이디: <input bind:value="{targetSocketId}" />
    <button on:click="{connectPeer}">연결</button>
  </div>
  <div>
    메시지: <input bind:value="{message}" />
    <button on:click="{sendMessageToPeer}">전송</button>
  </div>
</span>
<div>
  <!-- <audio bind:this="{elAudio}"></audio>
  <audio bind:this="{elAudio2}"></audio> -->
  <video bind:this="{elAudio}" class="h-60 w-60"></video>
  <video bind:this="{elAudio2}" class="h-60 w-60"></video>
  <button on:click="{handleEchoAudio}">오디오 echo</button>
</div>
<Map />
