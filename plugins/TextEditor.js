import Vue from "vue"
import wangEditor from "wangeditor"
Vue.prototype.$wangEditor = wangEditor
import editor from "@/components/TextEditor"
Vue.component("TextEditor", editor)
