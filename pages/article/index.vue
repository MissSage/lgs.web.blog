<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.btitle }}</h1>

        <article-meta :article="article" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.bcontent"></div>
      </div>

      <hr/>

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <!-- <article-comments :article="article" /> -->

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
// import ArticleComments from './components/article-comments'

export default {
  name: 'ArticleIndex',
  async asyncData ({ params }) {
    console.log(params)
    const {data} = await getArticle(params.slug)
    console.log(data)
    const article = data.response
    const md = new MarkdownIt()
    console.log(article.bcontent)
    // article.bcontent = md.render(article.bcontent)
    console.log(article.bcontent)

    return {
      article
    }
  },
  components: {
    ArticleMeta,
    // ArticleComments
  },
  head () {
    return {
      title: `${this.article.btitle} - 咪咪叨`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.bRemark }
      ]
    }
  }
}
</script>

<style>
.container{
  display: block;
  width: 80%;
  height: 100%;
}
</style>
