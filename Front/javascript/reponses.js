    let prenom;
    let id_eleve;

    // Fonction pour extraire les paramètres d'une URL
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Fonction pour récupérer les données d'un quiz avec son ID
    async function getQuizData(quizId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/quizData?quizId=${quizId}`);
            
            if (!response.ok) {
                throw new Error('La requête n\'a pas abouti.');
            }

            const data = await response.json();
            const decodedData = JSON.parse(decodeURIComponent(data[0].partage));

            console.log("Données du quiz:", decodedData);
            
            return decodedData;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du quiz:', error);
        }
    }

    // Fonction pour récupérer l'ID d'un élève à partir de son prénom
    async function getStudentId2(prenom) {
        console.log(prenom);
        try {
            const response = await fetch(`http://localhost:3000/api/v1/idEleve2?prenom=${prenom}`);

            if (!response.ok) {
                throw new Error('La requête n\'a pas abouti.');
            }

            const data = await response.json();
            const id_eleve = data[0].id_eleve; // Récupération de l'ID de l'élève

            if (id_eleve) {
                console.log("ID de l'élève:", id_eleve);
                return id_eleve
                // Faites ce que vous voulez avec l'ID de l'élève ici
            } else {
                console.error("Erreur lors de la récupération de l'ID de l'élève:", data.error);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
        }
    }

    // Fonction pour récupérer les réponses d'un élève
// Fonction pour récupérer les réponses d'un élève
async function getStudentReponse(id_eleve, quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/studentReponse?id_eleve=${id_eleve}&quizId=${quizId}`);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        const data = await response.json();
        const studentReponse = JSON.parse(decodeURIComponent(data[0].data))
        console.log(studentReponse);



        return studentReponse;
    } catch (error) {
        console.error("Erreur lors de la récupération des réponses de l'élève:", error);
    }
}


document.addEventListener('DOMContentLoaded', async function () {
    const prenom = getParameterByName('Prenom');
    console.log(prenom);
    const id_eleve = await getStudentId2(prenom); // Obtenez l'ID de l'élève
    const quizId = getParameterByName('quizId');
    const studentResponses = await getStudentReponse(id_eleve, quizId); 

    if (studentResponses) {
        try {
            // Vérifiez si le tableau de réponses existe
            if (Array.isArray(studentResponses.reponses)) {
                // Parcourez chaque réponse et placez-la dans la zone de texte correspondante
                studentResponses.reponses.forEach((reponse, index) => {
                    const textarea = document.querySelector(`textarea[name="reponse${index + 1}"]`);
                    if (textarea) {
                        textarea.value = reponse; // Mettez la réponse dans le textarea correspondant
                    }
                });
            } else {
                console.error("Le contenu analysé n'est pas un tableau de réponses.");
            }
        } catch (error) {
            console.error("Erreur lors du traitement des réponses de l'élève:", error);
        }
    } else {
        console.error("Aucune réponse d'élève n'a été récupérée.");
    }
});

    





    // Suite de votre code...

    // creer le quiz avec les donnees
    window.onload = async function() {
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('quizId');
        console.log(quizId);
        const quizData = await getQuizData(quizId);
        
        const { quizName, questions } = quizData;
        const quizContainer = document.getElementById('quizQuestions');
    
        const quizNameElement = document.getElementById('quizName');
        quizNameElement.textContent = quizName;
        quizContainer.insertBefore(quizNameElement, quizContainer.firstChild);

        questions.forEach((question, index) => {
            const questionElement = document.createElement('section');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <div class="enonce">
                    <p class="intitule" id="question${index + 1}">Question ${index + 1}: ${question}</p>
                </div>
                <div id="reponse">
                    <textarea rows="3" name="reponse${index + 1}" id="reponse"></textarea>
                </div>
            `;
            quizContainer.appendChild(questionElement);
            const textarea = document.getElementById(`reponse`);
            preapreAutogrowing(textarea);
        });
    };



        function preapreAutogrowing(element) {
            var style = element.style;
            function onAction() {
                style.height = 'auto';
                style.height = element.scrollHeight + 'px';  
            }
            element.addEventListener('input', onAction);
            element.addEventListener('change', onAction);
            var destroyed = false;
            return {
                update: onAction,
                destroy: function() {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    element.removeEventListener('input', onAction);
                    element.removeEventListener('change', onAction);
                }
            };
        }
        
        
        var element = document.querySelector('#my-element');
        var autogrowing = preapreAutogrowing(element);

        element.value = '';
        
        autogrowing.update();  

async function getStudentComp(id_eleve, quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/getComportement?id_eleve=${id_eleve}&quizId=${quizId}`);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        const data = await response.json();

        console.log("Comportement de l'élève:", data);

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération du comportement de l'élève:", error);
    }
}

document.addEventListener('DOMContentLoaded' , getStudentComp)

