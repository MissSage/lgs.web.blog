<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="handleUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { upLoadImage } from "~/api/article"
import {UpdateUser} from "~/api/user"
import { proxyRemoteUrl,proxyLocalUrl } from "~/Public/config"
import {mapState,mapMutations} from 'vuex'
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      imageUrl: "",
    };
  },
  computed:{
    ...mapState(['user']),
  },
  mounted(){
    this.imageUrl=this.user.uPhoto
    console.log(this.imageUrl)
  },
  methods: {
    ...mapMutations(['setUserPhoto']),
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    async handleUpload(options) {
      const fd = new FormData();
      fd.append("file", options.file);
      const { data } = await upLoadImage(fd);
      console.log(data);
      if (data.success == true) {
        console.log(data.response);
        if (data.response && data.response.length) {
          console.log(process.env.NODE_ENV)
          debugger
          let baseURL = process.env.NODE_ENV == "production" ? proxyRemoteUrl : proxyLocalUrl;
          console.log(baseURL)
          let mgpath=baseURL + "/" + data.response[0].VirPath;
          console.log(mgpath)
          this.imageUrl=mgpath
          this.setUserPhoto(this.imageUrl)
          
          this.UpdateUser()
          
        }else{
          console.log(',...')
        }
      } else {
        // console.log(data);
        console.log(baseURL + "/" + data);
      }
    },
    async UpdateUser(){
      const {data}=await UpdateUser(this.user)
      if(data.success){
        this.$message("上传成功")
      }
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
</style>