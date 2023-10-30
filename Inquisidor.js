function saveQuestion() {
    const questionText = document.getElementById("questionInput").value;
    if (questionText.trim() === "") {
        alert("Please enter a valid question.");
        return;
    }

    // Generate a 10-digit UUID (this is a simple version, not a real UUID)
    const uuid = Math.floor(Math.random() * 9000000000) + 1000000000;

    // Fetch the existing questions or initialize a new array
    let questions = [];
    if (localStorage.getItem("questions")) {
        questions = JSON.parse(localStorage.getItem("questions"));
    }

    // Append the new question
    questions.push({
        uuid: uuid,
        question: questionText
    });

    // Store back to localStorage
    localStorage.setItem("questions", JSON.stringify(questions));

    document.getElementById("status").innerText = "Question saved!";
    document.getElementById("questionInput").value = "";
}