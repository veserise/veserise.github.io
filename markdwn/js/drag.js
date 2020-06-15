 /*-------------------------- +
      获取id, class, tagName
     +-------------------------- */
    var get = {
      byId: function(id) {
        return typeof id === "string" ? document.getElementById(id) : id
      },
      byClass: function(sClass, oParent) {
        var aClass = [];
        var reClass = new RegExp("(^| )" + sClass + "( |$)");
        var aElem = this.byTagName("*", oParent);
        for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
        return aClass
      },
      byTagName: function(elem, obj) {
        return (obj || document).getElementsByTagName(elem)
      }
    };

    var dragMinWidth = 200;
    /*-------------------------- +
      改变大小函数
     +-------------------------- */
    function resize(oParent, handle, isLeft, isTop, lockX, lockY){
      handle.onmousedown = function (event){

        var event = event || window.event;
        var disX = event.clientX - handle.offsetLeft;
        var iParentLeft = oParent.offsetLeft;
        var iParentWidth = oParent.offsetWidth;
        
        document.onmousemove = function (event){
          var event = event || window.event;
          
          var iL = event.clientX - disX;
          var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
          var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
          
          isLeft && (oParent.style.left = iParentLeft + iL + "px");
          
          iW < dragMinWidth && (iW = dragMinWidth);
          iW > maxW && (iW = maxW);
          lockX || (oParent.style.width = iW + "px");

          if((isLeft && iW == dragMinWidth) ) document.onmousemove = null;
          
          var oDrag = document.getElementById("drag");
          var contentBox = document.getElementById('contentBox');

          contentBox.style.left = 0 + oDrag.offsetWidth + "px";
          contentBox.style.width = document.documentElement.clientWidth - 0 - oDrag.offsetWidth + "px";

          // console.log('drag width ', iParentWidth , contentBox.offsetLeft, contentBox.offsetWidth)

          return false; 
        };

        document.onmouseup = function (){
          document.onmousemove = null;
          document.onmouseup = null;
        };

        return false;
      }
    };

    window.onload = window.onresize = function (){

      var oDrag = document.getElementById("drag");
      

      var oR = get.byClass("resizeR", oDrag)[0];
      

      //右边
      resize(oDrag, oR, false, false, false, false);
      
      const left = 0

      // oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 5 + "px";
      oDrag.style.left = left+ "px";
    }