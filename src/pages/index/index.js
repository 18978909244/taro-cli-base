import Taro, { Component, hideToast } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtInputNumber, AtButton, AtIcon } from 'taro-ui'
import { get, jump } from '../../service'
import _ from 'lodash'
import './index.less'

function getNumberList(num, condition) {
  // console.log('num,',num)
  if (condition.length == 0) return;
  let list = []
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  let _arr = _.shuffle(arr).slice(0, num)
  let flag = false
  for (let i = 0; i < condition.length; i++) {
    if (checkArr(_arr, condition[i])) {
      continue
    } else {
      flag = true
      break;

    }
  }
  if (!flag) {
    return _arr.slice(0, num).sort((a, b) => a - b).join('、')
  } else {
    return getNumberList(num, condition)
  }
  // return _arr.slice(0, num).join('、')
}

function checkArr(arr, condition) {
  let flag = false
  for (let i = 0; i < condition.length; i++) {
    if (arr.includes(Number(condition[i]))) {
      continue;
    } else {
      flag = true
      break;
    }
  }
  // console.log('flag', arr, condition, flag)
  return flag
}

// console.log('hrere', checkArr([1, 4, 5], [4, 2]))

export default class Index extends Component {
  state = {
    value: 2,
    condition: [],
    conditionInput: '',
    result: []
  }
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  handleChange(value) {
    this.setState({
      value
    })
  }
  addCondition() {
    let condition = this.state.condition
    this.setState({
      condition: [...condition, this.state.conditionInput.replace(/,/g, '，').split('，').map(item => Number(item))],
      conditionInput: ''
    })
  }
  getResult() {
    Taro.showLoading()
    let result = []
    for (let i = 0; i < 100; i++) {
      let item = getNumberList(this.state.value, this.state.condition)
      // console.log(item)
      // item = item.sort((a,b)=>b-a)
      result.push(item)
    }
    this.setState({
      result
    }, () => {
      setTimeout(() => {
        Taro.hideLoading()
      }, 300)
    })
  }
  handleTextChange(conditionInput) {
    this.setState({
      conditionInput
    })
  }
  delete(index){
    let condition = this.state.condition
    let arr = []
    condition.forEach((item,_index)=>{
      if(index!==_index){
        arr.push(item)
      }
    })
    this.setState({
      condition:arr
    })
  }
  render() {
    return (
      <View className='index'>
        <View className="input">
          位数：
          <AtInputNumber
            type='digit'
            min={2}
            max={8}
            step={1}
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </View>

        <AtInput value={this.state.conditionInput} type='text' placeholder="请输入数字，以逗号“，”隔开" onChange={this.handleTextChange.bind(this)}></AtInput>

        <AtButton type='primary' onClick={this.addCondition.bind(this)} disabled={this.state.conditionInput.length === 0}>增加条件</AtButton>

        {this.state.condition.length > 0 ?
          <View>
            条件：
        {this.state.condition.map((item, index) => {
              return (
                <View className="contain">
                  <View>
                    不能同时包含
                    {item.map((_item, _index) => {
                      return (
                        <Text>{_item}{_index === item.length - 1 ? null : '、'}</Text>
                      )
                    })}
                  </View>
                  <AtIcon value='close' size='30' color='#F00' onClick={this.delete.bind(this,index)}></AtIcon>
                </View>
              )
            })}
          </View>
          : null}
        <View className="result">
          <AtButton disabled={this.state.condition.length === 0} onClick={this.getResult.bind(this)}>输出</AtButton>
        </View>
        {this.state.result.length > 0 ?
          <View>
            结果：
          {this.state.result.map((item, index) => {
              return <View className="t-c">{item}</View>
            })}
          </View>
          : null}
      </View>
    )
  }
}
