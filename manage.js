{
    var quiz_category = "Unknown";

    function getQuizCategory() {
        document.getElementById('QuizCategory').innerHTML = quiz_category;
        // document.getElementById('QuizCategory').textContent = quiz_category;
    }

    function setQuizCategory(str) {
        quiz_category = str;
    }

    function selectGeo() {
        quiz_category = "Geography";
    }

    const selectHistory = () => {
        quiz_category = "History";
    }

    const selectLiter = () => {
        quiz_category = "Literature";
    }

    const selectComic = () => {
        quiz_category = "Comic";
    }

    function ChangeParaToDate() {
        document.getElementById('eid_date').innerHTML = Date();
    }
}