<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">个人设置</h1>

          <el-form :model="user" label-position="top">
            <el-form-item label="Your Avatar">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="handleAvatarUpload"
              >
                <img
                  v-if="user && user.uPhoto"
                  :src="getFullPath(user.uPhoto)"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Your Profile BackGroundImage">
              <el-upload
                class="profile-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeProfileUpload"
                :http-request="handleProfileUpload"
              >
                <img
                  v-if="user && user.uProfileImg"
                  :src="getFullPath(user.uProfileImg)"
                  class="profile"
                />
                <i v-else class="el-icon-plus profile-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Your NickName">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user && user.name"
              />
            </el-form-item>
            <el-form-item label="Your RealName">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your RealName"
                v-model="user && user.uRealName"
              />
            </el-form-item>
            <el-form-item label="Set Your Sex">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Sex"
                v-model="user && user.sex"
              />
            </el-form-item>
            <el-form-item label="How Old Are You">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Age"
                v-model="user && user.age"
              />
            </el-form-item>
            <el-form-item label="Where You Live">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Address"
                v-model="user && user.addr"
              />
            </el-form-item>
            <el-form-item label="Say Some Thing About You">
              <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                v-model="user && user.uRemark"
              ></textarea>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            class="el-button-width-full"
            @click.prevent="UpdateUser"
          >
            Update Settings
          </el-button>
          <el-button type="info" class="el-button-width-full" @click="LogOut">
            LogOut
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { upLoadImage } from '~/api/article'
import { UpdateUser } from '~/api/user'
import { mapGetters, mapMutations } from 'vuex'
import { getFullPath } from '../../utils/utils.js'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data() {
    return {
      user: null,
    }
  },
  computed: {
    ...mapGetters({ storeUser: 'getUser' }),
  },
  methods: {
    ...mapMutations(['setUserPhoto', 'setUserProfile', 'setUser']),
    getFullPath(path) {
      return getFullPath(path)
    },
    LogOut(){
      this.$store.commit('logOut')
      this.$router.push('/')
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    beforeProfileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传主页图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleProfileUpload(options) {
      let that = this
      this.upLoadImage(options, function (response) {
        console.log(response)
        if (response && response.length) {
          that.setUserProfile(response[0].VirPath)
          console.log(that.user)
          that.UpdateUser()
        }
      })
    },
    handleAvatarUpload(options) {
      let that = this
      this.upLoadImage(options, function (response) {
        if (response && response.length) {
          that.setUserPhoto(response[0].VirPath)
          console.log(that.user)
          that.UpdateUser()
        }
      })
    },
    async upLoadImage(options, callback) {
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await upLoadImage(fd)
      if (data.success == true) {
        callback && callback(data.response)
      } else {
        this.$message({
          type: 'error',
          message: '系统错误',
        })
      }
    },

    async UpdateUser() {
      const { data } = await UpdateUser(this.user)
      if (data.success) {
        console.log(this.user)
        this.setUser(this.user)
        this.$message('上传成功')
      }
    },
  },
  mounted() {
    this.user = Object.assign({}, this.storeUser)
  },
}
</script>
<style lang="css">
.avatar-uploader .el-upload,
.profile-uploader .el-upload {
  border: 1px dashed #504e4e;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover,
.profile-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon,
.profile-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.profile-uploader-icon {
  width: 540px;
}
.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.profile {
  width: 540px;
  height: 108px;
  display: block;
}
.el-button-width-full {
  width: 100%;
}
.el-button+.el-button{
  margin: 5px 0;
}
</style>