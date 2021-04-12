<template>
<v-container class="pa-0">
   <v-row justify="center">
      <v-col cols="12" sm="9" md="7" lg="6" xl="4" class="pa-0">
        <div
          v-if="count > comments.length"
          class="pa-0 mb-1 text-body-2 blue--text" 
          style="cursor: pointer;"
          @click="getOlderComments">View {{ count - comments.length }} previous {{ (count - comments.length) > 1 ? 'comments' : 'comment' }}
        </div>
        <span v-for="comment in comments" :key="comment.id">
          <v-hover v-slot="{ hover }">
            <v-container class="pa-0 mb-1">
              <v-row justify="start">
                  <v-col cols="3" sm="3" md="3" lg="4" xl="3" class="pa-0 px-0 pl-sm-5 pl-xl-10">
                    <v-img 
                      :src="comment.user.avatar" 
                      class="avatar" 
                      :class="comment.user.avatar ? 
                      null: 'no-avatar'" 
                      aspect-ratio="1" 
                      width="60px"
                      style="cursor: pointer"
                      @click="$router.push({ name: 'Photos', params: { username: comment.fk_username, album: 'all' } }).catch(() => {})">
                      <v-icon v-if="!comment.user.avatar" size="60px" class="no-avatar-icon">
                        mdi-account
                      </v-icon>
                    </v-img>
                  </v-col>
                  <v-col cols="8" sm="9" md="9" lg="8" xl="9" align-self="center" class="px-0 pr-sm-5 pr-xl-10">
                    <v-container class="pa-0">
                      <v-row justify="start">
                        <v-col cols="7" sm="7" md="7" class="pa-0" align-self="center" style="text-align: start">
                          <span 
                            class="text-body-1 font-weight-bold blue--text pa-0"
                            style="cursor: pointer"
                            @click="$router.push({ name: 'Photos', params: { username: comment.fk_username, album: 'all' } }).catch(() => {})">
                            {{ comment.fk_username }}
                          </span> 
                          <span class="text-body-2 grey--text text--darken-2 pa-0 ml-2"><timeago :datetime="comment.createdAt"></timeago></span>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-fade-transition>
                          <v-col cols="1" class="pa-0" v-show="hover && comment.fk_username !== user.username">
                            <v-icon size="20px" @click="reply(comment.fk_username)" style="cursor: pointer">
                              mdi-reply
                            </v-icon>
                          </v-col>
                        </v-fade-transition>
                      <v-fade-transition>
                        <v-col cols="1" class="pa-0" v-show="hover && comment.fk_username === user.username">
                          <v-icon size="20px" @click="deleteComment(comment.id)" style="cursor: pointer">
                            mdi-delete
                          </v-icon>
                        </v-col>
                      </v-fade-transition>
                      </v-row>
                      <v-row justify="start">
                        <v-col cols="12" sm="12" md="12" class="pa-0" style="text-align: start; word-wrap: break-word;">
                          <span v-if="comment.replyTo" class="text-body-2 blue--text">{{ comment.replyTo }}</span>
                          <span class="text-body-2">
                            {{ comment.text }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
            </v-container>
          </v-hover> 
        </span>
        <v-container class="pa-0 pb-3">
            <v-row justify="start">
              <v-col cols="3" sm="3" md="4" lg="4" xl="3" class="pa-0 px-0 pl-sm-5 pl-xl-10">
                <v-img :src="user.avatar" class="avatar" :class="user.avatar ? null: 'no-avatar'" aspect-ratio="1" width="60px">
                  <v-icon v-if="!user.avatar" size="60px" class="no-avatar-icon">
                    mdi-account
                  </v-icon>
                </v-img>
              </v-col>
              <v-col cols="8" sm="9" md="8" lg="8" xl="9" align-self="center" class="px-0 pr-sm-5 pr-xl-10 pb-1">
                <v-container class="pa-0">
                  <v-row justify="start">
                    <v-col cols="12" align-self="center" class="pa-0">
                      <v-form>
                        <v-textarea
                          @focus="focused"
                          @blur="unfocused"
                          outlined
                          no-resize
                          dense
                          maxlength="100"
                          hide-details
                          :placeholder="!replyTo ? 'Add a comment' : null"
                          height="120px"
                          v-model="newComment"
                          append-icon="mdi-send"
                          :prefix="replyTo"
                          ref="commentText"
                          @click:append="submit()"
                        ></v-textarea>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container> 
      </v-col>
   </v-row>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import CommentService from '@/services/CommentService'
import { Cloudinary } from 'cloudinary-core'
export default {
  props: [
    'image'
  ],
  data () {
    return {
      comments: [],
      count: 0,
      newComment: '',
      replyTo: null,
      replyCommentLenghtZero: false,
      oldestDate: null,
      textFocused: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    '$route.params.id': async function() {
      this.count = 0
      this.comments = []
      await this.getComments()
      this.replyTo = null
      this.newComment = ''
      this.replyCommentLenghtZero = false
      this.$refs.commentText.blur()
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    await this.getComments()
    document.addEventListener('keyup', this.backspacePressed)
  },
  methods: {
    async getComments() {
      try {
        const { comments, count } = (await CommentService.get({ imageId: this.image.id, limit: 10 })).data
        if (comments.length > 0) {
          this.oldestDate = comments[0].createdAt
        }
        this.count = count
        this.$emit('count', count)

        this.comments = comments.map(comment => {
          if (comment.user.avatar) {
            comment.user.avatar = this.cloudinaryCore.url(`${comment.fk_username}/avatar/${comment.user.avatar}`)
          }
          return comment
        })
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to load comments.')
      }
    },
    async getOlderComments() {
      try {
        const { comments } = (await CommentService.get({
          imageId: this.image.id,
          to: this.oldestDate
        })).data
        comments.map(comment => {
          if (comment.user.avatar) {
            comment.user.avatar = this.cloudinaryCore.url(`${comment.fk_username}/avatar/${comment.user.avatar}`)
          }
          return comment
        })
        this.comments = [...comments, ...this.comments]
        return comments
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to load older comments.')
      }
    },
    focused() {
      this.textFocused = true
      this.$emit('writting', true)           
    },
    unfocused() {
      this.textFocused = false
      this.$emit('writting', false)
    },
    reply(username) {
      this.replyTo = username
      this.$vuetify.goTo(9999)
      this.replyCommentLenghtZero = true
      this.$refs.commentText.focus()
    },
    async submit() {
      if (this.newComment.length > 0) {
        try {
          const newCommentData = {
            text: this.newComment,
            imageId: this.image.id
          }
          if (this.replyTo) {
            newCommentData.replyTo = this.replyTo
          }
          const newComment = (await CommentService.create(newCommentData)).data
          newComment.user = {
            avatar: this.user.avatar
          }
          this.comments.push(newComment)
          this.newComment = ''
          this.replyTo = null
          this.$refs.commentText.blur()
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'Failed to create new comment.')
        }
      }
    },
    async deleteComment(id) {
      try {
        await CommentService.delete(id)
        this.comments = this.comments.filter(comment => comment.id !== id)
        this.count--
        this.$emit('count', this.count)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to delete comment.')
      }
    },
    backspacePressed(e) {
      if (e.keyCode === 8 && this.textFocused && this.replyTo && this.newComment.length === 0 && this.replyCommentLenghtZero) {
        this.replyTo = null
        this.replyCommentLenghtZero = false
      } else if (e.keyCode === 8 && this.textFocused && this.replyTo && this.newComment.length === 0 && !this.replyCommentLenghtZero) {
        this.replyCommentLenghtZero = true
      } else if (e.keyCode === 8 && this.textFocused && this.replyTo && this.newComment.length > 0) {
        this.replyCommentLenghtZero = false
      }
    }
  },
  destroyed() {
    document.removeEventListener('keyup', this.backspacePressed)
  }
}
</script>

<style>
.avatar {
  border-radius: 50%;
  border: 2px #2196F3 solid;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}

.no-avatar {
  border: 2px #2196F3 solid;
}

.no-avatar-icon {
  position: absolute;
  background-color: white;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
}

.v-text-field__prefix {
  color: #2196F3
}
</style>