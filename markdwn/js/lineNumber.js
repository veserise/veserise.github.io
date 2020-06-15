const lineObjOffsetTop = 2
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
  for (var no = 1; no < num; no++) {
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
var clearLines = function (id) {
  var ta = document.getElementById(id)
  ta.innerHTML = ""
}
var reCreatelines = function (id, num) {
  var ta = document.getElementById(id)
  clearLines(id)

  var string = '<ul>'
  for (var i = 1; i < num; i++) {
    string = string + '<li>' + i + '</li>'
  }
  string = string + '</ul>'

  ta.innerHTML = string
}
var lineStyle = function (id, num, line) {
  var ta = document.getElementById(id)
  var ulbox = ta.children[0]
  
  //清除所有样式
  for (var i = 0; i < num - 1; i++) {
    if (ulbox.children[i].className == "active") {
      ulbox.children[i].className = ""
    }
  }

  // reCreatelines(id, num)
  //添加样式
  ta.children[0].children[line -1].className = 'active'
}
// var textArealine = function (el) {
//   var num = getNodeIndex(el)

//   //清除textarea每一行所有样式
//   var parent = el.parentNode
//   var child = parent.children
//   for (let i = 0; i < child.length; i++) {
//     if (child[i].classList.contains('active')) {
//       child[i].classList.remove('active')
//     }
//   }
//   el.classList.add('active')
//   lineStyle('lineObj', num)
// }
//行样式
// var lineStyle = function (id, line) {
//   var ta = document.getElementById(id)
//   var ulbox = ta.children[0]

//   clearLinesstyleall(ulbox)
//   console.log(line)

//   ta.children[0].children[line].className = 'active'
// }

// var clearLinesstyleall = function (ulbox) {
//   console.log(ulbox, numLines)
//   for (var i = 0; i < numLines - 1; i++) {
//     var child = ulbox.children[i]
//     if (child.className !== '' && child.className == "active") {
//       child.className = ""
//     }
//   }
// }