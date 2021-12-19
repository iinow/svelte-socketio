<script lang="ts">
import { onMount } from 'svelte'

import { Peer, listenCall } from '~/common/peer'
import { client } from '~/store/socket'

let myName: string
let myVideo: HTMLVideoElement
let otherVideo: HTMLVideoElement
const map = new Map<string, Peer>()

function getMediaStream() {
  return navigator.mediaDevices.getUserMedia({ audio: true, video: true })
}

onMount(() => {
  client.subscribe(async (socket) => {
    const stream = await getMediaStream()
    listenCall(socket, map, stream)
    // myVideo.srcObject = stream
    // myVideo.play()
  })
})

function clickName(name: string) {
  myName = name
}

function call() {
  const other = ['hong', 'lee'].filter((v) => v !== myName)[0]
  client.subscribe((socket) => {
    const peer = new Peer(other, socket)
    peer.call()
    map.set(other, peer)
    peer.subscribe((stream) => {
      // const newVideo = document.createElement('video')
      // newVideo.srcObject = stream
      // document.body.appendChild(newVideo)
      // newVideo.play()
      otherVideo.srcObject = stream
      otherVideo.play()
    })
  })
}

function connect() {
  client.subscribe((socket) => {
    socket.emit('enter', myName)
  })
}
</script>

<div>
  내이름: {myName}
</div>
<div>
  <button on:click="{() => clickName('hong')}">Hong</button>
  <button on:click="{() => clickName('lee')}">Lee</button>
</div>
<div>
  <h2>내꺼</h2>
  <video bind:this="{myVideo}"> </video>
</div>
<div>
  <h2>상대방 꺼</h2>
  <video bind:this="{otherVideo}"> </video>
</div>
<div>
  <button on:click="{call}">상대방꺼 보기</button>
  <button on:click="{connect}">연결하기</button>
</div>
