let answer1 = "10";
let answer2 = "Islamabad";
let answer3 = "blue";

function calculateScore() {

    let score = 0;

    let q1 = document.getElementById("q1").value;
    let q2 = document.getElementById("q2").value;
    let q3 = document.getElementById("q3").value;

    if (q1 == answer1) score++;
    if (q2.toLowerCase() == answer2.toLowerCase()) score++;
    if (q3.toLowerCase() == answer3.toLowerCase()) score++;

    let result = document.getElementById("result");

    result.innerText = "Your Score: " + score + " / 3";

    if (score == 3) {
        result.style.background = "#4CAF50";
        result.style.color = "white";
        result.innerText += " 🎉 Excellent!";
    }
    else if (score == 2) {
        result.style.background = "#ff9800";
        result.style.color = "white";
        result.innerText += " 👍 Good Job!";
    }
    else {
        result.style.background = "#f44336";
        result.style.color = "white";
        result.innerText += " 😢 Try Again!";
    }
}

function resetQuiz() {

    document.getElementById("q1").value = "";
    document.getElementById("q2").value = "";
    document.getElementById("q3").value = "";

    let result = document.getElementById("result");
    result.innerText = "";
    result.style.background = "transparent";
}
