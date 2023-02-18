
var possibleAnswers = [];
var score = 0;
var best = localStorage.getItem("best") ? localStorage.getItem("best") : 0;

function NewQuestion() {

    // Clear possible answers
    possibleAnswers = [];

    // Display the score
    $("#score").html("Streak: " + score + " Best: " + best);

    // Determine difficulty
    let difficulty = "easy"; // default
    if ( score > 15 ) {
        difficulty = "hard";
    } else if (score > 8 ) {
        difficulty = "medium";
    }

    console.log(difficulty);

    var url = 'https://the-trivia-api.com/api/questions?limit=1&difficulty=' + difficulty;

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
        
    })
    .catch(function(error) {
        console.log(error)
    });
}

function CheckAnswer(index) {

    $('.answers').prop('disabled', true);

    for ( let ii = 0; ii < possibleAnswers.length; ii++ ) {

        if ( possibleAnswers[ii].correct ) {
            $(`#answer${ii}`).css("background-color", "green");
        } else {
            $(`#answer${ii}`).css("background-color", "red");
        }
    }

    if (possibleAnswers[index].correct) {

        score++;
        
        if ( score > best ) {
            localStorage.setItem("best", score);
            best = score;
        }
        
        $("#score").html("Streak: " + score + " Best: " + best);
        
    } else {
        score = 0;
        $("#score").html("Streak: " + score + " Best: " + best);
    }    
}

$(document).ready( function() {
    NewQuestion();
});
