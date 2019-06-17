<template>
    <div style="text-align: center">
      <img src="./loading.gif" style="width:40px;height:40px;">
      <p>{{_title}}</p>
    </div>
</template>

<script>
    export default {
      props: {
        title: {
          type: String,
          default: '正在载入...'
        }
      },
      data() {
        return {
          _title: ''
        }
      },
      created() {
        this._title = this.title
      }
    }
</script>

<style scoped>

</style>
