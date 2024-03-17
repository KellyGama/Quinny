document.addEventListener("DOMContentLoaded", async function () {
    const classList = document.getElementById("classList");

    try {
        const response = await fetch('http://localhost:3000/api/v1/displayClasses');
        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 0));
        data.forEach(classe => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${classe.id_classe}, Nom: ${classe.Nom_classe}`;
            classList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
        classList.innerHTML = '<li>Une erreur est survenue lors de la récupération des classes.</li>';
    }
});
