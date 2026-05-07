<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-20 17:24:19
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-22 16:23:12
 * @FilePath: \hrsaas\src\components\ImageUpload\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-upload action="#" list-type="picture-card" :file-list="fileList" :on-preview="preview" :limit="1" :class="{disabled: fileList.length === 1}" :on-remove="remFile" :on-change="onChangeFileList" :before-upload="beforeUpload" :http-request="upload">
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showpercent" :percentage="percent" />
    <el-dialog title="预览" :visible.sync="showDialog">
      <el-row type="flex" justify="center"><img :src="imgUrl" style="width:100%" alt=""></el-row>
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDRkusiPuDBya3KPJ1Xr22tZ3LUzKftvjJ',
  SecretKey: 'PaYHl15uVuuhGbjeMs9D4h5TgiaGl5C7'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  name: 'ImgDemo',
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: null,

      // 进度条
      percent: 0,

      // 控制显示隐藏进度条
      showpercent: false
    }
  },
  methods: {
    // 点击预览图片时
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      // this.imgUrl = file.url
      // this.showDialog = true
      // console.log(file)
      this.showDialog = true
      this.imgUrl = file.url
    },

    // 点击删除图片时
    remFile(file) {
      // console.log(file)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    // 上传图片
    onChangeFileList(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList
    },

    // 文件上传之前，检查文件类型和大小
    beforeUpload(file) {
      // 限制上传类型
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // type.forEach(item => {
      //   if (file.type !== item) {
      //     this.$message.success('文件格式不对~~')
      //     return false
      //   }
      // })
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }

      // 限制上传大小
      const maxsize = 5 * 1024 * 1024

      if (file.size >= maxsize) {
        this.$message.error('文件大小超过5M了')
        return false
      }
    },

    // 进行上传操作
    upload(params) {
      console.log(params.file)
      if (params.file) {
        this.showpercent = true
        // 执行上传操作
        cos.putObject({
          Bucket: '1368-1316936729', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调

          onProgress: (params) => {
            // console.log(params)
            this.percent = (+params.percent * 100).toFixed(2)
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          if (err) return
          this.fileList.forEach(item => {
            if (item.uid === params.file.uid) {
              item.url = `https://${data.Location}`
              this.upload = true
            }
          })
          // 关闭进度条
          setTimeout(() => {
            this.showpercent = false
            this.percent = 0
          }, 1000)
        })
      }
    }

  }
}
</script>

<style lang="scss">
.disabled{
  .el-upload.el-upload--picture-card {
    display: none
  }
}
</style>
