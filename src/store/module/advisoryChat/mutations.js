import {post, put, del, patch, get} from '@/api/api'
export default {
  setWebsocket(state, data) {
    state.websocket = data
  },
  async updateChatQueue(state, data) { //更新队列
    let friend = data
    // console.log(friend, 'friend')
    let chatQueue = state.chatQueue
    // console.log(chatQueue)
    let index = chatQueue.findIndex(msg => msg.from == friend.from)

    if (index != -1) {
      let obj = chatQueue[index]
      let num = state.friendId == friend.from ? 0 : chatQueue[index].newNews + (friend.newNews || 1)
      obj.newNews = num
      obj.id = friend.from
      obj.content = friend.content
      obj.createTime = friend.createTime
      chatQueue.splice(index, 1, obj);
    } else { // 添加新的队列
      if (!friend.newNews) {
        friend.newNews = 1
      }
      const params = {
          id: Number(friend.from)
      };
      await put('sys/sysPatient/read/detail', params).then(res => {
        if (res.code == '200') {
          friend.friendName = res.data.name;
          friend.age = res.data.age;
          friend.nickname = res.data.nickname;
          friend.helthNo = res.data.helthNo;
        }
      }).catch(err => {
          console.log(err);
      });
      chatQueue.unshift(friend)
    }
    state.chatQueue = chatQueue
  },
  setHistoryNews(state, data) { // 设置历史消息
    state.historyNews = data
  },
  setFriendId(state, data) {
    state.friendId = data
  },
  setChatQueue(state, data) {// 直接设置队列，同于消除红色的圆点
    state.chatQueue = data
  },
}
