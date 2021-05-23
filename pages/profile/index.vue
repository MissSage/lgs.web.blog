<template>
  <div class="profile-page">

    <div class="user-info" :style="{backgroundImage:'url('+getProfileImg(user&&user.uProfileImg)+')', backgroundSize:'cover'}">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="getFullPath(user.uPhoto)||uPhoto" class="user-img" />
            <h4>Eric Simons</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow Eric Simons
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link active" href="">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview">
            <div class="article-meta">
              <a href=""><img :src="getFullPath(user.uPhoto)||uPhoto" /></a>
              <div class="info">
                <a href="" class="author">Eric Simons</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 29
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>How to build webapps that scale</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </a>
          </div>

          <div class="article-preview">
            <div class="article-meta">
              <a href=""><img :src="getFullPath(user.uPhoto)||uPhoto" /></a>
              <div class="info">
                <a href="" class="author">Albert Pai</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 32
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline">Music</li>
                <li class="tag-default tag-pill tag-outline">Song</li>
              </ul>
            </a>
          </div>


        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {getFullPath } from '@/utils/utils.js'
import {mapGetters} from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  // async asyncData ({ params }) {
  //   // console.log(params)
  //   // const {data} = await getProfile(params.username)
  //   // const article = data.response
  //   // // const md = new MarkdownIt()
  //   // console.log(article.bcontent)
  //   // // article.bcontent = md.render(article.bcontent)
  //   // console.log(article.bcontent)

  //   return {
  //     // article
  //   }
  // },
  data(){
    return {
      uProfileImg: require('@/static/images/uProfileImg.png'),
      uPhoto: require('@/static/images/uPhoto.jpg'),
    }
  },
  computed: {
    ...mapGetters({
      user:"getUser"
    }),
  },
  methods:{
    getFullPath(path){
      return getFullPath(path)
    },
    getProfileImg(path){
      if(path){
        return getFullPath(encodeURI(path))
      }else{
        return this.uProfileImg
      }
    }
  },
}
</script>

<style>

</style>
