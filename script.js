
var possibleAnswers = [];
var score = 0;
var best = localStorage.getItem("best") ? localStorage.getItem("best") : 0;

$(document).ready( function() {
    NewQuestion();
});

function GetData() {
    let isCacheSupported = 'caches' in window;

    caches.open('triviaCache').then( cache => {
    });
}

function NewQuestion() {

    // Clear possible answers
    possibleAnswers = [];

    // Display the score
    $("#score").html("Streak: " + score + " Best: " + best);

    var url = 'https://the-trivia-api.com/api/questions?limit=1';

    // fetch the new question
    fetch(url, {
        method : "GET",
        mode: 'cors',
        headers: {}
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
    .then(data => {
        
        var question = data[0];

        // console.log("Question is: " + question.question);

        $('#questionText').html( question.question );

        question.incorrectAnswers.forEach((answer) => {
            possibleAnswers.push(
                { text: answer, correct: false }
            );
        });

        possibleAnswers.push(
            { text: question.correctAnswer, correct: true }
        );

        possibleAnswers.sort(() => Math.random() - 0.5);
        
        let i = 0;
        possibleAnswers.forEach( (currQuestion) => {

            $(`#answer${i}`).html( currQuestion.text );
            i++;
        });

        // reactive the answers
        $(`.answers`).css("background-color", '');
        $('.answers').prop('disabled', false);
        $('body').css("background", "rgb(188, 255, 255)");
        
    })
    .catch(function(error) {
        console.log(error)
    });
}

function CheckAnswer(index) {

    $('.answers').prop('disabled', true);

    console.log(possibleAnswers[index].correct)

    for ( let ii = 0; ii < possibleAnswers.length; ii++ ) {

        if ( possibleAnswers[ii].correct ) {
            $(`#answer${ii}`).css("background-color", "green");
        } else {
            $(`#answer${ii}`).css("background-color", "red");
        }
    }

    if (possibleAnswers[index].correct) {

        $('body').css("background", "green");
        score++;
        
        if ( score > best )
            localStorage.setItem("best", score);
            best = score;
        
        $("#score").html("Streak: " + score + " Best: " + best);
        
    } else {
        score = 0;
        $('body').css("background", "red");
        $("#score").html("Streak: " + score + " Best: " + best);
    }    
}
