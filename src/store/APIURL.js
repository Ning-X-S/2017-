const IP = 'http://192.168.199.128:8080/web/'

export default {
  // 初始化抽奖，默认从第一轮三等奖开始抽
  awardPrize: IP + 'rest/award/awardPrize.htm',
  // 提交中奖者ID
  recordWinning: IP + 'rest/award/recordWinning.htm'
}
