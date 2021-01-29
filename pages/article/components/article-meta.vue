<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.bsubmitter
      }
    }">
      <!-- <img :src="article.author.image" /> -->
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.bsubmitter
        }
      }">
        {{ article.bsubmitter }}
      </nuxt-link>
      <span class="date">{{ article.bCreateTime | date('MMM DD, YYYY') }}</span>
    </div>
    <!-- <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow Eric Simons <span class="counter">(10)</span>
    </button> -->
    &nbsp;&nbsp;
    <!-- <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">(29)</span>
    </button> -->
  </div>
</template>

<script>
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
