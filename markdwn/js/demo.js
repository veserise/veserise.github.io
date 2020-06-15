var demo = `# Markdown

## 在线预览

#### 点击预览

###### javascript

- 列表内容

+ 列表内容

* 列表内容

<pre>

<code class="javascript">
  var content = document.querySelector('.content'),
      contentBox = document.getElementById('contentBox'),
      pre = document.querySelectorAll('pre'),
      lineNumBox = document.getElementById('lineNum')
  var  jell = function (){
      return 0
    }
</code>

</pre>

* 左边编辑

* 右边显示内容

* 内容高亮

**加粗**

*斜体*

***斜体加粗***

~~删除线~~

>引用

\`\`\`javascript
  var content = document.querySelector('.content'),
      contentBox = document.getElementById('contentBox'),
      pre = document.querySelectorAll('pre'),
      lineNumBox = document.getElementById('lineNum')
  var  jell = function (){
      return 0
    }
\`\`\`

![img](image/img.jpg)

[百度](http://baidu.com)

| 姓名 | 技能 | 排行 |
| ---- | :--: | ---: |
| 刘备 |  哭  | 大哥 |
| 关羽 |  打  | 二哥 |
| 张飞 |  骂  | 三弟 |`;
window.localStorage.setItem('demo', demo);//对象转字符串