let quizName;
let identifierBtn = document.getElementById("identifier");
let id_eleve;
let scrore_fiabilite = 40; 
let sortie = 0;
let derniereSortie = null;
let total_time_outside_tab = 0; 
let nbrTab = 0 ;
let id_classe; 
let reponses = []; // Tableau pour stocker les réponses



setTimeout(function() {
    let quizNameLocation = document.getElementById('quizName');
    quizName = quizNameLocation.innerText.trim(); // Utilisez innerText pour obtenir uniquement le texte
    getQuizID(); // Appelez getQuizID après avoir obtenu quizName
}, 500);


/** identification de l'eleve et du quiz */

async function getStudentId(nom, prenom) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/idEleve?nom=${nom}&prenom=${prenom}`);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        const data = await response.json();
        id_eleve = data[0].id_eleve; // Assignation de la valeur à la variable globale id_eleve
        if (data) {
            console.log("ID de l'élève:", id_eleve);
        } else {
            console.error("Erreur lors de la récupération de l'ID de l'élève:", data.error);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}

async function getClasseId() {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();

    try {
        const response = await fetch(`http://localhost:3000/api/v1/idClasse?nom=${nom}&prenom=${prenom}`);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        const data = await response.json();
        id_classe = data[0].id_classe; // Assignation de la valeur à la variable globale id_classe
        if (data) {
            console.log("ID de la classe de l'eleve :", id_classe);
        } else {
            console.error("Erreur lors de la récupération de l'ID de l'élève:", data.error);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}

async function getQuizID() {
    try {
        
        // Appel à la route backend pour récupérer l'ID du quiz à partir de son nom
        const response = await fetch(`http://localhost:3000/api/v1/quizId?quizName=${quizName}`);
        
        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        // Conversion de la réponse en format JSON
        const data = await response.json();
        let quizId = data[0].id_exam;
        
        // Affichage de l'ID du quiz dans la console
        console.log("ID du quiz:", quizId);
        
        // Retourne l'ID du quiz
        return quizId;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz:', error);
    }
};

identifierBtn.addEventListener("click", async () => {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    await getStudentId(nom, prenom); // Utilisez la première définition de getStudentId avec les arguments nom et prenom
    getClasseId();
    console.log(quizName);
});


/** detection des comportements de triche */

document.addEventListener('mouseleave', e => {
        if (e.clientY <= 0) {
            console.log("La souris quitte la page");
            sortie++;
            console.log(`Nombre de sorties: ${sortie}`);
            scrore_fiabilite = scrore_fiabilite -2; 
            verifierFiabilite();
        }
    });

//restrictions
document.addEventListener('DOMContentLoaded', function() {
    // empecher la copie sur toute la page , on peut toujours le selectionner par contre
    document.addEventListener('copy', function(event) {
        event.preventDefault();
    });

    // desactiver le clic droit
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    // desactiver le collage 
    document.addEventListener('paste', function(event) {
        event.preventDefault();
    });

    verifierFiabilite();
});

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            scrore_fiabilite = scrore_fiabilite -4
            nbrTab ++;
            verifierFiabilite();
            console.log('L\'utilisateur a changé d\'onglet ou minimisé la fenêtre.');
            derniereSortie = Date.now();
        } else {
            console.log('L\'utilisateur est revenu sur l\'onglet actif.');
            if (derniereSortie) {
                const dureeAbsence = Date.now() - derniereSortie;
                console.log(`L\'utilisateur était absent pendant ${dureeAbsence / 1000} secondes.`);
                total_time_outside_tab += dureeAbsence;
                console.log(`Le temps total passé hors de l'onglet est de ${total_time_outside_tab / 1000} secondes.`);
                derniereSortie = null;
            }
        }
    });


