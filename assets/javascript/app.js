var intervalId;
var timeoutId;

var game = {
    questionIdx: -1, //because it will increment and start at 0
    cntRight: 0,
    cntWrong: 0,
    cntNoAnswer: 0,
    clock: 30,
    questions: [
        {
            ask: 'What does IPA stand for?',
            options: ['Imperial Prime Ale', 'India Prime Ale', 'India Pale Ale', 'Imperial Prime Ale'],
            answer: 2
        },
        {
            ask: 'What is added to ferment the mash?',
            options: ['Sugar', 'Yeast', 'Oats', 'Grain'],
            answer: 1
        },
        {
            ask: 'This is done to separate the liquid from the sediment?',
            options: ['Racking', 'Bottling', 'Brewing', 'Boiling'],
            answer: 0
        },
        {
            ask: 'These are added to some beers to provide aroma and flavor, sometime bitterness?',
            options: ['Grains', 'Yeast', 'Sugar', 'Hops'],
            answer: 3
        },
        {
            ask: 'This is done to remove suspended matter in the liquid?',
            options: ['Bottling', 'Filtering', 'Fermenting', 'Brewing'],
            answer: 1
        },
    ],
    startGame: function () {
        console.log('startGame');
        game.init();
        game.startQuestion();
    },
    init: function () {
        console.log('init');
        this.questionIdx = -1;
        this.cntRight = 0;
        this.cntWrong = 0;
        this.cntNoAnswer = 0;
        this.clock = 30;
    },
    startQuestion: function() {
        //#leftoff
        //now that we cleared the container div, we need to create the child divs here
        console.log('startQuestion');
        game.stopQuestion(); //needed by showRight, showWrong, showTimeout but not needed otherwise
        game.questionIdx++;
        if(game.questionIdx < game.questions.length) {
            game.clock = 30;
            game.showQuestion();
            timeoutId = setTimeout(game.doTimeout,1000*30);
            intervalId = setInterval(game.doClock,1000);
        } else {
            game.stopGame();
        }
    },
    showQuestion: function () {
        // console.log('showQuestion');
        // console.log('Question: '+this.questions[this.questionIdx].ask);

        $('.container').html(''); //clear out the div containing the clock, question, and options

        var $div = $('<div>', {id: 'game-clock'});
        $div.text('Clock: '+game.clock);
        $('.container').append($div);

        $div = $('<div>', {id: 'question'});
        $div.text(this.questions[this.questionIdx].ask); 
        $('.container').append($div);

        $div = $('<div>', {id: 'options'});
        $('.container').append($div);

        for(var i=0;i<this.questions[this.questionIdx].options.length;i++) {
            // console.log('Option '+i+': '+this.questions[this.questionIdx].options[i]);
            var button = $('<button>');
            button.addClass('btn-options');
            button.attr('value',i);
            button.text(this.questions[this.questionIdx].options[i]);
            $('#options').append(button);
        }
        $('.btn-options').on('click',this.doAnswer);
        // console.log(this.questions[this.questionIdx].options[this.questions[this.questionIdx].answer]);
    },
    doClock: function () {
        console.log('doClock');
        game.clock--;
        $('#game-clock').text('Clock: '+game.clock);
        if(game.clock===0) { //if we got here, we didn't answer because the clock timeed out
            clearInterval(intervalId); //stop the time clock
        }
    },
    doTimeout: function () {
        console.log('doTimeout');
        game.cntNoAnswer++;
        game.stopQuestion();
        game.showTimeout();
    },
    stopQuestion: function () {
        console.log('stopQuestion');
        clearTimeout(timeoutId);
        clearInterval(intervalId);
    },
    doAnswer: function () {
        game.stopQuestion();
        var theAnswer = $(this).val();
        console.log('button clicked: '+theAnswer);
        console.log('obj answer: '+game.questions[game.questionIdx].answer);
        if(Number(theAnswer) === game.questions[game.questionIdx].answer) {
            game.cntRight++;
            game.showRight();
        } else {
            game.cntWrong++;
            game.showWrong();
        }
    },
    showRight: function () {
        $('.container').html(''); //clear out the div containing the clock, question, and options
        var $h1 = $('<h1>');
        $h1.text('Congratulations!');
        $('.container').append($h1);
        timeoutId = setTimeout(game.startQuestion,1000*3);
    },
    showWrong: function () {
        $('.container').html(''); //clear out the div containing the clock, question, and options
        var $h1 = $('<h1>');
        $h1.text('Sorry, the correct answer is: ');
        $('.container').append($h1);
        timeoutId = setTimeout(game.startQuestion,1000*3);
    },
    showTimeout: function () {
        $('.container').html(''); //clear out the div containing the clock, question, and options
        var $h1 = $('<h1>');
        $h1.text('Sorry, you ran out of time');
        $('.container').append($h1);
        timeoutId = setTimeout(game.startQuestion,1000*3);
    },
    stopGame: function () {
        console.log('stopGame');
        $('.container').html(''); //clear out the div containing the clock, question, and options
        var $h1right = $('<h1>');
        $h1right.text('Right: '+this.cntRight);
        $('.container').append($h1right);
        var $h1wrong = $('<h1>');
        $h1wrong.text(`Wrong: ${this.cntWrong}`); //trying template literal syntax
        $('.container').append($h1wrong);
        var $h1noanswer = $('<h1>');
        $h1noanswer.text(`No Answer: ${this.cntNoAnswer}`);
        $('.container').append($h1noanswer);
    }
};

$('#start-game').on('click', game.startGame);
