{
    var quiz_category = "Unknown";

    function getQuizCategory() {
        document.getElementById('QuizCategory').innerHTML = quiz_category;
        // document.getElementById('QuizCategory').textContent = quiz_category;
    }

    function selectGeo() {
        quiz_category = "Geography";
        ToGameScene();
    }

    function selectHistory() {
        quiz_category = "History";
        ToGameScene();
    }

    function selectLiter() {
        quiz_category = "Literature";
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
        var images = document.querySelectorAll(".SelectButton");
        images.forEach(function (image) {
            image.addEventListener("click", function () {
                images.forEach(function (img) {
                    img.style.display = "none";
                });
            });
        });
        // 解答ボードを表示
        var answerBoards = document.getElementsByClassName("AnswerBoard");
        for (var i = 0; i < answerBoards.length; i++) {
            answerBoards[i].style.display = "flex";
        }

    }

    function ToSelectScene() {
        // セレクトボタンを表示
        var selectButtons = document.querySelectorAll(".SelectButton");
        for (var i = 0; i < selectButtons.length; i++) {
            selectButtons[i].style.display = "block";
        }
    }
}