import axios from 'axios'
import store from './store/index'

export default {
  /**
    * 初始化抽奖，默认从第一轮三等奖开始抽
    * @param  {[Number]}   index    [当前轮数]
    * @param  {Function}   callback [回调函数]
    * callback(err, data)
    */
  awardPrize: function (index, callback) {
    axios.get(store.state.APIURL.awardPrize, {params: {
      index: index
    }}).then(function (res) {
      if (res.data.code === 0 || res.data.code === -2) {
        // console.log(res)
        callback(res.data)
      }
    }).catch(function (err) {
      console.log(err)
      // 网络错误返回 networkerror
      let network = 'NetworkError'
      callback(network)
    })
  },
  /**
  * 提交中奖者ID数组
  * @param  {[Object]}  lastWin [轮数ID,中奖者ID数组]
  * @param  {Function}  callback [回调函数]
  * callback(err, data)
  */
  recordWinning: function (lastWin, callback) {
    axios.post(store.state.APIURL.recordWinning, lastWin, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      // console.log(res)
      callback(res.data)
    }).catch(function (err) {
      console.log(err)
      // 网络错误返回 networkerror
      let network = 'NetworkError'
      callback(network)
    })
  }

}
