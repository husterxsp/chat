$(function(){
    var socket = io();
    socket.emit('message', {"username": "system", "message": $("#username").html() + " 加入聊天", 
                            "nickname": $("#username").html()});
    socket.on('message', solveSocketMsg);
    $("#sendChat").click(sendMessage);
    $("#message").keydown(function(e) {
        if (e.keyCode === 13) {
          sendMessage();
        }
    });
    $("li.prev").click(lookPrev);
    $("li.next").click(lookNext);
    $(".pagination").on("click", ".pagination-list", clickPageNum);

    function solveSocketMsg(msg) {
        $(".pagination-list").first().click();
        if (msg.username == "system") {
            $(".list-message.hide").prepend('<li class="list-group-item list-group-item-info" style="background-color: #d9edf7;">'
                                + msg.username+ " " + msg.time + " : " + msg.text +'</li>');
            $(".list-message.show").prepend('<li class="list-group-item list-group-item-info" style="background-color: #d9edf7;">'
                                + msg.username+ " " + msg.time + " : " + msg.text +'</li>');
        } else {
            $(".list-message.hide").prepend('<li class="list-group-item">'
                                    + msg.username+ " " + msg.time + " : " + msg.text +'</li>');
            $(".list-message.show").prepend('<li class="list-group-item">'
                                    + msg.username+ " " + msg.time + " : " + msg.text +'</li>');
        }

        if ($(".list-message.show li").length > 10) {
            $(".list-message.show li:last").remove();
        }
    }
    function sendMessage() {
        var message = filterXSS($("#message").val());
        if (!message) {
            return false;
        }
        socket.emit('message', {"message": message, "username": $("#username").html()});
        $("#message").val("");
    }
    function clickPageNum(e) {
        if (e.target.tagName == "A") {
            target = e.target;
        } else {
            target = e.target.firstChild;
        }
        var pageNum = target.innerHTML;
        $(target.parentNode).addClass("active").siblings().removeClass("active");

        var list = $(".list-message.hide").children();
        var appendlist = "";
        for (var i = (pageNum-1)*10; i < pageNum*10; i++) {
            if (!list[i]) {
                break;
            }
            appendlist += list[i].outerHTML;
        }
        if (!appendlist) {
            return false;
        }
        $(".list-message.show").empty().append(appendlist);
    }

    function lookNext() {
        if ($("li.active")[0] == $(".pagination-list").last()[0]) {
            var nowPageNum = $("li.active").children(0)[0].innerHTML;
            if (nowPageNum*10 < $(".list-message.hide").children().length) {
                $(".pagination-list a").each(function(){
                    this.innerHTML = parseInt(this.innerHTML) + 1;
                });
                $("li.active").click();
            }
        } else {
            $("li.active").next().click();
        }
    }
    function lookPrev() {
        if ($("li.active").index() == 1) {
            var nowPageNum = $("li.active").children(0)[0].innerHTML;
            if (nowPageNum > 1) {
                $(".pagination-list a").each(function(){
                    this.innerHTML = parseInt(this.innerHTML) - 1;
                });
                $("li.active").click();
            }
        } else {
            $("li.active").prev().click();
        }
    }
});
