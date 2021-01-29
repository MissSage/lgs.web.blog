<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script>
import {upLoadImage} from '@/api/article'
import {baseURL}from '~/Public/config'
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
      editor.create();
      editor.txt.html(this.value);
      editor.config.customUploadImg=async function(resultFiles, insertImgFn){
          console.log(resultFiles,insertImgFn)
          const fd=new FormData()
          resultFiles.forEach(element => {
            fd.append('file',element)
          });
          
          const {data} =await upLoadImage(fd)
          if(data.success==true){
            console.log(data.response)
            if(data.response&&data.response.length){
              data.response.forEach(item => {
                insertImgFn(baseURL+'/'+item.VirPath)//根据图片地址生成img标签插入富文本内容中
              });
            }
          }else{
            console.log(data)
            console.log(baseURL+'/'+ data)
          }
      }
    },
  },
};
</script>

<style>
</style>