var questionContainer,
    correctAnswerContainer,
    wrongAnswerContainer,
    settingsContainer,

    answerButton,
    questionButtonRight,
    questionButtonWrong,
    giveUpButton,
    settingsButton,
    saveSettingsButton,
    addTranslationButton,

    answerField,
    wordContainer,
    translationContainer,

    currentQuestion,
    settingsForm,
    dictionary;


function init(){
    questionContainer = $('#question');
    correctAnswerContainer = $('#right-answer');
    wrongAnswerContainer = $('#wrong-answer');
    settingsContainer = $('#settings');

    questionButtonRight = $('#question-button-right');
    questionButtonWrong = $('#question-button-wrong');
    answerButton = $('#answer-button');
    giveUpButton = $('#give-up-button');
    settingsButton = $('#settings-button');
    saveSettingsButton = $('.save-settings');
    addTranslationButton = $('#add-translation-button');

    answerField = $('#answer');
    wordContainer = $('.word');
    translationContainer = $('.translation');
    settingsForm = $('#setting-form');

    answerButton.on('click', answer);
    questionButtonRight.on('click', ask);
    questionButtonWrong.on('click', ask);
    giveUpButton.on('click', wrong);
    settingsButton.on('click', settings);
    saveSettingsButton.on('click', saveSettings);
    addTranslationButton.on('click', addTranslation);

    dictionary = loadSettings() || [];

    populateSettings();

    if(dictionary.length) {
        currentQuestion = getRandomQuestion();
        setQuestion(currentQuestion);
    }
    else {
        settings();
    }
}

// ------------ Questions and answers ------------ //

function getRandomQuestion(){
    var index = Math.floor(Math.random() * dictionary.length);
    return dictionary[index];
}

function setQuestion(question){
    wordContainer.html(question.word);
    translationContainer.html(question.translation);
}

function ask(){
    currentQuestion = getRandomQuestion();


    show(questionContainer);
    setTimeout(function(){
        setQuestion(currentQuestion);
        answerField.focus();
    }, 550);
}

function answer(){
    var answer = answerField.val();
    if(answer === currentQuestion.translation){
        correct();
    }
    else{
        wrong();
    }

}

function correct(){
    show(correctAnswerContainer);
    questionButtonRight.focus();
}

function wrong(){
    show(wrongAnswerContainer);
    questionButtonWrong.focus();
}

// ------------ Settings ------------ //

function settings(){
    show(settingsContainer);
}

function saveSettings(){
    localStorage.dic = JSON.stringify(dictionary);
    ask();
}

function loadSettings(){
    if(localStorage.dic) {
        return JSON.parse(localStorage.dic);
    }
}

function addTranslation(){
    var pair = {},
        index,
        newWord = $('.new-original-word'),
        newTranslation = $('.new-translated-word');

    pair.word = newWord.val();
    pair.translation = newTranslation.val();
    index = dictionary.length;

    newWord.val('');
    newTranslation.val('');

    renderItem(pair, index);
    dictionary.push(pair);
}

function renderItem(pair, index){
    var settingTemplate =  '<div class="form-group">\
                                <label>Original</label>\
                                <input type="text" class="form-control original-word">\
                                <label>Translation</label>\
                                <input type="text" class="form-control translated-word">\
                                <button class="btn btn-danger">remove</button>\
                            </div>',
        pairFields;

    pairFields = $(settingTemplate);
    pairFields.find('.original-word').val(pair.word);
    pairFields.find('.translated-word').val(pair.translation);
    pairFields.attr('index', index);
    settingsForm.append(pairFields);
}

function populateSettings(){

    function render(){
        settingsForm.find('[index]').remove();

        dictionary.forEach(function(pair, index){
            renderItem(pair, index);
        });
    }

    settingsForm.on('keyup', function(e){
        var row = $(e.target).closest('[index]'),
            index = parseInt(row.attr('index'), 10);

        if(row.length) {
            dictionary[index].word = row.find('.original-word').val();
            dictionary[index].translation = row.find('.translated-word').val();
        }
    });

    settingsForm.on('click', '.btn-danger', function(e){
        var row = $(e.target).closest('[index]'),
            index = parseInt(row.attr('index'), 10);

        if(row.length) {
            row.remove();
            dictionary.splice(index, 1);
            render();
        }
    });

    render();
}

// ------------ General ------------ //

function show(container){
    container.addClass('go-in');
    setTimeout(function(){
        $('.current').removeClass('current');
        container.removeClass('go-in');
        container.addClass('current');
    }, 550);
}

$(init);