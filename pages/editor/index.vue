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
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  required
                  v-model="postform.bRemark"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <text-editor v-model="postform.bcontent"></text-editor>
                <!-- <textarea class="form-control" required v-model="postform.bcontent" rows="8" placeholder="Write your article (in markdown)"></textarea> -->
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
// import TextEditor from './components/TextEditor'
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  // components:{
  //   TextEditor
  // },
  name: "EditorIndex",
  data() {
    return {
      postform: {
        bsubmitter: "",
        btitle: "",
        bcategory: "",
        bcontent: "",
        bRemark: "",
      },
    };
  },
  methods: {
    async SubmitPost() {
      let user=this.$store.state.user
      this.postform.bsubmitter=user.uLoginName
      const { data } = await postArticle(this.postform);
      if (data.success == true) {
        this.$message({
          message:"提交成功！",
          type: "success",
        });
        this.$router.push("/");
      }else{
        this.$message({
          message:"提交失败！",
          type: "error",
        });
        console.log("submit err:")
        console.log(data)
      }
    },
  },
};
</script>

<style>
</style>
