<script lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { goto } from '@roxi/routify'

import { user } from '~/store/auth'

const uuid = uuidv4()
let userName: string = ''
const sprites = 'avataaars'
const avatarImage = `https://avatars.dicebear.com/api/${sprites}/${uuid}.svg`

function handleSignIn() {
  user.set({
    name: userName,
    profileImageUrl: avatarImage,
  })
  $goto('/')
}
</script>

<div
  class="w-screen h-screen overflow-hidden flex justify-center items-center bg-white">
  <div class="w-full my-2 md:w-3/5 lg:w-2/5">
    <div class="flex justify-center items-center mt-10 mb-20">
      <img src="{avatarImage}" class="h-60 w-60" />
    </div>
    <div
      class="flex my-8 mx-4 md:mx-2 border-b-2 border-gray-700 hover:border-green-800">
      <label class="self-center">
        <svg
          version="1.1"
          id="Capa_1"
          width="25px"
          height="25px"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 483.3 483.3"
          style="enable-background:new 0 0 483.3 483.3;display:inline"
          xml:space="preserve">
          <path
            d="M424.3,57.75H59.1c-32.6,0-59.1,26.5-59.1,59.1v249.6c0,32.6,26.5,59.1,59.1,59.1h365.1c32.6,0,59.1-26.5,59.1-59.1
  v-249.5C483.4,84.35,456.9,57.75,424.3,57.75z M456.4,366.45c0,17.7-14.4,32.1-32.1,32.1H59.1c-17.7,0-32.1-14.4-32.1-32.1v-249.5
  c0-17.7,14.4-32.1,32.1-32.1h365.1c17.7,0,32.1,14.4,32.1,32.1v249.5H456.4z"
          ></path>
          <path
            d="M304.8,238.55l118.2-106c5.5-5,6-13.5,1-19.1c-5-5.5-13.5-6-19.1-1l-163,146.3l-31.8-28.4c-0.1-0.1-0.2-0.2-0.2-0.3
  c-0.7-0.7-1.4-1.3-2.2-1.9L78.3,112.35c-5.6-5-14.1-4.5-19.1,1.1c-5,5.6-4.5,14.1,1.1,19.1l119.6,106.9L60.8,350.95
  c-5.4,5.1-5.7,13.6-0.6,19.1c2.7,2.8,6.3,4.3,9.9,4.3c3.3,0,6.6-1.2,9.2-3.6l120.9-113.1l32.8,29.3c2.6,2.3,5.8,3.4,9,3.4
  c3.2,0,6.5-1.2,9-3.5l33.7-30.2l120.2,114.2c2.6,2.5,6,3.7,9.3,3.7c3.6,0,7.1-1.4,9.8-4.2c5.1-5.4,4.9-14-0.5-19.1L304.8,238.55z"
          ></path>
        </svg>
      </label>
      <input
        class="w-full py-3 pl-5 md:pl-20 border-0 focus:outline-none"
        type="text"
        placeholder="홍길동"
        autocomplete="off"
        bind:value="{userName}"
        required />
    </div>
    <div class="flex justify-center items-center">
      <button
        type="button"
        class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md border border-gray-600 hover:bg-gray-50"
        on:click="{handleSignIn}">로그인</button>
    </div>
  </div>
</div>
