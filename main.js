const startSection = document.querySelector("section.start");
const quizSection = document.querySelector("section.quiz");
const endGameSection = document.querySelector("section.end");
const nextBtn = document.getElementById("submit");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");

let score = 0;
let questionIndex = 0;
let questions;
let interval;

startBtn.addEventListener("click", () => {
  startSection.classList.add("d-none");
  quizSection.classList.remove("d-none");
  getQuestions().then((data) => {
    questions = data;
    displayQuestion(questions[questionIndex]);
  });
});

nextBtn.addEventListener("click", () => {
  let userHasChoose = false;
  document.querySelectorAll("input[type='radio']").forEach((e) => {
    if (e.checked) {
      userHasChoose = true;
    }
  });
  if (!userHasChoose) {
    return;
  }
  clearInterval(interval);
  submit(questions[questionIndex]);
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

async function getQuestions() {
  const res = await fetch("./questions.json");
  const questions = await res.json();
  return questions;
}

function displayQuestion(q) {
  quizSection.querySelector("ul.answers").innerHTML = "";
  quizSection.querySelector("h2").innerText = q.title;
  quizSection.querySelector("h4").innerHTML = `Question ${
    questionIndex + 1
  } out of 10`;
  for (let i in q.answers) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.setAttribute("for", q.answers[i]);
    label.innerText = q.answers[i];
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.id = q.answers[i];
    radio.name = "answer";
    radio.value = q.answers[i];
    li.append(radio, label);
    quizSection.querySelector("ul.answers").append(li);
  }
  timer();
}

function checkAnswer(correctAnswer) {
  let correct = false;
  quizSection.querySelectorAll("input[type='radio']").forEach((e) => {
    if (e.checked && correctAnswer === e.value) {
      correct = true;
    }
  });
  if (correct) {
    score = score + 10;
  }
}

function finish() {
  quizSection.classList.add("d-none");
  endGameSection.classList.remove("d-none");
  if (score >= 60) {
    endGameSection.querySelector("h2").innerHTML = `
        YOU WON <br /> Your Score is: ${score}`;
    endGameSection
      .querySelector("img")
      .setAttribute(
        "src",
        "./images/GraveNegativeHarpseal-size_restricted.gif"
      );
  } else {
    endGameSection.querySelector("h2").innerHTML = `
        YOU LOST <br /> Your Score is: ${score} <br /> Score 60 or higher to pass`;
    endGameSection
      .querySelector("img")
      .setAttribute("src", "./images/giphy.gif");
  }
}

function submit(question) {
  checkAnswer(question.right_answer);
  questionIndex++;
  if (questionIndex === 10) {
    finish();
  } else {
    displayQuestion(questions[questionIndex]);
  }
}

function timer() {
  quizSection.querySelector("h4.timer").innerHTML = "00:30";
  let seconds = 30;
  interval = setInterval(() => {
    seconds--;
    let str = seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;
    quizSection.querySelector("h4.timer").innerHTML = str;
    if (seconds === 0) {
      clearInterval(interval);
      submit(questions[questionIndex]);
    }
  }, 1000);
}
