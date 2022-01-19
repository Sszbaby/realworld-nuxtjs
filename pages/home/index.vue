<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link  :to="{
                  name: 'home',
                  query: {
                    tab: 'your-feed'
                  },
                }"
                exact
                :class="{active: tab === 'your-feed'}"
                class="nav-link"> Your Feed </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link  :to="{
                  name: 'home',
                  query: {
                    tab: 'global-feed'
                  },
                }"
                exact
                :class="{ active: tab === 'global-feed' }"
                class="nav-link">Global Feed</nuxt-link>
                <!-- <a class="nav-link" :to="{
                  name: 'home',
                  query: {
                    tab: 'global-feed'
                  },
                }" href="">Global Feed</a> -->
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: tag 
                  }
                }"
                exact
                :class="{active: tab === 'tag'}"
                class="nav-link">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
                class="btn btn-outline-primary btn-sm pull-xs-right"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{
                  active: page === item
                }"
              >
                <nuxt-link
                  :to="{ 
                    name: 'home', 
                    query: { 
                      page: item, 
                      tag: $route.query.tag,
                      tab: tab
                    } 
                  }"
                  class="page-link"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link v-for="tag in tags"  :key="tag" 
              :to="{
                name: 'home', 
                query: { 
                  tag: tag,
                  tab: 'tag'
                } 
              }" class="tag-pill tag-default">{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from "@/api/article"
import { getTags } from "@/api/tag"
import { mapState } from 'vuex'
export default {
  name: "HomePage",
  async asyncData({ query, store}) {
    const limit = 3;
    const page = Number.parseInt(query.page || 1);
    const tag = query.tag
    const tab = query.tab || 'global-feed'
    const loadArticles = store.state.user && tab === 'your-feed' ? getFeedArticles : getArticles
    const [ articleData, tagsData ] = await Promise.all([loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }), getTags()])
    const { articles, articlesCount } = articleData.data
    articles.forEach(element => element.favoriteDisabled = false)
    const { data: {tags} } = tagsData
    console.log(tags)
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab
    };
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  },
};
</script>

<style>
</style>