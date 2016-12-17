//浏览器兼容问题
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    } //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }//判断是否IE浏览器
}
/*搜索框事件*/
var searchRender = (function () {
    var $box = $('#box'),
        $searchInp = $('#searchInp'),
        $seek = $('#seek'),
        $searchItem = $box.children('.searchItem'),
        $oLi = $searchItem.children('li');
    //文本框事件的处理
    function bindInputEvent() {
        var text = $(this).val();
        //如果文本框中没有内容，我们隐藏提示区
        if (text.length === 0) {
            $searchItem.stop().slideUp(100);
            return;
        }
        //如果文本框中有内容，我们通过jsonp把内容发送给百度，并获取百度返回的结果，把结果展示在提示区域，并且提示区展开
        $.ajax({
            url: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + text,//前面的地址就是百度的接口
            type: 'get',
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (result) {
                if (result) {
                    result = result['s'];//我们只有其中‘s’这项的内容
                    if (result.length === 0) {//没有匹配的数据
                        //让提示区隐藏
                        $searchItem.stop().slideUp(100);
                        return;
                    }
                    //有匹配的数据，绑定数据，并且显示提示层
                    var str = '';
                    $.each(result, function (index, item) {
                        //不限制li搜索的内容
                        /*if (index > 8) {
                         return;
                         }*/
                        if (item) {
                            str += '<li>' + item + '</li>';
                        }

                    });
                    $searchItem.html(str).stop().slideDown(100);
                }
            }

        });
    }

//处理点击事件
    function bindClickEvent(e) {
        var tar = e.target,
            tarTag = tar.tagName.toUpperCase(),
            tarInn = tar.innerHTML;
        var $tar = $(tar);
        //是input
        if (tarTag === 'INPUT' && tar.id === 'searchInp') {
            return;
        }
        //li
        if (tarTag === 'LI' && $tar.parent().hasClass('searchItem')) {
            $searchInp.val(tarInn);
            $searchItem.stop().slideUp(100);
            return;
        }
        //如果是点击其他
        $searchItem.stop().slideUp(100);

    }

    //跳转到百度页面
    function bindSeach() {
        window.open('https://www.baidu.com/s?wd=' + $searchInp.val(), '_blank');
        $searchItem.stop().slideUp(100);
    }

    //添加键盘事件
    $(document).keyup(function (e) {
        if (e.keyCode == 13) {
            $searchInp.val = $oLi[Math.abs(this.n)].innerHTML;
            bindSeach();
        }

    });
    return {
        init: function () {
            $searchInp.on('keyup focus', bindInputEvent);
            $(document).on('click', bindClickEvent);
            //搜索框
            $seek.on('click', bindSeach);

        }
    }
}());
searchRender.init();
/*轮播图事件*/
(function(){
    var oBox=document.getElementById('banner');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aImg=oBoxInner.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oUl.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var data=null;
    var timer=null;
    var n=0;
    //1.获取并解析数据 2.绑定数据 3.延迟加载 4.渐隐渐现 5.焦点自动轮播 6.移入移出 7.点击焦点手动切换 8.点击左右按钮切换
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    }
    //2.绑定数据
    bind();
    function  bind(){
        var strImg='';
        var strLi='';
        for(var i=0; i<data.length; i++){
            strImg+='<img src="" realImg="'+data[i].imgSrc+'" alt="">';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        oBoxInner.innerHTML=strImg;
        oUl.innerHTML=strLi;
    }
    //3.延迟加载
    lazyImg();
    function  lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var curImg=aImg[index];
                var tmpImg=new Image;
                tmpImg.src=curImg.getAttribute('realImg');
                tmpImg.onload=function(){
                    curImg.src=this.src;
                    tmpImg=null;
                    //让第一张图片层级为1，透明度从0-1的运动；
                    utils.css(aImg[0],'zIndex',1);
                    animate(aImg[0],{opacity:1},{duration:1000})
                }
            })(i);
        }
    }
    //4.渐隐渐现
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aImg.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function  setBanner(){
        for(var i=0; i<aImg.length; i++){
            if(i===n){//让谁显示，就先提高谁的层级，同时让其他图片层级为0；
                utils.css(aImg[i],'zIndex',1)
                animate(aImg[i],{opacity:1},{
                    duration:1000,
                    callback:function(){//等运动结束后想干的事情
                        //千万不要在回调函数中使用i，回调函数属于异步，异步中，i一定会出问题
                        var siblings=utils.siblings(this);
                        //让所有兄弟元素的透明度都为0；
                        for(var i=0; i<siblings.length; i++){
                            utils.css(siblings[i],{opacity:0});
                        }
                    }
                })
            }else{
                utils.css(aImg[i],'zIndex',0)
            }
        }
        bannerTip();
    }
    //5.焦点自动轮播
    function bannerTip(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==n?'on':null;
        }
    }
    //6.移入停止，移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000)
        oBtnLeft.style.display=oBtnRight.style.display='none';
    };
    //7.点击焦点手动切换
    handleChange();
    function  handleChange(){
        for(var i=0; i<aLi.length; i++){
            (function(index){
                aLi[index].onclick=function(){
                    n=index;
                    setBanner();
                }
            })(i);
        }
    }
    //8.点击左右按钮进行切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aImg.length;
        }
        n--;
        setBanner();
    }
})();