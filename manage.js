{
    // ゲーム画面に移行するときにどのカテゴリーかを判断する
    var quiz_genre = "Unknown";
    // jsonが格納されている変数
    var json_question, json_answer, json_another;
    // クイズカテゴリーに応じた回答リストと別解リストを保持する変数
    var ques, ans_list, another_list;
    // 正答数
    var answered = 0;

    // HTMLファイルが読み込まれた際に実行される関数
    window.onload = function () {
        // jsonをセット
        set_json();
        // URLからジャンルをGET方式で取得
        getQuizGenre();
        // 入力フォームでエンターキーが使えるように設定
        var form = document.getElementById("AnswerBox");
        form.addEventListener("keypress", handleKeyPress);
        // クイズジャンルにしたがって問題文と選択肢をセット
        setElementText();
        // 問題文を読み、BGMとカウントダウンを開始する
        setAudio();
    }

    function getQuizGenre() {
        var url = new URL(window.location.href);
        var params = url.searchParams;
        var c = params.get('genre');
        if(c == "Lit") {
            quiz_genre = "Literature";
        } else if(c == "Geo"){
            quiz_genre = "Geography";
        } else if(c == "His"){
            quiz_genre = "History";
        } else if(c == "Eng"){
            quiz_genre = "English";
        } else if(c == "Uni"){
            quiz_genre = "Univ";
        } else if(c == "Mus"){
            quiz_genre = "Music";
        } else if(c == "Com"){
            quiz_genre = "Comic";
        } else if(c == "Pok"){
            quiz_genre = "Pokemon";
        }
    }

    function setElementText() {
        setListByGenre();
        var question_board = document.getElementById("Question");
        question_board.innerHTML = ques;
        for (var i = 1; i <= 10; i++) {
            var board_id = "T" + i;
            var board = document.getElementById(board_id);
            if (board) {
                board.innerHTML = ans_list[i - 1]["inittext"];
                board.style.fontSize = DefineFontSizeByStrlen(ans_list[i - 1]["inittext"]);
            }
        }
        
    }

    function setListByGenre(){
        // Genreの問題文を取得・格納
        json_question["obj"].forEach(function(elm) {
            if(elm["genre"] == quiz_genre){
                ques = elm["question"];
            }
        });
        // Genreの解答一覧を取得・格納
        ans_list = [];
        json_answer["obj"].forEach(function(elm) {
            if(elm["genre"] == quiz_genre){
                ans_list.push(elm);
            }
        });
        // ans_listに格納されている解答の別解を取得
        another_list = [];
        ans_list.forEach(function(elm){
            json_another["obj"].forEach(function(elm2) {
                if(elm["answer"] == elm2["answer"]){
                    another_list.push(elm2);
                }
            });
        });
    }

    function setAudio() {
        var audioPlayer = document.getElementById("audio");
        var audioFile = "./audio/"+quiz_genre+".wav";
        audioPlayer.src = audioFile;        

        audioPlayer.addEventListener("ended", function () {
            // 読み上げが終了したときにBGMを再生
            audioPlayer.src = "./audio/gameBGM.mp3";
            audioPlayer.addEventListener("ended", function() {
                audioPlayer.src = "./audio/bomb.mp3";
                audioPlayer.play();
                setTimeout(function() {
                    window.location.href = './result.html?res=fail';
                }, 3000); // 4秒後にセレクト画面へ移行
            });
            audioPlayer.play();
        });
    }
    
    function getInputValue() {
        var inputValue = document.getElementById("AnswerBox").value;
        document.getElementById("AnswerBox").value = "";
        inputValue = changeFromAnotherAnswer(inputValue); // 別解は正答に変更
        console.log(inputValue);
        if(checkAnsList(inputValue) && checkAnswerBoard(inputValue)){
            // 該当のボードの画像と文字列を変更
            changeBoard(inputValue);
            answered ++;
            if(answered >= 10){
                window.location.href = './result.html?res=clear';
            }
        }
    }

    function handleKeyPress(event) {
        if (event.keyCode === 13) { // Enterキーのキーコードは13
            event.preventDefault(); // フォームのデフォルト送信を防止
            getInputValue(); // フォーム送信の代わりに関数を呼び出す
        }
    }

    function checkAnsList(input) {
        // 回答がans_listに含まれているか確認
        var ret = false;
        ans_list.forEach(function(elm) {
            if(elm["answer"] == input){
                ret = true;
            }
        });
        return ret;
    }

    function checkAnswerBoard(input) {
        // 既に回答されたものでないか確認
        var ret = true;
        for (var i = 1; i <= 10; i++) {
            var board_id = "T" + i;
            var board = document.getElementById(board_id);
            if (board) {
                if(board.innerHTML == input){
                    ret = false;
                }
            }
        }
        return ret;
    }

    function changeFromAnotherAnswer(input) {
        // 別解だった場合、正答に変更
        var ret = input;
        another_list.forEach(function(elm) {
            elm["another"].forEach(function(elm2) {
                if(elm2 == input){
                    ret = elm["answer"];
                }
            });
            
        });
        return ret;
    }

    function changeBoard(input) {
        var inittext;
        ans_list.forEach(function (elm) {
            if (elm["answer"] == input) {
                inittext = elm["inittext"];
            }
        });
        var changed_text, changed_board;
        for (var i = 10; i >= 1; i--) {
            var text_id = "T" + i;
            var text = document.getElementById(text_id);
            if (text) {
                if (text.innerHTML == inittext) {
                    changed_board = document.getElementById("B" + i);
                    changed_text = text;
                }
            }
        }
        changed_board.src = "./image/correct_board.png";
        changed_text.innerHTML = input;
        changed_text.style.fontSize = DefineFontSizeByStrlen(input);
        changed_text.style.color = "white";
    }

    function DefineFontSizeByStrlen(str) {
        var ret = "5px";
        if(str.length <= 5) {
            ret = "24px";
        } else if(str.length <= 9) {
            ret = "20px";
        } else if(str.length <= 14) {
            ret = "16px";
        } else {
            ret = "12px";
        }
        return ret;
    }

    // jsonをセット（嫌だけど直書き）
    function set_json() {
        json_question = {
            "obj": [
                {"question": "家康を除いた徳川15代将軍、10人答えよ", "genre": "History"},
                {"question": "次の冒頭で始まる物語、全て答えよ", "genre": "Literature"},
                {"question": "次の難読地名、ひらがなで全て答えよ", "genre": "Geography"},
                {"question": "次の英文、全て日本のことわざに言い換えよ", "genre": "English"},
                {"question": "静岡大学の学部・研究所、全て答えよ", "genre": "Univ"},
                {"question": "次のマンガ・アニメの作者、ペンネームで全て答えよ", "genre": "Comic"},
                {"question": "2020年のポケモン・オブ・ザ・イヤー（人気投票）で<br>トップ10にランクインしたポケモン、全て答えよ", "genre": "Pokemon"},
                {"question": "2023年上半期の総合ソング・チャートで<br>トップ20にランクインした曲、10曲答えよ", "genre": "Music"},
                {"question": "該当の問題は存在しません", "genre": "Unknown"}
            ]
        };
        json_answer = {
            "obj": [
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川秀忠"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家光"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家綱"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川綱吉"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家宣"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家継"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川吉宗"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家重"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家治"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家斉"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家慶"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家定"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川家茂"},
                {"genre": "History", "inittext": "徳川○○", "answer": "徳川慶喜"},
        
                {"genre": "Literature", "inittext": "祇園精舎の鐘の声、<br>諸行無常の響あり", "answer": "平家物語"},
                {"genre": "Literature", "inittext": "今は昔、竹取の翁といふ者ありけり", "answer": "竹取物語"},
                {"genre": "Literature", "inittext": "春はあけぼの", "answer": "枕草子"},
                {"genre": "Literature", "inittext": "男もすなる日記といふものを、<br>女もしてみむとてするなり", "answer": "土佐日記"},
                {"genre": "Literature", "inittext": "ある日の暮方の事である。<br>一人の下人が、羅生門の下で<br>雨やみを待っていた", "answer": "羅生門"},
                {"genre": "Literature", "inittext": "吾輩は猫である。名前はまだない", "answer": "吾輩は猫である"},
                {"genre": "Literature", "inittext": "これは、わたしが小さいときに、<br>村の茂兵というおじいさんから<br>きいたお話です", "answer": "ごんぎつね"},
                {"genre": "Literature", "inittext": "まったく、<br>豆太ほどおくびょうなやつはいない", "answer": "モチモチの木"},
                {"genre": "Literature", "inittext": "広い海のどこかに、<br>小さな魚のきょうだいたちが、<br>楽しくくらしていた", "answer": "スイミー"},
                {"genre": "Literature", "inittext": "にちようびの あさ うまれた<br>ちっぽけな あおむしは、<br>おなかが ぺっこぺこ", "answer": "はらぺこあおむし"},
        
                {"genre": "Geography", "inittext": "苫小牧", "answer": "とまこまい"},
                {"genre": "Geography", "inittext": "弘前", "answer": "ひろさき"},
                {"genre": "Geography", "inittext": "真岡", "answer": "もおか"},
                {"genre": "Geography", "inittext": "我孫子", "answer": "あびこ"},
                {"genre": "Geography", "inittext": "蒲郡", "answer": "がまごおり"},
                {"genre": "Geography", "inittext": "函南", "answer": "かんなみ"},
                {"genre": "Geography", "inittext": "枚方", "answer": "ひらかた"},
                {"genre": "Geography", "inittext": "斑鳩", "answer": "いかるが"},
                {"genre": "Geography", "inittext": "諫早", "answer": "いさはや"},
                {"genre": "Geography", "inittext": "廿日市", "answer": "はつかいち"},
        
                {"genre": "English", "inittext": "Seeing is believing", "answer": "百聞は一見に如かず"},
                {"genre": "English", "inittext": "Kill two birds with one stone", "answer": "一石二鳥"},
                {"genre": "English", "inittext": "Tomorrow is another day", "answer": "明日は明日の風が吹く"},
                {"genre": "English", "inittext": "Failure teaches success", "answer": "失敗は成功のもと"},
                {"genre": "English", "inittext": "So many men, so many minds", "answer": "十人十色"},
                {"genre": "English", "inittext": "After a storm comes a calm", "answer": "雨降って地固まる"},
                {"genre": "English", "inittext": "When in Rome, <br>do as the Romans do", "answer": "郷に入っては郷に従え"},
                {"genre": "English", "inittext": "Out of the mouth comes evil", "answer": "口は災いの元"},
                {"genre": "English", "inittext": "Practoce makes perfect", "answer": "習うより慣れろ"},
                {"genre": "English", "inittext": "Example is <br>better than percept", "answer": "論より証拠"},
        
                {"genre": "Univ", "inittext": "学部", "answer": "情報学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "工学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "理学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "教育学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "農学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "人文社会学部"},
                {"genre": "Univ", "inittext": "学部", "answer": "グローバル共創科学部"},
                {"genre": "Univ", "inittext": "学環", "answer": "地域創造学環"},
                {"genre": "Univ", "inittext": "研究所", "answer": "電子工学研究所"},
                {"genre": "Univ", "inittext": "研究所", "answer": "グリーン科学技術研究所"},
        
                {"genre": "Pokemon", "inittext": "第1位", "answer": "ゲッコウガ"},
                {"genre": "Pokemon", "inittext": "第2位", "answer": "ルカリオ"},
                {"genre": "Pokemon", "inittext": "第3位", "answer": "ミミッキュ"},
                {"genre": "Pokemon", "inittext": "第4位", "answer": "リザードン"},
                {"genre": "Pokemon", "inittext": "第5位", "answer": "ブラッキー"},
                {"genre": "Pokemon", "inittext": "第6位", "answer": "ニンフィア"},
                {"genre": "Pokemon", "inittext": "第7位", "answer": "ガブリアス"},
                {"genre": "Pokemon", "inittext": "第8位", "answer": "レックウザ"},
                {"genre": "Pokemon", "inittext": "第9位", "answer": "サーナイト"},
                {"genre": "Pokemon", "inittext": "第10位", "answer": "ゲンガー"},
        
                {"genre": "Comic", "inittext": "ドラゴンボール", "answer": "鳥山明"},
                {"genre": "Comic", "inittext": "ワンピース", "answer": "尾田栄一郎"},
                {"genre": "Comic", "inittext": "銀魂", "answer": "空知英秋"},
                {"genre": "Comic", "inittext": "鬼滅の刃", "answer": "吾峠呼世晴"},
                {"genre": "Comic", "inittext": "チェンソーマン", "answer": "藤本タツキ"},
                {"genre": "Comic", "inittext": "鋼の錬金術師", "answer": "荒川弘"},
                {"genre": "Comic", "inittext": "名探偵コナン", "answer": "青山剛昌"},
                {"genre": "Comic", "inittext": "やなせたかし", "answer": "アンパンマン"},
                {"genre": "Comic", "inittext": "ちびまる子ちゃん", "answer": "さくらももこ"},
                {"genre": "Comic", "inittext": "サザエさん", "answer": "長谷川町子"},
        
                {"genre": "Music", "inittext": "", "answer": "Subtitle"},
                {"genre": "Music", "inittext": "", "answer": "KICK BACK"},
                {"genre": "Music", "inittext": "", "answer": "アイドル"},
                {"genre": "Music", "inittext": "", "answer": "怪獣の花唄"},
                {"genre": "Music", "inittext": "", "answer": "第ゼロ勘"},
                {"genre": "Music", "inittext": "", "answer": "新時代"},
                {"genre": "Music", "inittext": "", "answer": "W/X/Y"},
                {"genre": "Music", "inittext": "", "answer": "Overdose"},
                {"genre": "Music", "inittext": "", "answer": "ミックスナッツ"},
                {"genre": "Music", "inittext": "", "answer": "アイラブユー"},
                {"genre": "Music", "inittext": "", "answer": "ダンスホール"},
                {"genre": "Music", "inittext": "", "answer": "シンデレラボーイ"},
                {"genre": "Music", "inittext": "", "answer": "Habit"},
                {"genre": "Music", "inittext": "", "answer": "水平線"},
                {"genre": "Music", "inittext": "", "answer": "祝福"},
                {"genre": "Music", "inittext": "", "answer": "ドライフラワー"},
                {"genre": "Music", "inittext": "", "answer": "Ditto"},
                {"genre": "Music", "inittext": "", "answer": "私は最強"},
                {"genre": "Music", "inittext": "", "answer": "Soranji"},
                {"genre": "Music", "inittext": "", "answer": "ペテルギウス"}
            ]
        };
        json_another = {
            "obj": [
                {"answer": "徳川秀忠", "another": ["秀忠", "ひでただ", "とくがわひでただ"]},
                {"answer": "徳川家光", "another": ["家光", "いえみつ", "とくがわいえみつ"]},
                {"answer": "徳川家綱", "another": ["家綱", "いえつな", "とくがわいえつな"]},
                {"answer": "徳川綱吉", "another": ["綱吉", "つなよし", "とくがわつなよし"]},
                {"answer": "徳川家宣", "another": ["家宣", "いえのぶ", "とくがわいえのぶ"]},
                {"answer": "徳川家継", "another": ["家継", "いえつぐ", "とくがわいえつぐ"]},
                {"answer": "徳川吉宗", "another": ["吉宗", "よしむね", "とくがわよしむね"]},
                {"answer": "徳川家重", "another": ["家重", "いえしげ", "とくがわいえしげ"]},
                {"answer": "徳川家治", "another": ["家治", "いえはる", "とくがわいえはる"]},
                {"answer": "徳川家斉", "another": ["家斉", "いえなり", "とくがわいえなり"]},
                {"answer": "徳川家慶", "another": ["家慶", "いえよし", "とくがわいえよし"]},
                {"answer": "徳川家定", "another": ["家定", "いえさだ", "とくがわいえさだ"]},
                {"answer": "徳川慶喜", "another": ["慶喜", "よしのぶ", "とくがわよしのぶ"]},
        
                {"answer": "平家物語", "another": ["へいけものがたり"]},
                {"answer": "竹取物語", "another": ["たけとりものがたり"]},
                {"answer": "枕草子", "another": ["まくらのそうし"]},
                {"answer": "土佐日記", "another": ["とさにっき"]},
                {"answer": "羅生門", "another": ["らしょうもん"]},
                {"answer": "吾輩は猫である", "another": ["わがはいはねこである"]},
                {"answer": "ごんぎつね", "another": []},
                {"answer": "モチモチの木", "another": ["もちもちのき"]},
                {"answer": "スイミー", "another": ["すいみー"]},
                {"answer": "はらぺこあおむし", "another": []},
        
                {"answer": "とまこまい", "another": []},
                {"answer": "ひろさき", "another": []},
                {"answer": "もおか", "another": []},
                {"answer": "あびこ", "another": []},
                {"answer": "がまごおり", "another": []},
                {"answer": "かんなみ", "another": []},
                {"answer": "ひらかた", "another": []},
                {"answer": "いかるが", "another": []},
                {"answer": "いさはや", "another": []},
                {"answer": "はつかいち", "another": []},
        
                {"answer": "ゲッコウガ", "another": ["げっこうが"]},
                {"answer": "ルカリオ", "another": ["るかりお"]},
                {"answer": "ミミッキュ", "another": ["みみっきゅ"]},
                {"answer": "リザードン", "another": ["りざーどん"]},
                {"answer": "ブラッキー", "another": ["ぶらっきー"]},
                {"answer": "ニンフィア", "another": ["にんふぃあ"]},
                {"answer": "ガブリアス", "another": ["がぶりあす"]},
                {"answer": "レックウザ", "another": ["れっくうざ"]},
                {"answer": "サーナイト", "another": ["さーないと"]},
                {"answer": "ゲンガー", "another": ["げんがー"]},
        
                {"answer": "鳥山明", "another": ["とりやまあきら"]},
                {"answer": "尾田栄一郎", "another": ["おだえいいちろう"]},
                {"answer": "空知英秋", "another": ["そらちひであき"]},
                {"answer": "吾峠呼世晴", "another": ["ごとうげこよはる"]},
                {"answer": "藤本タツキ", "another": ["ふじもとたつき"]},
                {"answer": "荒川弘", "another": ["あらかわひろむ"]},
                {"answer": "青山剛昌", "another": ["あおやまごうしょう"]},
                {"answer": "やなせたかし", "another": []},
                {"answer": "さくらももこ", "another": []},
                {"answer": "長谷川町子", "another": ["はせがわまちこ"]},
        
                {"answer": "百聞は一見に如かず", "another": ["ひゃくぶんはいっけんにしかず", "百聞は一見にしかず"]},
                {"answer": "一石二鳥", "another": ["いっせきにちょう"]},
                {"answer": "明日は明日の風が吹く", "another": ["あしたはあしたのかぜがふく", "あすはあすのかぜがふく", "明日は明日の風がふく"]},
                {"answer": "失敗は成功のもと", "another": ["しっぱいはせいこうのもと", "失敗は成功の基"]},
                {"answer": "十人十色", "another": ["じゅうにんといろ"]},
                {"answer": "雨降って地固まる", "another": ["あめふってじかたまる", "あめふってぢかたまる"]},
                {"answer": "郷に入っては郷に従え", "another": ["ごうにいってはごうにしたがえ"]},
                {"answer": "口は災いの元", "another": ["くちはわざわいのもと"]},
                {"answer": "習うより慣れろ", "another": ["ならうよりなれろ", "習うより慣れよ", "ならうよりなれよ"]},
                {"answer": "論より証拠", "another": ["ろんよりしょうこ"]},
        
                {"answer": "情報学部", "another": ["じょうほうがくぶ"]},
                {"answer": "工学部", "another": ["こうがくぶ"]},
                {"answer": "理学部", "another": ["りがくぶ"]},
                {"answer": "教育学部", "another": ["きょういくがくぶ"]},
                {"answer": "農学部", "another": ["のうがくぶ"]},
                {"answer": "人文社会学部", "another": ["じんぶんしゃかいがくぶ"]},
                {"answer": "グローバル共創科学部", "another": ["ぐろーばるきょうそうかがくぶ"]},
                {"answer": "地域創造学環", "another": ["ちいきそうぞうがっかん"]},
                {"answer": "電子工学研究所", "another": ["でんしこうがくけんきゅうじょ"]},
                {"answer": "グリーン科学技術研究所", "another": ["ぐりーんかがくぎじゅつけんきゅうじょ"]},
        
                {"answer": "Subtitle", "another": ["サブタイトル", "subtitle", "さぶたいとる"]},
                {"answer": "KICK BACK", "another": ["キックバック", "きっくばっく", "kick back", "KICKBACK"]},
                {"answer": "アイドル", "another": ["あいどる"]},
                {"answer": "怪獣の花唄", "another": ["かいじゅうのはなうた"]},
                {"answer": "第ゼロ勘", "another": ["だいぜろかん"]},
                {"answer": "新時代", "another": ["しんじだい"]},
                {"answer": "W/X/Y", "another": ["WXY", "ダブリューエックスワイ", "だぶりゅーえっくすわい"]},
                {"answer": "Overdose", "another": ["overdose", "オーバードーズ", "おーばーどーず", "オーバードース", "おーばーどーす"]},
                {"answer": "ミックスナッツ", "another": ["みっすくなっつ"]},
                {"answer": "アイラブユー", "another": ["あいらぶゆー"]},
                {"answer": "ダンスホール", "another": ["だんすほーる"]},
                {"answer": "シンデレラボーイ", "another": ["しんでれらぼーい"]},
                {"answer": "Habit", "another": ["habit", "ハビット", "はびっと"]},
                {"answer": "水平線", "another": ["すいへいせん"]},
                {"answer": "祝福", "another": ["しゅくふく"]},
                {"answer": "ドライフラワー", "another": ["ドライフラワー"]},
                {"answer": "Ditto", "another": ["ditto", "ディト", "でぃと"]},
                {"answer": "私は最強", "another": ["わたしはさいきょう", "わたしは最強"]},
                {"answer": "Soranji", "another": ["soranji", "ソランジ", "そらんじ"]},
                {"answer": "ペテルギウス", "another": ["ぺてるぎうす"]}
            ]
        };
    }
}