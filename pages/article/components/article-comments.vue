<template>
  <div>
    <form class="card comment-form" v-if="user">
      <div class="card-block">
        <textarea
          v-model="submitForm.bContent"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <button
          :disabled="submitForm.bContent === ''"
          class="btn btn-sm btn-primary"
          @click.prevent="submiteComment"
        >
          Post Comment
        </button>
      </div>
    </form>
    <form class="card comment-form" v-else>
      <div class="card-footer">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click.prevent="toLogin"
        >
          Login to reply
        </button>
      </div>
    </form>
    <div v-if="comments.length > 0">
      <div class="card" v-for="comment in comments" :key="comment.Id">
        <div class="card-block">
          <p class="card-text">{{ comment.bContent }}</p>
        </div>
        <div class="card-footer">
          <nuxt-link
            class="comment-author"
            :to="{
              name: 'profile',
              params: {
                username: comment.Author.uID,
              },
            }"
          >
            <img
              :src="comment.Author.uPhoto || uPhoto"
              class="comment-author-img"
              alt="img"
            />
          </nuxt-link>
          &nbsp;
          <nuxt-link
            class="comment-author"
            :to="{
              name: 'profile',
              params: {
                username: comment.Author.uID,
              },
            }"
          >
            {{ comment.Author.name }}
          </nuxt-link>
          <!-- <span class="date-posted">{{ comment.CreateTime | date('MMM DD, YYYY') }}</span> -->
          <span class="date-posted">
            {{ comment.CreateTime | date('MMM DD, YYYY') }} &nbsp;
            <button
              v-if="user != null"
              type="button"
              class="btn btn-sm btn-primary"
              @click="openForm(comment.Id, comment.Id, comment.CreatorID)"
            >
              reply
            </button>
            <button
              v-else
              type="button"
              class="btn btn-sm btn-primary"
              @click.prevent="toLogin"
            >
              Login to reply
            </button>
          </span>
          <form v-if="curCommentID == comment.Id" class="card comment-form">
            <div class="card-block">
              <textarea
                v-model="submitChildForm.bContent"
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-sm btn-primary"
                @click.prevent="submiteChildComment()"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
        <div v-if="comment.Children" style="margin: 15px">
          <div
            class="card"
            v-for="child in comment.Children"
            :key="child.Id"
            style="margin: 15px"
          >
            <div v-if="child.Author">
              <div class="card-block">
                <p class="card-text">
                  <nuxt-link
                    v-if="child.CallbackUser"
                    class="comment-author"
                    :to="{
                      name: 'profile',
                      params: {
                        username: child.CallbackUser.uID,
                      },
                    }"
                  >
                    @{{ child.CallbackUser.name }}&nbsp;:
                  </nuxt-link>
                  {{ child.bContent }}
                </p>
              </div>
              <div class="card-footer">
                <nuxt-link
                  class="comment-author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: child.Author.uID,
                    },
                  }"
                >
                  <img
                  v-if="child.Author.uPhoto"
                    :src="child.Author.uPhoto"
                    class="comment-author-img"
                  />
                  <img
                  v-else
                    :src="uPhoto"
                    class="comment-author-img"
                  />
                </nuxt-link>
                &nbsp;
                <nuxt-link
                  v-if="child.Author"
                  class="comment-author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: child.Author.uID,
                    },
                  }"
                >
                  {{ child.Author.name }}
                </nuxt-link>
                <nuxt-link v-else class="comment-author">
                  {{ child.Author.uLoginName }}
                </nuxt-link>

                <span class="date-posted">
                  {{ child.CreateTime | date('MMM DD, YYYY') }} &nbsp;
                  <button
                    v-if="user"
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click.prevent="
                      openForm(comment.Id, child.Id, child.CreatorID)
                    "
                  >
                    reply
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click.prevent="toLogin"
                  >
                    Login to reply
                  </button>
                </span>
                <form v-if="curCommentID == child.Id" class="card comment-form">
                  <div class="card-block">
                    <textarea
                      v-model="submitChildForm.bContent"
                      class="form-control"
                      placeholder="Write a comment..."
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="card-footer">
                    <button
                      class="btn btn-sm btn-primary"
                      @click.prevent="submiteChildComment()"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else>
      <div class="card">
        <div class="card-block">没有评论...</div>
        <div class="card-footer">和大家一起讨论吧！</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, postComment } from '@/api/article'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uPhoto: require('../../../static/images/uPhoto.jpg'),
      curCommentID: -1, //当前点击的评论的id
      comments: [], // 评论列表
      //获取评论表列参数
      params: {
        bid: this.article.Id,
        page: 1,
        intPageSize: 20,
        isRootComment: true,
      },
      //评论表单
      submitForm: {
        bBlogID: this.article.Id,
        bContent: '',
        ParentID: -1,
        CallBackTo: -1,
        isRootComment: true,
        CreatorID: '',
      },
      //回复表单
      submitChildForm: {
        bBlogID: this.article.Id,
        bContent: '',
        ParentID: -1,
        CallBackTo: -1,
        isRootComment: false,
        CreatorID: '',
      },
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted() {
    const { data } = await getComments(this.params)
    console.log(data.response.data)
    this.comments = data.response.data
  },
  methods: {
    ...mapMutations(['setPath']),
    async submiteComment() {
      if (this.submitForm.bContent == '') {
        this.$message('Please input the content of your blog!')
      } else {
        this.submitForm.CreatorID = this.user.uID
        const { data } = await postComment(this.submitForm)
        // console.log(data)
        if (data.success) {
          this.comments.unshift(data.response)
          this.submitForm.bContent = ''
        } else {
          this.$message({
            type: 'warning',
            message: data.msg,
          })
        }
      }
    },
    async submiteChildComment() {
      if (this.submitChildForm.bContent == '') {
        this.$message('Please input the content of your blog!')
      } else {
        const { data } = await postComment(this.submitChildForm)
        // console.log(data)
        if (data.success) {
          let parentobj = this.comments.find(
            (item) => item.Id == data.response.ParentID
          )
          console.log(parentobj)
          parentobj &&
            parentobj.Children &&
            parentobj.Children.unshift(data.response)
          this.submitChildForm.bContent = ''
          this.curCommentID = -1
        } else {
          this.$message({
            type: 'warning',
            message: data.msg,
          })
        }
      }
    },
    openForm(parentcommentid, curcommontid, CreatorID) {
      console.log(CreatorID)
      this.submitChildForm.ParentID = parentcommentid
      this.curCommentID = curcommontid
      this.submitChildForm.CallBackTo = CreatorID
      this.submitChildForm.CreatorID = this.user.uID
    },
    toLogin() {
      console.log(this.$route)
      this.setPath(this.$route.path)
      this.$router.push('/login')
    },
  },
}
</script>

<style>
</style>
