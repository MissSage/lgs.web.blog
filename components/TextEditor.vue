<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script>
import { upLoadImage } from "@/api/article";
import { proxyRemoteUrl,proxyLocalUrl } from "~/config";
import 'highlight.js/styles/monokai.css'
import hljs from 'highlight.js'
export default {
  name: "TextEditor",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.initEditor();
  },

  methods: {
    initEditor() {
      const editor = new this.$wangEditor(this.$refs.editor);

      editor.config.onchange = (value) => {
        this.$emit("input", value);
      };
      editor.config.uploadImgMaxSize = 20 * 1024 * 1024
      editor.config.uploadImgMaxLength = 5
      editor.config.height = 500
      editor.config.placeholder = '请在此处编写您的文章'
      editor.highlight = hljs
      editor.config.customUploadImg =async function (resultFiles, insertImgFn) {
        const fd = new FormData();
        resultFiles.forEach((element) => {
          fd.append("file", element);
        });

        const { data } = await upLoadImage(fd);
        if (data.success == true) {
          console.log(data.response);
          if (data.response && data.response.length) {
            var baseURL=process.env.NODE_ENV==='production'? proxyRemoteUrl:proxyLocalUrl
            data.response.forEach((item) => {
              insertImgFn(baseURL + "/" + item.VirPath); //根据图片地址生成img标签插入富文本内容中
            });
          }
        } else {
          console.log(data);
          console.log(baseURL + "/" + data);
        }
      };
      editor.create();
      editor.txt.html(this.value);
    },
  },
};
</script>

<style>
img{
  min-width: 70%;
  margin: 10px auto;
}
</style>