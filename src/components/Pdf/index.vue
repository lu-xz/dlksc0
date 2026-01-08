<template>
  <iframe id="pdf" :src="`/pdf/web/viewer.html?file= ${pdfUrl}`" style="border:none"></iframe>
</template>
<script>
export default {
  props: {
    pdfUrl: {
      type: String,
      default: '',
      required: true
    },
  },
  methods: {
    
  },
}
</script>