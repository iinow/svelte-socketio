<script lang="ts">
export let name: string
export let mediaProvider: MediaStream = null

let elVideo: HTMLVideoElement

export function setMediaStream(mediaStream: MediaStream) {
  console.log(mediaStream, '와나...', elVideo)
  elVideo.srcObject = mediaStream
}
</script>

<div
  class="pt-4 bg-white w-full md:w-56 justify-center items-center shadow px-6 py-4 flex flex-col">
  <video
    playsinline
    autoplay
    muted
    class="rounded-full h-40 w-40 object-cover"
    bind:this="{elVideo}">
  </video>
  <!-- <img
    src="https://res.cloudinary.com/moodgiver/image/upload/v1608198254/thumbnail_fashion_1_d66f5610d2.jpg"
    alt="img"
    title="img"
    class="rounded-full h-40 w-40 object-cover" /> -->
  <h4 class="mt-8 border-b-2">{name}</h4>
  <div class="mb-10 text-center capitalize">CEO</div>
</div>
