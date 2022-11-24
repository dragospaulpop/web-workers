<template>
  <v-app>
    <v-main>
      <v-progress-linear
        indeterminate
        color="primary"
        height="100">
      </v-progress-linear>
      <v-btn @click="compute">Compute</v-btn>
      <p>Result: {{ result }}</p>
      <v-btn @click="readXlsx">Read Excel</v-btn>
      <p>Result: {{ json }}</p>

      <form ref="form" style="display: none">
        <input type="file" ref="file" @change="fileSelected" accept=".xlsx">
      </form>
    </v-main>
  </v-app>
</template>

<script>
import { read, utils } from 'xlsx'
export default {
  name: 'App',

  data: () => ({
    result: null,
    worker: null,
    json: null
  }),

  methods: {
    compute () {
      this.worker.postMessage({ count: 10000 })
    },

    readXlsx () {
      this.$refs.file.click()
    },
    async fileSelected () {
      const file = this.$refs.file.files[0]
      this.$refs.form.reset()
      this.$refs.file.value = null
      const fileAsArrayBuffer = await this.readFileAsArrayBuffer(file)
      const wb = read(fileAsArrayBuffer, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const json = utils.sheet_to_json(ws)

      this.json = json
    },

    readFileAsArrayBuffer (file) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
          resolve(e.target.result)
        }
        reader.readAsArrayBuffer(file)
      })
    }
  },

  mounted () {
    this.worker = new Worker(new URL('./workers/primes.worker.js', import.meta.url))
    this.worker.onmessage = evt => {
      const { result } = evt.data
      this.result = result
    }
  }
}
</script>
