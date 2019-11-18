<style lang="less">
@import "../../../styles/common.less";
::-webkit-scrollbar {
  display: none;
}
.advisory {
  width: 100%;
  height: 85vh;
  display: flex;
  align-items: center;
  .adv-list {
    width: 20%;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 2px 0px 0px 2px;
    background: #fff;
    display: flex;
    flex-direction: column;
    h1 {
      color: #fff;
      background: #4354a3;
      font-size: 15px;
      font-weight: bold;
      padding: 10px 0 10px;
      border-bottom: 1px solid #e9e9e9;
      text-align: center;
    }
    .gutter-card {
      height: 100%;
      overflow: scroll;
      .gutter-card-content {
        // height: 70px;
        display: flex;
        padding: 5px 10px;
        border-bottom: 1px solid #ededed;
        &.gutter-card-content-color {
          background: #e7ebfd;
        }
        .header {
          position: relative;
          width: 60px;
          flex: 0 0 50px;
          height: 60px;
          margin-right: 14px;
          box-shadow: none;
          background: none;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
          span {
            position: absolute;
            display: inline-block;
            text-align: center;
            padding: 1px;
            width: 15px;
            height: 15px;
            border-radius: 18px;
            color: #fff;
            background: #ff0000;
            font-size: 10px;
            top: 4px;
            right: -7px;
            line-height: 14px;
          }
        }
        .content {
          // width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .content-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            div {
              display: flex;
              align-items: center;
              white-space: nowrap;
              span {
                font-size: 12px;
                &:nth-of-type(1) {
                  width: 64px;
                  overflow: hidden;
                  font-size: 16px;
                }
                &:nth-of-type(2) {
                  width: 48px;
                  font-size: 11px;
                }
                &:nth-of-type(3) {
                  width: 32px;
                  text-align: right;
                }
              }
            }
            .last-time {
              display: flex;
              align-items: center;
              height: 100%;
              background: #fff;
              position: sticky;
              right: 0;
              font-size: 12px;
              color: #cccccc;
              white-space: nowrap;
              &.last-time-color {
                background: #e7ebfd;
              }
            }
          }
          p {
            width: 50%;
            font-size: 12px;
            color: #cccccc;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
      }
    }
  }
  .adv-content {
    width: 50%;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 0px 2px 2px 0px;
    margin-left: 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .adv-content-header {
      height: 10%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e9e9e9;
      .header {
        position: relative;
        width: 50px;
        flex: 0 0 50px;
        height: 50px;
        margin-right: 14px;
        box-shadow: none;
        background: none;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
    }
    .unclick {
      position: relative;
      top: 30%;
      text-align: center;
      color: #e2e2e2;
    }
    .inquiry-online-content {
      height: 65%;
      padding: 0 20px;
      flex: 1;
      overflow: auto;
      position: relative;
      &::-webkit-scrollbar {
        display: none;
      }
      .bottom-time {
        width: 100%;
        //   position: fixed;
        background: #fff;
        bottom: 0;
        text-align: center;
        .time-btn {
          width: 50px;
          height: 50px;
          left: 872px;
          top: 833px;
          color: rgba(80, 80, 80, 1);
          background-color: rgba(24, 144, 255, 1);
          border-radius: 26px;
          font-size: 14px;
          line-height: 50px;
          box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.5);
          text-align: center;
          display: inline-block;
          color: #fff;
          margin-left: 20px;
          position: absolute;
        }
      }

      .online-content-list {
        margin: 10px 0;
        display: flex;
        img {
          width: 46px;
          height: 46px;
        }
        .list-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: 10px;
          .list-text-content {
            display: flex;
            em {
              margin-top: 15px;
              display: block;
              width: 0;
              height: 0;
              border-width: 10px 10px 10px 0;
              border-style: solid;
              border-color: transparent #e5e6ea transparent transparent; /*透明 灰 透明 透明 */
            }
            .list-text-content-cell {
              max-width: 290px;
              padding: 10px 5px;
              border-radius: 5px;
              border: 1px solid #e4e4e4;
              white-space: normal;
              word-break: break-all;
              word-wrap: break-word;
              line-height: 28px;
              background: #e5e6ea;
            }
          }
          span {
            margin-left: 10px;
          }
        }
      }

      .online-content-list.right {
        flex-direction: row-reverse;
        .list-text {
          align-items: flex-end;
          margin: 0 10px 0 0;
          .list-text-content {
            flex-direction: row-reverse;
            em {
              border-width: 10px 0 10px 10px;
              border-color: transparent transparent transparent #e4e4e4;
            }
          }
        }
        span {
          margin: 0 10px 0 0;
        }
      }
      // 聊天气泡
    }
    .online-tool {
      padding: 12px 12px 0;
      height: 200px;
      position: relative;
      border-top: 1px solid #e5e5e5;
      .text-input {
        margin-top: 10px;
        outline: none;
        height: 50%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0; /*宽对应滚动条的尺寸*/
        }
      }
      span {
        min-width: 60px;
        height: 26px;
        font-size: 13px;
        line-height: 200%;
        text-align: center;
        border-radius: 13px;
        border: 1px solid #020202;
        display: inline-block;
        margin-right: 11px;
        position: relative;
        .upload-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0;
        }
      }
      .send {
        position: absolute;
        border-radius: 5px;
        bottom: 10px;
        right: 0;
        padding: 0 27px;
        border: none;
        background: #ccbebd;
        color: #fff;
        &.active {
          background: #e64340;
        }
      }
    }
  }
}
</style>
<template>
  <div>
    <div class="advisory">
      <div class="adv-list">
        <h1>用户列表（{{chat.chatQueue.length}}）</h1>
        <div class="gutter-card gutter-card-height">
          <div class="gutter-card-content" :class="itemIndex===item.from?'gutter-card-content-color':''" v-for="(item, index) in chat.chatQueue" :key="index" @click="hanldeClick(item)">
            <div class="header">
              <img class="img-head" src="@/assets/images/head.png" alt="" />
              <span v-if="item.newNews">{{ item.newNews }}</span>
            </div>
            <div class="content">
              <div class="content-text">
                <div><span :title="item.friendName || item.nickname">{{item.friendName || item.nickname}}</span><span>&nbsp;&nbsp;{{item.helthNo}}</span><span>{{item.age}}岁</span></div>
                <span class="last-time" :class="itemIndex===item.from?'last-time-color':''">{{item.createTime | talktime}}</span>
              </div>
              <p>{{item.content}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="adv-content">
        <div class="adv-content-header">
          <div class="header">
            <img class="img-head" src="@/assets/images/head.png" alt="" v-show="itemIndex" />
          </div>
          <h2>{{friendName}}</h2>
        </div>
        <h2 class="unclick" v-show="!itemIndex">未选择聊天</h2>
        <!-- 聊天内容区域 -->
        <div class="inquiry-online-content" ref="chatContent" v-show="itemIndex">
          <ul class="online-content-warp">
            <li v-for="(item, index) in chat.historyNews" :key="index" class="online-content-list" :class="item.from != userId ? '' : 'right'">
              <img src="@/assets/images/head1.png" alt="" v-if="item.from==userId">
              <img src="@/assets/images/head.png" alt="" v-else>
              <div class="list-text">
                <div class="list-text-content">
                  <em></em>
                  <div v-html="item.content" class="list-text-content-cell"></div>
                </div>
                <span>{{item.createTime | historytime}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 聊天工具栏 -->
        <div class="online-tool" v-show="itemIndex">
          <span>
            <input class="upload-img" ref="uploadImg" type="file" accept="image/*"> 图片
          </span>
          <span>语音</span>
          <span>截图</span>
          <span>附件</span>
          <span>快捷回复</span>
          <div class="text-input" contenteditable="true" ref="inputModel" @input="changeVal"></div>
          <span class="send" @click="send" :class="inputValue ? 'active' : ''">发送</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import websocketConfig from "@/service/advisoryWebsocket.js";
import { post, put, del, patch, get } from '@/api/api'
export default {
  data() {
    return {
      itemIndex: '',
      inputValue: '',
      friendName: '',
      userId: ''
    }
  },
  computed: {
    ...mapState({
      chat: state => state.advisoryChat
    })
  },
  mounted() {
    this.userId = 1000
    this['advisoryChat/setFriendId']('')
    this.scrollBottom();
    if (!this.chat.websocket.url) {
      websocketConfig(this.userId)
    }
    this.loadFriendName()
  },
  updated() {
    this.scrollBottom();
  },
  methods: {
    ...mapActions(['advisoryChat/setFriendId', "advisoryChat/setHistoryNews", "advisoryChat/setChatQueue"]),
    hanldeClick(item) {
      this.friendName = item.friendName || item.nickname
      this.itemIndex = item.from;
      let msg = {
        cmd: 19,
        type: 1,
        fromUserId: item.from,
        userId: this.userId
      };
      this['advisoryChat/setFriendId'](item.from)
      this.chat.websocket.send(JSON.stringify(msg));
      let chatIndex = this.chat.chatQueue.findIndex(msg => msg.from == item.from);
      let arr = JSON.parse(JSON.stringify(this.chat.chatQueue));
      if (chatIndex != -1) {
        arr[chatIndex].newNews = 0;
        this["advisoryChat/setChatQueue"](arr);
      }
    },
    send() {
      this.$refs.inputModel.focus()
      if (this.inputValue == 0) {
        this.$Message.info('请输入消息');
        return;
      }
      let createTime = new Date().getTime();
      let msg = {
        // 发送消息传的数据
        from: this.userId,
        to: this.chat.friendId,
        cmd: 11,
        createTime: createTime,
        msgType: 0,
        chatType: 2,
        content: this.inputValue
      };
      // 把当前发送的消息添加到历史消息去
      let arr = JSON.parse(JSON.stringify(this.chat.historyNews));
      arr.push(msg);
      this["advisoryChat/setHistoryNews"](arr);
      this.chat.websocket.send(JSON.stringify(msg));
      this.scrollBottom()
      this.inputValue = "";
      // 清空输入框的数据
      this.$refs.inputModel.innerHTML = "";
      //插入列表最后一条消息
      let chatIndex = this.chat.chatQueue.findIndex(item => item.from == msg.to);
      let chatQueueArr = JSON.parse(JSON.stringify(this.chat.chatQueue));
      if (chatIndex != -1) {
        chatQueueArr[chatIndex].content = msg.content;
        chatQueueArr[chatIndex].createTime = msg.createTime
        this["advisoryChat/setChatQueue"](chatQueueArr);
      }
    },
    changeVal(val) {
      this.inputValue = this.$refs.inputModel.innerHTML;
    },
    async loadFriendName() {
      let arr = JSON.parse(JSON.stringify(this.chat.chatQueue))
      for (let item of arr) {
        let params = {
          id: Number(item.from)
        };
        if (!item.friendName) {
          await put('sys/sysPatient/read/detail', params).then(res => {
            if (res.code == '200') {
              item.friendName = res.data.name;
              item.age = res.data.age;
              item.nickname = res.data.nickname;
              item.helthNo = res.data.helthNo;
            }
          }).catch(err => {
            console.log(err);
          });
        }
      }
      this["advisoryChat/setChatQueue"](arr);
    },
    scrollBottom() {
      // 内容区在底部
      this.$nextTick(function () {
        var ele = this.$refs.chatContent;
        ele.scrollTop = ele.scrollHeight;
      });
    },
  },
};
</script>
