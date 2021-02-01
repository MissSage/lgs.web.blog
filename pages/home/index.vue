<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">DDM</h1>
        <p>Your sadness,My happiness.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-12">
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.id"
          >
            <div class="article-meta">
              <!-- <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link> -->
              <div class="info">
                <!-- <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link> -->
                <span class="date">{{
                  article.bCreateTime | date("MMM DD, YYYY")
                }}</span>
              </div>
              <!-- <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button> -->
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.bID,
                },
              }"
            >
              <h1>{{ article.btitle }}</h1>
              <p>{{ article.bRemark }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles } from "@/api/article"
import { mapState } from "vuex";

export default {
  name: "HomeIndex",
  async asyncData(context) {
    let articles = [],
    query={
      id:'',
      page : 1,
      pageSize : 50,
      key : "",
      bcategory : "技术博文"
    }
    const { data } = await await getArticles(query)
    articles = data.response.data
    return {
      articles
    }
  },
  computed: {
    ...mapState(["user"]),
  }
};
</script>

<style>
</style>
