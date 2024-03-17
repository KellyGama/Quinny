document.addEventListener("DOMContentLoaded", async function () {
    const quizList = document.getElementById("quizList");

    try {
        // Envoyer une requête GET au serveur pour récupérer les noms et les IDs des quizs
        const response = await fetch('http://localhost:3000/api/v1/displayQuizs');
        console.log("Réponse du serveur:", response);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        // Convertir la réponse en JSON
        const data = await response.json();
        console.log("Données récupérées depuis le serveur:", data);

        // Attendre que la réponse soit traitée avant de manipuler le DOM
        await new Promise(resolve => setTimeout(resolve, 0));

        // Parcourir les données pour afficher les noms et les IDs des quizs sur la page
// Parcourir les données pour afficher les noms et les IDs des quizs sur la page
data.forEach(quiz => {
    console.log("ID du quiz:", quiz.id_exam); // Vérifions si l'ID est accessible
    const listItem = document.createElement('li');
    listItem.textContent = `ID: ${quiz.id_exam}, Nom: ${quiz.nom}`;

    // Créer un bouton pour corriger
    const correctionButton = document.createElement('button');
    correctionButton.textContent = 'Corriger';

    // Ajouter un gestionnaire d'événements click pour le bouton
    correctionButton.addEventListener('click', function() {
        window.location.href = `participants.html?id_quiz=${quiz.id_exam}`;
        console.log('Correction du quiz:', quiz.id_exam);
    });

    // Ajouter le bouton de correction à l'élément de liste
    listItem.appendChild(correctionButton);

    // Ajouter l'élément de liste avec le bouton à la liste des quizs
    quizList.appendChild(listItem);
});

    } catch (error) {
        console.error('Erreur lors de la récupération des quizs:', error);
        // Afficher un message d'erreur sur la page en cas d'échec de récupération des quizs
        quizList.innerHTML = '<li>Une erreur est survenue lors de la récupération des quizs.</li>';
    }
});
