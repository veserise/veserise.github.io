const image = /\!\[[\s\S]*?\]\([\s\S]*?\)/g             //全局匹配图片
const catenate = /\[[\s\S]*?\]\([\s\S]*?\)/g            //全局匹配链接
const recode = /(\*)(.*?)(\*)/g                         //全局匹配内联代码块
const incode = /`{1,2}[^`](.*?)`{1,2}/g                 //全局匹配内联代码块
const code = /```([\s\S]*?)```[\s]*/g                   //全局匹配代码块
const delteLine = /\~\~(.*?)\~\~/g                      //全局匹配删除线
const unordered = /[\s]*[-\*\+]+(.*)/g                  //全局匹配无序列表
const order = /[\s]*[0-9]+\.(.*)/g                      //全局匹配有序列表
const label = /<\/?.+?\/?>/g                            //全局匹配内html标签
const title = /^(#+)(.*)/g                              //全局匹配标题
const bold = /(\*\*|__)(.*?)(\*\*|__)/g                 //全局匹配内粗体
const italic = /(\*|__)(.*?)(\*|__)/g                   //全局匹配斜体
const italics = /(\*\*\*|__)(.*?)(\*\*\*|__)/g          //全局匹配斜体加粗
const remark = /^(>+)(.*)/g                             //全局匹配摘要
const renter = /\r\n/g                                  //全局匹配换行
const space = /^[\s]*$/g                                //全局匹配空行

let map = {
  remark: remark,
  image: image,
  catenate: catenate,
  recode: recode,
  incode: incode,
  code: code,
  delteLine: delteLine,
  unordered: unordered,
  label: label,
  order: order,
  bold: bold,
  italic: italic,
  italics: italics,
  title: title,
  space: space,
}
let numLine = 0
let numLines = 0
const lineObjOffsetTop = 2

//浏览器(ie,chrome)统一格式
var getFromatCode = function (str) {
  return str.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
}

//计算行数
function lineNum(text) {
  return (text.includes('\n') || text.includes('\r\n') || text.replace('\s')) ? getFromatCode(text).split('<br/>').length : text.split('<br/>').length
}

//创建span/div标签
var creatElements = function (id, str, lineNums) {
  var parent = document.getElementById(id)
  var elems = str.split('\n')
  numLines = elems.length

  lineNums.innerText = numLines
  parent.innerHTML = ''

  for (let i = 0; i < numLines; i++) {
    var element = elems[i];
    var div = document.createElement('div')
    // var span = document.createElement('span')

    div.innerText = element
    loopTest(element, div)
    // div.appendChild(span)
    parent.appendChild(div)
  }
}

//内容正则匹配
var loopTest = function (str, span) {
  var flag = false
  for (var key in map) {
    if (map[key].test(str)) {
      span.className = key
      flag = true
    }
  }
  if (!flag) {
    span.className = 'default'
  }
}
//清除所有行被点中样式active
var clearLine = function (parent) {
  var child = parent.children
  for (let i = 0; i < child.length; i++) {
    if (child[i].classList.contains('active')) {
      child[i].classList.remove('active')
    }
  }
}
//重设样式
var reAreastyle = function (parent) {
  var child = parent.children

  //清空
  for (let i = 0; i < child.length; i++) {
    child[i].classList == ''
  }

  for (let i = 0; i < child.length; i++) {
    loopTest(child[i].innerText, child[i])
  }
}

//当前元素位于父元素第几个孩子结点
var getNodeIndex = function (el) {
  var i = 0
  while (el = el.previousSibling) {
    i++
  }
  return i
}


var positionLineObj = function (obj, ta) {
  obj.style.top = (ta.scrollTop * -1 + lineObjOffsetTop) + 'px'
}

var createTextAreaWithLines = function (id, num) {
  var el = document.createElement('DIV')
  var ta = document.getElementById(id)
  ta.parentNode.insertBefore(el, ta)
  el.appendChild(ta)
  el.id = "textAreaWithLines"

  el.style.width = ta.offsetWidth + 'px'
  ta.style.position = 'absolute'
  ta.style.left = '60px'
  el.style.height = ta.offsetHeight + 'px'
  el.style.position = 'relative'

  var lineObj = document.createElement('DIV')
  lineObj.style.position = 'absolute'
  lineObj.style.left = '0px'
  lineObj.style.width = '55px'
  lineObj.style.right = '5px'

  el.insertBefore(lineObj, ta);
  lineObj.style.textAlign = 'right'
  lineObj.className = 'lineObj'
  lineObj.id = "lineObj"
  var string = '<ul>'
  for (var no = 1; no <= num; no++) {
    string = string + '<li>' + no + '</li>'
  }
  string = string + '</ul>'
  ta.onkeydown = function () { positionLineObj(lineObj, ta) }
  ta.onmousedown = function () { positionLineObj(lineObj, ta) }
  ta.onscroll = function () { positionLineObj(lineObj, ta) }
  ta.onblur = function () { positionLineObj(lineObj, ta) }
  ta.onfocus = function () { positionLineObj(lineObj, ta) }
  ta.onmouseover = function () { positionLineObj(lineObj, ta) }
  lineObj.innerHTML = string
}

//重建行
var reCreatelines = function (id, nums) {
  var ta = document.getElementById(id)
  ta.innerHTML = ""

  var string = '<ul>'
  for (var i = 1; i <= nums; i++) {
    string = string + '<li>' + i + '</li>'
  }
  string = string + '</ul>'

  ta.innerHTML = string
}
var lineStyles = function (num) {
  var lineObj = document.getElementById('lineObj').children[0]

  //clearall
  clearLine(codeTextarea)
  clearLine(lineObj)
  //reSetclass
  codeTextarea.children[num].classList.add('active')
  lineObj.children[num].className = 'active'
}

// 生成随机字符串
var randomStr = function (n) {
  let arr = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', ',', '.', '/', '?', '<', '>', '\'', '|', '[', ']', '{', '}', ':', ';', '"', '\''],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  ]
  let a = [];//保存所有字符
  let s = '';//最终输出字符
  arr.forEach((item) => {
    a.push(...item)
  })
  for (let i = 1; i < n; i++) {
    let m = Math.floor(Math.random() * (a.length));//生成随机数
    s += a[m]
  }
  return s;
}