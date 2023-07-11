// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currIdx = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObj = JSON.parse(this.responseText);
      let questionsCount = questionsObj.length;
      // Create Bullets + Set Questions Count
      createBullets(questionsCount);

      // Add Question Data
      addQuestionData(questionsObj[currIdx], questionsCount);

      // Start CountDown
      countdown(5, questionsCount);

      // Click on submit
      submitButton.onclick = () => {
        // Get right answer
        let theRightAnswer = questionsObj[currIdx].right_answer;

        // Increase Index
        currIdx++;

        // Check The Answer
        checkAnswer(theRightAnswer, questionsCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObj[currIdx], questionsCount);

        // Handle Bullets
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(5, questionsCount);

        // Show Results
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "../questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If It's the first span
    if (!i) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currIdx < count) {
    // Create H2 Question Title
    let qTitle = document.createElement("h2");
    // Create Question Text
    let qText = document.createTextNode(obj.title);
    // Append Text To H2
    qTitle.appendChild(qText);
    // Append H2 To Quiz Area
    quizArea.appendChild(qTitle);

    // Create the answers
    for (let i = 0; i < 4; i++) {
      // Create main answer div
      let mainDiv = document.createElement("div");
      // Add class to main div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i + 1}`;
      radioInput.dataset.answer = obj[`answer_${i + 1}`];

      // Create Label
      let theLabel = document.createElement("label");
      // Add For Attribute
      theLabel.htmlFor = `answer_${i + 1}`;
      // Create Label Text
      let labelText = document.createTextNode(obj[`answer_${i + 1}`]);
      // Add the text to label
      theLabel.appendChild(labelText);

      // Append Label + Radio Input to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append main div to answers-area div
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAns, count) {
  let answers = document.getElementsByName("question");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAns === chosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currIdx === index) {
      span.classList.add("on");
    }
  });
}

function showResults(count) {
  let theResults;
  if (currIdx === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < 10) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} out of ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect!</span>, ${rightAnswers} out of ${count}`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} out of ${count}`;
    }

    resultsContainer.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currIdx < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
