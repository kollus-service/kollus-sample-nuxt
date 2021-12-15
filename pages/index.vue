<template>
  <div>
    <iframe ref="player" src="" @load="playerLoad"></iframe>
    <div>
      <label>cuid</label><input ref="cuid" type="text">
      <label>mck</label><input ref="mck" type="text">
      <label>expt</label><input ref="expt" type="number" value="60" step="10">
      <button @click="contentLoad">load content</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "index",
  head() {
    return {
      script: [
        {
          src: 'https://file.kollus.com/vgcontroller/vg-controller-client.latest.min.js',
          body: true
        }
      ]
    }
  },
  data() {
    return {
      controller: null,
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    contentLoad: function () {
      let cuid = this.$refs.cuid.value;
      let mck = this.$refs.mck.value;
      let expt = this.$refs.expt.value;
      axios.get(`/api/player?cuid=${cuid}&mck=${mck}&expt=${expt}`).then((res) => {
        this.$refs.player.src = res.data.url;
        console.log(res.data.url);
      })
    },
    playerLoad: function () {
      this.controller = window.VgControllerClient({target_window: this.$refs.player.contentWindow});
      let self = this;
      self.controller.on('ready', function () {
        console.log('ready!!!!')
      });
      self.controller.on('play', function () {
        console.log('play!!!!')
      })
      self.controller.on('pause', function () {
        console.log('pause!!!!')
      });
      self.controller.on('done', function () {
        console.log('done!!!!')
      });
      self.controller.on('progress', function (percentage, time, duration) {
        console.log(`${percentage} ${time} ${duration} `)
      });
    }
  },
  computed: {}
}
</script>

<style scoped>
iframe {
  border: none;
}
</style>