{
    // HTMLファイルが読み込まれた際に実行される関数
    window.onload = function () {
        // URLから結果をGET方式で取得
        var res = getResult();
        if(res == "clear"){
            clearElement();
        } else {
            failedElement();
        }
    }

    function getResult() {
        var url = new URL(window.location.href);
        var params = url.searchParams;
        console.log(params.get('res'));
        return params.get('res');
    }

    function clearElement() {
        var back = document.getElementById("body");
        back.style.backgroundImage = "url(./image/labo_safed.jpg)";
        var logo = document.getElementById("ResultLogo");
        logo.src = "./image/clear_logo.png";
    }

    function failedElement() {
        var back = document.getElementById("body");
        back.style.backgroundImage = "url(./image/labo_bombered.jpg)";
        var logo = document.getElementById("ResultLogo");
        logo.src = "./image/fail_logo.png";
    }
}