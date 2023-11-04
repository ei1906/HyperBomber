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

    function ToGameScene() {
       // JavaScriptを使ってクラスを持つすべての画像をクリックしたときに非表示にする関数を作成
       var images = document.querySelectorAll(".SelectButton");
       images.forEach(function(image) {
           image.addEventListener("click", function() {
               images.forEach(function(img) {
                   img.style.display = "none";
               });
           });
       });
    }

    function ToSelectScene() {
        var but_select = document.getElementsByClassName("SelectButton");
        var board_answer = document.getElementsByClassName("AnswerBoard");
        but_select.display = "display";
        board_answer.display = "none";
     }
}