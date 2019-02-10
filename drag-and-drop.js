//無名関数定義
(function(){

    //カードの取得:classで指定
    var elements = document.getElementsByClassName("drag-and-drop");

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    var x;
    var y;

    //カード全てに対しmousedownのイベントをセットし、mdown関数を実行するように
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);//mdown関数がこの要素に対しmousedownイベント発生時に起動
        elements[i].addEventListener("touchstart", mdown, false);//スマホ用
    }
  
  //以下はイベント発生時の関数//

    //マウスが押された際の関数
    function mdown(e) {

        //ここでいうthisはmdown関数が実行された要素（クリックされたカード）
        //クラス名に .drag を追加。こうすることで以降の座標操作の対象を１カードだけに絞れる
        this.classList.add("drag");

        //（スマホの）タッチイベントと（PCの）マウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        //pageX : イベント発生地点からドキュメント左端までのpx数を返す: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX
        //this(htmlElementのこと).offsetLeft : HTML要素のleft属性値をpx数で返す : https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/offsetLeft
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック(この要素自体ではなく、document.bodyにつける。クリックしたまま動かすので）
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //(カードをクリック中に）マウスカーソルが動いたときに発火
    function mmove(e) {

        //ドラッグしている要素(drag属性を持っている)を取得して、いま掴んでいる要素のみを得る。こうしないと全部のカードが動く
        var drag = document.getElementsByClassName("drag")[0];

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        //マウスが動いた場所に要素を動かす。drag要素のtop,left属性のvalueに代入 yとxは呼び出し元関数より
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

        //マウスボタンが離されたとき
        drag.addEventListener("mouseup", mup, false);
        //マウスカーソルが画面外に消えたとき
        document.body.addEventListener("mouseleave", mup, false);
        //以下スマホ用
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);

    }

    //(カードをドラッグ中に）マウスボタンが上がったら発火
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];

        //bodyからmousemove消去、.dragからmouseup消去(起点のmousedownは残る）
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
      
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //掴んでいることを示していたクラス名 .drag を消す
        drag.classList.remove("drag");
    }

})()