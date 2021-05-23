<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  required
                  v-model="postform.btitle"
                  class="form-control form-control-lg"
                  placeholder="Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  required
                  v-model="postform.digest"
                  class="form-control"
                  placeholder="Subscribe"
                />
              </fieldset>
              <fieldset class="form-group">
                <text-editor v-model="postform.bcontent"></text-editor>
              </fieldset>
              
              <fieldset class="form-group">
                <el-switch
                  v-model="postform.isPublic"
                  active-color="#13ce66"
                  inactive-color="#dcdfe6"
                  inactive-text="公开"
                >
                </el-switch>
              </fieldset>
              <fieldset class="form-group">
                
                <el-switch
                  v-model="postform.isTop"
                  active-color="#13ce66"
                  inactive-color="#dcdfe6"
                  inactive-text="置顶"
                >
                </el-switch>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  required
                  v-model="postform.bcategory"
                  class="form-control"
                  placeholder="Add a category?"
                />
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="SubmitPost"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postArticle } from "@/api/article";
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  name: "EditorIndex",
  data() {
    return {
      postform: {
        bsubmitter: 0,
        btitle: "",
        bcategory: "",
        bcontent: "",
        isPublic: true,
        isTop: false,
        digest: "",
      },
    };
  },
  created() {
    let user = this.$store.state.user;
    if (user) {
      this.postform.bsubmitter = user.uID;
    }
  },
  methods: {
    async SubmitPost() {
      const { data } = await postArticle(this.postform);
      if (data.success == true) {
        this.$message({
          message: "提交成功！",
          type: "success",
        });
        this.$router.push("/")
      } else {
        this.$message({
          message: "提交失败！",
          type: "error",
        });
      }
    },
  },
};
</script>

<style>
</style>
