import type { Socket } from 'socket.io-client'

import { rtcConfiguration } from './constants'
import type { SubscribeFunction } from './observer/observer'
import { PeerObserver } from './observer/peer-observer'
import { PeerSubject } from './observer/peer-subject'

export class Peer {
  private targetUid: string

  private connection: RTCPeerConnection

  private socket: Socket

  private peerSubject: PeerSubject

  private peerObserver: PeerObserver

  constructor(targetUid: string, socket: Socket, mediaStream?: MediaStream) {
    this.targetUid = targetUid
    this.socket = socket

    this.peerSubject = new PeerSubject()
    this.peerObserver = new PeerObserver()
    this.peerSubject.attach(this.peerObserver)

    this.connection = new RTCPeerConnection(rtcConfiguration)
    if (mediaStream) {
      this.addMediaStream(mediaStream)
    }
    this.connection.onicecandidate = this.handleCandidate(socket, targetUid)
    if (!mediaStream) {
      this.connection.ontrack = this.handleOnTrack(this.peerSubject)
    }

    this.listenOffer()
    this.listenAnswer()
    this.listenCandidate()
  }

  /**
   * -> receiver
   */
  async call() {
    this.socket.emit('call', this.targetUid)
  }

  async offer() {
    const offer = await this.connection.createOffer()
    await this.connection.setLocalDescription(offer)

    return this.socket.emit(
      'offer',
      this.targetUid,
      this.connection.localDescription
    )
  }

  private listenOffer() {
    this.socket.on(
      'offer',
      async (targetUid: string, offer: RTCSessionDescription) => {
        if (!this.matchesByUid(targetUid)) {
          return
        }

        await this.connection.setRemoteDescription(offer)
        const answer = await this.connection.createAnswer()
        await this.connection.setLocalDescription(answer)

        this.socket.emit(
          'answer',
          this.targetUid,
          this.connection.localDescription
        )
      }
    )
  }

  private listenAnswer() {
    this.socket.on(
      'answer',
      async (targetUid: string, answer: RTCSessionDescription) => {
        if (!this.matchesByUid(targetUid)) {
          return
        }

        await this.connection.setRemoteDescription(answer)
      }
    )
  }

  private listenCandidate() {
    const handle =
      (connection: RTCPeerConnection) =>
      async (targetUid: string, candidate: RTCIceCandidate) => {
        if (!this.matchesByUid(targetUid)) {
          console.log('888')
          return
        }

        console.log('999')
        connection.addIceCandidate(new RTCIceCandidate(candidate))
      }

    this.socket.on('candidate', handle(this.connection))
  }

  private handleCandidate(socket: Socket, targetUid: string) {
    console.log(`handleCandidate, `)
    return (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        socket.emit(`candidate`, targetUid, event.candidate)
      }
    }
  }

  private matchesByUid(uid: string): boolean {
    return this.targetUid === uid
  }

  addMediaStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      if (track.kind === 'video') this.connection.addTrack(track, stream)
    })
  }

  private handleOnTrack(peerSubject: PeerSubject) {
    return (event: RTCTrackEvent) => {
      console.log(`mediaStream, length: ${event.streams.length}`)
      peerSubject.setData(event.streams[0])
    }
  }

  subscribe(fn: SubscribeFunction<MediaStream>) {
    this.peerObserver.subscribe(fn)
  }
}

export function listenCall(
  socket: Socket,
  temp: Map<string, Peer>,
  mediaStream: MediaStream
) {
  socket.on('call', (targetUid: string) => {
    console.log(`listen call, targetUid: ${targetUid}`)
    const peer = new Peer(targetUid, socket)
    temp.set(targetUid, peer)
    peer.addMediaStream(mediaStream)
    peer.offer()
  })
}

export default Peer

/**
 * candidate 가 문제다.... addIceCandidate 부분에서 어디로 호출해야하는지 모르겠음
 */
