let quizId;
document.addEventListener("DOMContentLoaded", async function () {
    const participantsList = document.getElementById("participantsList");
    const urlParams = new URLSearchParams(window.location.search);
    quizId = urlParams.get('id_quiz');

    // Supposons que le quizId soit passé dans l'URL, vous pouvez le récupérer de la même manière que dans votre exemple

    try {
        const response = await fetch(`http://localhost:3000/api/V1/displayParticipantsWithNames?quizId=${quizId}`);
        const { data } = await response.json();

        if (!data || data.length === 0) {
            participantsList.innerHTML = '<li>Aucun élève n\'a participé à ce quiz.</li>';
            return;
        }

        data.forEach(participant => {
            const listItem = document.createElement('li');
            const participantName = `${participant.Nom} ${participant.Prenom}`;
            const participantId = participant.id_eleve;

            listItem.textContent = `Nom de l'élève : ${participantName}`;

            const correctionButton = document.createElement('button');
            correctionButton.textContent = 'Corriger les réponses';
            correctionButton.addEventListener('click', function() {
                // Rediriger vers la page de correction avec l'ID de l'élève et l'ID du quiz
                window.location.href = `compo.html?Prenom=${participant.Prenom}&quizId=${quizId}`;
            });

            listItem.appendChild(correctionButton);
            participantsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        participantsList.innerHTML = '<li>Une erreur est survenue lors de la récupération des participants.</li>';
    }
});
