import store from '../store/index'

const websocketConfig = (id) => {
  connectWebsoket(id)
}

function connectWebsoket(id){
	var host="ws://192.168.0.31:8888/?userid="+id+"&uuid="+"123";
  let websocket = new WebSocket(host);
  store.commit('advisoryChat/setWebsocket', websocket)
	websocket.onopen = function(e){
    // console.log("lllll连接成功")
	};
	websocket.onerror = function(e){
	};
	websocket.onclose = function(e){
    store.commit('advisoryChat/setWebsocket', '')
    console.log("退出成功")
	};
	websocket.onmessage = function(evt){
    // console.log(store.state.advisoryChat.historyNews.length+"条消息!!!!!!")
    console.log("连接信息："+evt.data)
    let friend = JSON.parse(evt.data)
    console.log(friend)
    if (friend.command == 11) { // 获取好友传过来的消息
      store.commit('advisoryChat/updateChatQueue', friend.data)
      // console.log("friend"+friend.data)
      // console.log(friend.data.from, store.state.chat.friendId, "我是两个id")
      if (friend.data.from == store.state.advisoryChat.friendId) {
        // 把当前消息放在当前好友的历史消息（现在的消息）
        if (friend.data.msgType == 7)
          store.commit('advisoryChat/setPatientInfo', friend.data);
        let newsArr = JSON.parse(JSON.stringify(store.state.advisoryChat.historyNews));
        // console.log(friend.data, "我是过滤出来的")
        newsArr.push(friend.data);
        store.commit('advisoryChat/setHistoryNews', newsArr)
      }
    } else if (friend.command == 20 && friend.code == 10018) {
      // console.log(friend, "这里是历史小i下")
      // 处理历史记录
      if(("data" in friend)) {
        store.commit('advisoryChat/setHistoryNews', friend.data.friends[store.state.advisoryChat.friendId])
      } else {
        store.commit('advisoryChat/setHistoryNews', [])
      }
      // router.push({
      //   path: `/inquiryOnline/${store.state.advisoryChat.friendId}`
      // });
    } else if (friend.command == 20 && friend.code == 10016) { // 处理离线消息
      // 把离线消息的最后一条加入消息队列中
      let offNews = friend.data.friends
      for (let i in offNews) {
        let obj = {}
        let number = offNews[i].length
        obj = JSON.parse(JSON.stringify(offNews[i][offNews[i].length - 1]))
        obj.newNews = number
        obj.isRead = false
        store.commit('advisoryChat/updateChatQueue', obj)
      }
      // PC端页面加载调用
      // console.log(store.state.advisoryChat.friendId,"55555555555")
      // let friendId = store.state.advisoryChat.friendId || store.state.advisoryChat.chatQueue[0].from
      // let msg = {
      //   cmd: 19,
      //   type: 1,
      //   fromUserId: friendId,
      //   userId: username
      // };
      // store.commit('advisoryChat/setFriendId', friendId);
      // store.state.advisoryChat.websocket.send(JSON.stringify(msg));
      // PC端页面加载调用
      
    } else if (friend.command == 6) { // 登录命令返回成功处理
      var userCmd = "{\"cmd\":17,\"type\":\"0\",\"userid\":\"" + id + "\"}";
      var msgCmd = "{\"cmd\":19,\"type\":\"0\",\"userId\":\"" + id + "\"}";
      websocket.send(userCmd); //获取登录用户信息;
      websocket.send(msgCmd); //获取用户离线消息(好友+群组);
    } else if (friend.command == 18) {
      //获取用户信息响应处理; 
      // console.log('用户信息', friend)
    }
	};
}
export default websocketConfig