const quizIdLocation = document.getElementById('quizData')

const joinBtn = document.getElementById('join')

joinBtn.addEventListener('click', () => {
    const quizId= quizIdLocation.value;
    window.location.href = `quiz.html?id=${quizId}`;
})

const decodedData = decodeURIComponent('%7B%22questions%22%3A%5B%5D%2C%22reponsesEleve%22%3A%5B%5D%7D');
console.log(decodedData); // Cela affichera : {"questions":[],"reponsesEleve":[]}
