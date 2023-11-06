{
    // ゲーム画面に移行するときにどのカテゴリーかを判断する
    var quiz_category = "Unknown";
    // jsonが格納されている変数
    var json_question, json_answer, json_another;
    // クイズカテゴリーに応じた回答リストと別解リストを保持する変数
    var ans_list, another_list;

    // HTMLファイルが読み込まれた際に実行される関数
    window.onload = function () {
        load_json();
    }

    // jsonファイルを読み込む
    function load_json() {
        // question.jsonを読み込み
        fetch("./json/question.json")
            .then(response => response.json())
            .then(data => {
                // 読み込んだJSONデータを変数に格納
                json_question = JSON.parse(data);
            });
        // answer.jsonを読み込み
        fetch("./json/answer.json")
            .then(response => response.json())
            .then(data => {
                // 読み込んだJSONデータを変数に格納
                json_answer = JSON.parse(data);
            });
        // another.jsonを読み込み
        fetch("./json/another.json")
            .then(response => response.json())
            .then(data => {
                // 読み込んだJSONデータを変数に格納
                json_another = JSON.parse(data);
            });
    }

    function selectLiter() {
        quiz_category = "Literature";
        ToGameScene();
    }

    function selectGeo() {
        quiz_category = "Geography";
        ToGameScene();
        setListByCategory();
        for (var i = 1; i <= 10; i++) {
            var board_id = "B" + i;
            var board = document.getElementById(board_id);
            if (board) {
                board.innerHTML = "こんにちは";
            }
        }
    }

    function selectHistory() {
        quiz_category = "History";
        ToGameScene();
    }

    function selectComic() {
        quiz_category = "Comic";
        ToGameScene();
    }

    function selectPokemon() {
        quiz_category = "Pokemon";
        ToGameScene();
    }

    function ToGameScene() {
        // 「問題一覧」を非表示
        var select_logo = document.getElementById("SelectLogo");
        select_logo.style.display = "none";
        // セレクトボタンを非表示
        var table = document.getElementById("SelectTable");
        table.style.display = "none";
        var images = document.querySelectorAll(".SelectButton");
        images.forEach(function (image) {
            image.addEventListener("click", function () {
                images.forEach(function (img) {
                    img.style.display = "none";
                });
            });
        });
        // タイトルへ戻るボタンを非表示
        var title_button = document.getElementById("title_button");
        title_button.style.display = "none";
        // 問題ボードを表示
        var questionboard = document.getElementById("QuestionBoard");
        questionboard.style.display = "block";
        // 解答ボードを表示
        var answerBoards = document.getElementsByClassName("AnswerBoard");
        for (var i = 0; i < answerBoards.length; i++) {
            answerBoards[i].style.display = "block";
        }

    }

    function ToSelectScene() {
        // セレクトボタンを表示
        var selectButtons = document.querySelectorAll(".SelectButton");
        for (var i = 0; i < selectButtons.length; i++) {
            selectButtons[i].style.display = "block";
        }
    }

    function setListByCategory() {

    }
}