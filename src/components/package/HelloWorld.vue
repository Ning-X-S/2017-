<template>
<div class="hello">
  <div class="main">
    <div class="left">
      <h3>现场大奖</h3>
      <img class="award-img" src="../../assets/gift.png"/>
      <p class="award-name">
        {{basisData.awardName}} {{basisData.pname}}
        <br />
        {{basisData.name}} * {{basisData.num}}
      </p>
      <div class="set">
        <p class="set1">
          <label>抽奖参与人数</label>
          <span class="yellow" id="partiNum">{{basisData.userNum}}</span>
        </p>
        <p class="set2">
          <label>本次抽取人数</label>
          <span class="yellow" id="winners">{{basisData.num}}</span>
        </p>
      </div>
      </div>
      <div class="right">
      <div class="person-box">
        <ul>
          <li v-for="item in newList" :key="item.id" :class="{curr: isCurr }">
            <div class="lottery-item one">
              <div class="headbox">
                <div class="headimg lottery-ani-box">
                  <div class="lottery-head-item">
                    <div class="item">
                      <img :src="item.avatar" class="avatar" :class="{curr: isCurr }" /></div>
                    </div>
                </div>
              </div>
              <p class="nickname limit">
                <span class="emoji-box">{{item.name}}</span>
              </p>
            </div>
          </li>
          <!-- <li v-if="liFlag">
            <div class="lottery-item one">
              <div class="headbox">
                <div class="headimg lottery-ani-box">
                  <div class="lottery-head-item">
                    <div class="item">
                      <img src="../../assets/default-avatar.png" class="avatar"></div>
                    </div>
                </div>
              </div>
              <p class="nickname limit">
                <span class="emoji-box">虚位以待</span>
              </p>
            </div>
          </li>
          <li v-if="!liFlag">
            <div class="lottery-item one">
              <div class="headbox">
                <div class="headimg lottery-ani-box">
                  <div class="lottery-head-item">
                    <div class="item">
                      <img src="../../assets/default-avatar.png" class="avatar"></div>
                    </div>
                </div>
              </div>
              <p class="nickname limit">
                <span class="emoji-box">虚位以待</span>
              </p>
            </div>
          </li> -->
        </ul>
      </div>
      <div class="start-box">
        <span class="lottery-btn" @click="switchLottery" >{{lotteryBtnContent}}</span>
        <span class="next-time" @click="nextTimeLottery(true)">进入下次抽奖</span>
        <span class="next-round" @click="nextTimeLottery(false)">进入下一轮</span>
      </div>
      </div>
  </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'hello',
  data () {
    return {
      index: 1,
      basisData: '',
      condition: true, // 抽奖按钮是否允许点击
      nextRoundCondition: true, // 抽奖按钮是否允许点击
      lotteryBtnContent: '开始抽奖',
      timer: '',
      isCurr: false,
      newList: [
        {
          'avatar': require('../../assets/default-avatar.png'),
          'name': '虚位以待'
        },
        {
          'avatar': require('../../assets/default-avatar.png'),
          'name': '虚位以待'
        },
        {
          'avatar': require('../../assets/default-avatar.png'),
          'name': '虚位以待'
        },
        {
          'avatar': require('../../assets/default-avatar.png'),
          'name': '虚位以待'
        },
        {
          'avatar': require('../../assets/default-avatar.png'),
          'name': '虚位以待'
        }
      ]
    }
  },
  created () {
    this.awardPrize(this.index)
  },
  computed () {
    this.newList = this.switchLottery()
  },
  methods: {
    // 初始化抽奖，默认从第一轮三等奖开始抽
    awardPrize (index) {
      axios.awardPrize(index, (res) => {
        console.log(res)
        if (res === 'NetworkError') {
          alert('网络错误啦！')
        }
        if (res.code === 0) {
          this.basisData = res
          this.basisData.users = this.shuffle(this.basisData.users)
          if (res.num > 3) {
            this.isCurr = true
          }
          this.newList = this.newList.splice(0, this.basisData.num)
          this.condition = true
          this.nextRoundCondition = true
        } else {
          this.condition = false
          this.nextRoundCondition = false
          alert('本轮抽奖已经结束,请点击进入下一轮')
        }
      })
    },
    // 抽奖切换
    switchLottery: function () {
      let vm = this
      if (vm.lotteryBtnContent === '开始抽奖' && vm.condition === true) {
        vm.lotteryBtnContent = '停止'
        vm.timer = setInterval(() => {
          // 假的中奖者index
          let winnerArr = vm.winnerIndex(vm.basisData.num, vm.basisData.users.length)
          for (let i = 0; i < vm.basisData.num; i++) {
            vm.newList[i].avatar = vm.basisData.users[winnerArr[i]].avatar
            vm.newList[i].name = vm.basisData.users[winnerArr[i]].name
          }
        }, 100)
      } else if (vm.lotteryBtnContent === '停止' && vm.condition === true) {
        vm.lotteryBtnContent = '开始抽奖'
        clearInterval(vm.timer)
        let lastWinIndex = []
        // 真实中奖者index
        let winnerSub = vm.winnerIndex(vm.basisData.num, vm.basisData.users.length)
        for (let i = 0; i < vm.basisData.num; i++) {
          lastWinIndex.push(vm.basisData.users[winnerSub[i]].uid)
        }
        // console.log(lastWinIndex)
        let lastWin = { 'prizeId': vm.basisData.prizeId, 'users': lastWinIndex }
        // console.log(lastWin)
        // console.log(vm.basisData.prizeId)
        // 提交抽奖结果
        axios.recordWinning(JSON.stringify(lastWin), (res) => {
          if (res.code === 0) {
            for (let i = 0; i < vm.basisData.num; i++) {
              vm.newList[i].avatar = vm.basisData.users[winnerSub[i]].avatar
              vm.newList[i].name = vm.basisData.users[winnerSub[i]].name
            }
            vm.condition = false
          } else {
            for (let i = 0; i < vm.basisData.num; i++) {
              vm.newList[i].avatar = "require('../../assets/default-avatar.png')"
              vm.newList[i].name = '虚位以待'
            }
            vm.condition = true
            alert('提交失败，本次抽奖不算数')
          }
        })
      } else {
        alert('本轮抽奖已经结束,请点击进入下一轮')
      }
    },
    // 下次或下一伦抽奖
    nextTimeLottery: function (flag) {
      if (flag === true) {
        axios.awardPrize(this.index, (res) => {
          console.log(res)
          if (res === 'NetworkError') {
            alert('网络错误啦！')
          }
          if (res.code === 0) {
            this.basisData = res
            this.basisData.users = this.shuffle(this.basisData.users)
            if (res.num > 3) {
              this.isCurr = true
            } else {
              this.isCurr = false
            }
            this.newList = [{'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}]
            this.newList = this.newList.splice(0, this.basisData.num)
            this.condition = true
            this.nextRoundCondition = true
          } else {
            this.nextRoundCondition = false
            this.condition = false
            alert('本轮抽奖已经结束,请点击进入下一轮')
          }
        })
      } else if (flag === false) {
        // 判断是否可以进入下一轮
        if (this.nextRoundCondition === false) {
          this.index += 1
          axios.awardPrize(this.index, (res) => {
            console.log(res)
            if (res === 'NetworkError') {
              alert('网络错误啦！')
            }
            if (res.code === 0) {
              this.basisData = res
              this.basisData.users = this.shuffle(this.basisData.users)
              if (res.num > 3) {
                this.isCurr = true
              } else {
                this.isCurr = false
              }
              this.newList = [{'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}, {'avatar': require('../../assets/default-avatar.png'), 'name': '虚位以待'}]
              this.newList = this.newList.splice(0, this.basisData.num)
              this.condition = true
              this.nextRoundCondition = true
            } else {
              this.nextRoundCondition = false
              this.condition = false
              alert('本轮抽奖已经结束,请点击进入下一轮')
            }
          })
        } else {
          alert('本轮抽奖还未结束,不能进入下一轮')
        }
      }
    },
    nextRoundLottery: function () {
      console.log(222)
    },
    // 随机数组排序算法
    shuffle: function (arr) {
      let i, j, temp
      for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }
      return arr
    },
    // 生成中奖者索引值,num(中奖人数),total(总参与人数)
    winnerIndex: function (num, total) {
      let i = 0
      let s = ''
      let sp = ','
      let next
      while (i < num) {
        next = Math.floor(Math.random() * total) + 1
        if (s.indexOf(next) === -1) {
          // 不存在
          // 则加上这条
          s += next + sp
          // 并且记数器加1
          i++
        }
      }
      return s.slice(0, -1).split(',')
    }
  }
}
</script>

<!-- 添加“scoped”属性来限制CSS仅限于这个组件 -->
<style scoped>
.hello {
  width: 100%;
  height: 100%;
  background: url(../../assets/nianhui_bg.jpg) no-repeat left top;
  background-size: cover;
  position: relative;
}
.main {
  width: 1000px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -500px;
  color: #fff2cc;
}
/*抽奖左部分CSS*/
.left {
  height: 600px;
  width: 250px;
  float: left;
  background: url(../../assets/lottery_bg.png) no-repeat left center;
  text-align: center;
}
.left h3 {
  padding-top: 82px;
  font-size: 16px;
}
.left img.award-img {
  display: block;
  margin: 25px auto;
  width: 200px;
  height: 200px;
  -o-object-fit: contain;
  object-fit: contain;
  -o-object-position: center;
  object-position: center;
}
.left p.award-name {
  margin: 25px auto;
  width: 180px;
  height: 70px;
  line-height: 35px;
}
.left .set {
  float: left;
  width: 200px;
  margin-top: 5px;
  padding-left: 3px;
}
.set p {
  position: relative;
  width: 100%;
  line-height: 38px;
  height: 38px;
  background-color: hsla(0,0%,100%,.08);
  font-size: 14px;
  color: rgba(255,242,204,.5);
  padding-left: 20px;
  border-radius: 0 38px 38px 0;
  margin-top: 10px;
  display: flex;
  text-align: left;
}
.set label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 2;
}
.set span {
  font-size: 18px;
  flex: 1;
}
.yellow {
  color: #ffd131;
}
/*抽奖右部分CSS*/
.right {
  margin-left: -15px;
  float: right;
  width: 740px;
  text-align: center;
  height: 600px;
  background: url(../../assets/lottery_bg1.png) no-repeat left center;
}
.right .person-box, .right .person-box ul {
  display: -webkit-box;
  display: -ms-flexbox;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.person-box {
  height: 436px;
  margin-top: 20px;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.right .person-box ul {
  -ms-flex-pack: distribute;
  justify-content: space-around;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-height: 150px;
}
.right .person-box ul li {
  width: 228px;
  height: 256px;
  margin: 0 5px;
  z-index: 10;
}
.right .person-box ul li.curr {
  width: 120px;
}
.right .person-box ul li.nonecurr {
  display: none;
}
.headbox img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.headbox img.curr {
  width: 100px;
  height: 100px;
}
.lottery-item.one .nickname {
  margin-top: 20px;
  line-height: 54px;
  height: 54px;
  font-size: 24px;
  width: 100%;
  background: url(../../assets/virtual-bit.png) no-repeat top;
}
.start-box span {
  color: #9b6400;
  font-weight: bold;
  font-size: 20px;
  margin:0 20px;
  cursor: pointer;
  display: inline-block;
  width: 150px;
  height: 44px;
  line-height: 44px;
  background: url(../../assets/btn_bg.png) repeat left top/100% auto;
}
</style>