/** Section  enregistrement du comportement */

    const nomInput = document.getElementById("nom");
    const prenomInput = document.getElementById("prenom");
    const submitButton = document.getElementById("button");


    

    // fonction pour  enregistrer le comportement dans la db
    async function enregistrerComportement(nom, prenom, sortie, nbrTab, total_time_outside_tab , scrore_fiabilite , id_eleve , quizId) {
            const data = {
                Nom: nom,
                Prenom: prenom,
                mousleave: sortie,
                new_tab: nbrTab,
                new_tab_time: total_time_outside_tab / 1000,
                score  : scrore_fiabilite , 
                id_eleve : id_eleve ,
                id_exam : quizId
            };
    
            console.log("Data to be sent to server:", data); 
            const response = await fetch('http://localhost:3000/api/v1/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    }


    //je sais qu'il y est 2 fois mais si je l'enleve il n'arrive pas a envoyer l'id dansle comportement je regarderais si je peut corriiger ca aavnt de le rendre 
async function getStudentId() {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    try {
        const response = await fetch(`http://localhost:3000/api/v1/idEleve?nom=${nom}&prenom=${prenom}`);

        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }

        const data = await response.json();
        id_eleve = data[0].id_eleve; 
        if (data) {
            console.log("ID de l'élève:", id_eleve, data);
        } else {
            console.error("Erreur lors de la récupération de l'ID de l'élève:", data.error);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}

    
// popuptriche
async function afficherPop() {
    const popUpBackground = document.createElement('div');
    popUpBackground.classList.add('popup-background');
    const popUpDiv = document.createElement('div');
    popUpDiv.classList.add('popup');
    
    const tremblingImage = document.createElement('img');
    tremblingImage.src = './assets/alerte4.png'; 
    tremblingImage.classList.add('trembling-image');

    tremblingImage.classList.add('tremble-animation');

    popUpDiv.innerHTML = `
        <div class="popup-content">
            <h2>Tentative de Triche détectée</h2>
            <p>Vous ne pouvez plus effectuer d'actions sur cette page.</p>
            <div class="trembling-image-container">
                ${tremblingImage.outerHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(popUpBackground);
    document.body.appendChild(popUpDiv);

    try {
        const quizId = await getQuizID(); 
        if (quizId) {
            enregistrerComportement(nomInput.value, prenomInput.value, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve, quizId);
        } else {
            throw new Error('Erreur lors de la récupération de l\'ID du quiz.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz dans afficherPop:', error);
    }
}





//verifier le score  de fiabilite
function verifierFiabilite() {
    adapterChouette();
    if (scrore_fiabilite <= 0) {
        afficherPop();
    }
}

function adapterChouette() {
    let cheatingHowl = document.getElementById('chouetteTriche');
    if (scrore_fiabilite > 40) {
        cheatingHowl.src = './assets/alert0.png';
    } else if (scrore_fiabilite < 40 && scrore_fiabilite >= 30) {
        cheatingHowl.src = './assets/alerte1.png'; 
    } else if (scrore_fiabilite < 30 && scrore_fiabilite >= 20) {
        cheatingHowl.src = './assets/alerte2.png';
    } else if (scrore_fiabilite < 20 && scrore_fiabilite >= 10) {
        cheatingHowl.src = './assets/alerte3.png';
    } else if (scrore_fiabilite < 10) {
        cheatingHowl.src = './assets/alerte4.png';
    }
}




submitButton.addEventListener("click", async () => {
    const nom = nomInput.value;
    const prenom = prenomInput.value;
    console.log(scrore_fiabilite);

    try {
        console.log("Data received in enregistrerComportement:", nom, prenom, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve); 
        const quizId = await getQuizID();
        if (quizId) {
            await enregistrerComportement(nom, prenom, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve, quizId);
            console.log('Comportement enregistré avec succès.');
        } else {
            throw new Error('Erreur lors de la récupération de l\'ID du quiz.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du comportement :', error);
    }
});



async function creerCompo() {
    try {
        const reponses = []; // Réinitialise le tableau des réponses
        const reponsesV = document.querySelectorAll('textarea[name^="reponse"]');

        // Parcours des champs de texte et stockage des réponses dans le tableau
        reponsesV.forEach(reponse => {
            if (reponse.value.trim() !== '') {
                reponses.push(reponse.value.trim());
            }
        });
        console.log(reponses);

        const quizData = encodeURIComponent(JSON.stringify({reponses }));
        console.log("Données de la composition de l'élève:", quizData);
        return quizData; // Retourne les données de la composition
    } catch (error) {
        console.error(error);
    }
}

async function createCompo(quizData, id_eleve, id_classe, quizId) { // Ajout de id_classe comme paramètre
    try {
        quizData = await creerCompo();
        console.log(`quizData : ${quizData}`);

        const response = await fetch('http://localhost:3000/api/v1/createCompo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizData, id_eleve, id_classe, quizId }) // Inclure id_classe ainsi que id_eleve et quizId dans l'objet envoyé
        });
        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }
        console.log("Composition créée avec succès !:", quizData);
    } catch (error) {
        console.error(error);
    }
};

submitButton.addEventListener("click", async function () {
    try {
        const nom = nomInput.value.trim();
        const prenom = prenomInput.value.trim();
        // Attend la récupération de l'ID de l'élève
        await getStudentId(nom, prenom);
        console.log(id_eleve);
        // Attend la récupération de l'ID de la classe
        await getClasseId();
        console.log(id_classe); // Assurez-vous que id_classe est défini correctement
        // Obtient l'ID du quiz
        const quizId = await getQuizID();
        // Récupère les données de la composition
        const quizData = await creerCompo();
        // Envoie les données de la composition au serveur
        await createCompo(quizData, id_eleve, id_classe, quizId);
    } catch (error) {
        console.error('Erreur lors de la création de la composition:', error);
    }
});
