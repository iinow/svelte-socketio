<script lang="ts">
import { v4 as uuidV4 } from 'uuid'
import { onMount, tick } from 'svelte'

import {
  client,
  joinRoom,
  User,
  offer,
  candidate,
  OfferReq,
} from '~/store/socket'
import UserCard from '~/lib/UserCard.svelte'
import { getRoomIds } from '~/service/api'

let roomIds: string[] = []
let selectedRoomId: string
let uuid: string
let name: string
let elName: HTMLInputElement
let mediaStream: MediaStream = null
let audioMediaDevice: MediaDeviceInfo
let videoMediaDevice: MediaDeviceInfo
let userInRoom: User[] = []
const mapUserInRoom = new Map<string, RTCPeerConnection>()
let myUserCard: UserCard

type MediaDeviceKindType = 'audioinput' | 'videoinput'

// audio media devices
let audioMediaDeviceInfos: MediaDeviceInfo[] = []

// video media devices
let videoMediaDeviceInfos: MediaDeviceInfo[] = []

const config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
}

/**
 * 사용 가능한 미디어 장비 리스트 조회
 */
async function getMediaDevices(mediaDeviceKindType: MediaDeviceKindType) {
  return (await navigator.mediaDevices.enumerateDevices()).filter(
    (mediaDevice) => mediaDevice.kind === mediaDeviceKindType
  )
}

/**
 * 선택한 장비 스트림 가져오기
 */
function getMediaStream() {
  // 기존 연동된 스트림 중지
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => {
      console.log(track.id, '중지 시도')
      track.stop()
    })
  }

  return navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: {
        exact: audioMediaDevice.deviceId,
      },
    },
    video: {
      deviceId: {
        exact: videoMediaDevice.deviceId,
      },
    },
  })
}

async function listenWatcher() {
  client.subscribe((socket) => {
    socket.on('watcher', async (user: User) => {
      const connect = new RTCPeerConnection(config)
      const description = await connect.createOffer()
      await connect.setLocalDescription(description)

      mapUserInRoom.set(user.uid, connect)

      // 트랙 추가
      mediaStream
        .getTracks()
        .forEach((track) => connect.addTrack(track, mediaStream))

      connect.onicecandidate = (event) => {
        console.log('listen iceCandidate', event.candidate)
        if (event.candidate) {
          candidate(selectedRoomId, user.uid, event.candidate)
        }
      }

      offer(selectedRoomId, user.uid, connect.localDescription)
    })
  })
}

function listenOffer() {
  client.subscribe((socket) => {
    socket.on('offer', async (req: OfferReq) => {
      const connection = new RTCPeerConnection(config)
      await connection.setRemoteDescription(req.description)

      const answer = await connection.createAnswer()
      await connection.setLocalDescription(answer)

      socket.emit('answer', {
        ...req,
        description: answer,
      })
    })
  })
}

function listenAnswer() {
  client.subscribe((socket) => {
    socket.on('answer', (req: OfferReq) => {
      const connection = mapUserInRoom.get(req.uuid)
      if (!connection) {
        return
      }

      connection.setRemoteDescription(req.description)
    })
  })
}

function listenCandidate() {
  client.subscribe((socket) => {
    socket.on('candidate', (uid: string, dd: RTCIceCandidate) => {
      const connection = mapUserInRoom.get(uid)
      if (!connection) {
        return
      }

      // eslint-disable-next-line no-debugger
      debugger
      connection.addIceCandidate(dd)
    })
  })
}

onMount(() => {
  uuid = uuidV4()
  client.socketId.subscribe((id) => {
    console.log(id)
  })

  // 0. 미디어 장비 조회
  getMediaDevices('audioinput').then((v) => (audioMediaDeviceInfos = [...v]))
  getMediaDevices('videoinput').then((v) => (videoMediaDeviceInfos = [...v]))

  // 0.1. 미디어 장비 스트림 연결

  // 0.2 방 목록 조회
  getRoomIds().forEach((res) => (roomIds = [...res.data]))

  // 0.3 방 접근시 접속자 정보 조회
  client.usersInRoom.subscribe((map) => {
    const arr = map.get(selectedRoomId)
    if (arr) {
      userInRoom = [...arr]
    }
  })

  listenWatcher()
  listenOffer()
  listenAnswer()
  listenCandidate()
})

// 1. 웹소켓 연결 (시그널 서버 연결)
function handleConnect() {
  elName.disabled = true
}

function setAudioMediaDevice(device: MediaDeviceInfo) {
  audioMediaDevice = device
}

function setVideoMediaDevice(device: MediaDeviceInfo) {
  videoMediaDevice = device
}

// 선택한 장비 연동 클릭 이벤트
async function setMediaStream() {
  const stream = await getMediaStream()
  mediaStream = stream
  await tick()

  myUserCard.setMediaStream(mediaStream)
}

function clickJoinRoom(roomId: string) {
  selectedRoomId = roomId
  joinRoom(roomId, { name, uid: uuid })
}
</script>

<div>
  <div>
    내 아이디: {uuid}
  </div>
  <div>
    내 이름: <input bind:value="{name}" bind:this="{elName}" /><button
      on:click="{handleConnect}"
      class="m-2 border-solid border-gray-300 border-2">연결하기</button>
  </div>
  <div>
    현재 선택한 오디오 장비: {audioMediaDevice?.label}
  </div>
  <div>
    현재 선택한 비디오 장비: {videoMediaDevice?.label}
  </div>
  <div>
    {#each audioMediaDeviceInfos as mediaDeviceInfo}
      <button
        class="m-2 border-solid border-gray-300 border-2"
        on:click="{() => setAudioMediaDevice(mediaDeviceInfo)}">
        {mediaDeviceInfo.label}
      </button>
    {/each}
  </div>
  <div>
    {#each videoMediaDeviceInfos as mediaDeviceInfo}
      <button
        class="m-2 border-solid border-gray-300 border-2"
        on:click="{() => setVideoMediaDevice(mediaDeviceInfo)}">
        {mediaDeviceInfo.label}
      </button>
    {/each}
  </div>
  <div>
    {#each roomIds as roomId}
      <button
        class="m-2 border-solid border-gray-300 border-2"
        on:click="{() => clickJoinRoom(roomId)}">
        {roomId}
      </button>
    {/each}
  </div>
</div>
<div>
  <button
    class="m-2 border-solid border-gray-300 border-2"
    on:click="{setMediaStream}">선택한 장비 연동</button>
</div>
<div class="p-2 flex space-x-4">
  {#if mediaStream !== null}
    <UserCard
      name="{name}"
      mediaProvider="{mediaStream}"
      bind:this="{myUserCard}" />
  {/if}
  {#each userInRoom as user}
    <UserCard name="{user.name}" />
  {/each}
</div>
