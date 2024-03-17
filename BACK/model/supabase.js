import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://jkehwnwygpkcorsezrae.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZWh3bnd5Z3BrY29yc2V6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjAyMTI1MywiZXhwIjoyMDIxNTk3MjUzfQ.2FojuPzY-YtvpcpMLooLa1oCTC_XA1AUVry2QxFp-GM"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;


async function addComp(info) {
    console.log("Data received in addComp:", info);

    const { data, error } = await supabase
        .from('Comportement')
        .insert(info)
        .select();

    if (error) {
        console.error("Error inserting data into Supabase:", error);
    } else {
        console.log("Data inserted successfully into Supabase:", data);
    }

    return { data, error };
}

async function recupEleve(nom, prenom) {
    try {
        const { data, error } = await supabase
            .from('eleves')
            .select('id_eleve')
            .eq('Nom', nom)
            .eq('Prenom', prenom)
        console.log("Données récupérées depuis Supabase:", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données de l'élève:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}
async function recupEleve2(prenom) {
    console.log("Data received in recup2:", prenom);

    try {
        const { data, error } = await supabase
            .from('eleves')
            .select('id_eleve')
            .eq('Prenom', prenom)
        console.log("Données récupérées depuis Supabase:2", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données de l'élève:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}
async function getQuizData(quizId) {
    try {
        const { data, error } = await supabase
            .from('exams')
            .select('partage')
            .eq('id_exam', quizId)
        console.log("Données récupérées depuis Supabase:", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données du quiz:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}
async function getStudentReponse(id_eleve , quizId) {
    console.log('recu :' , id_eleve , quizId);
    try {
        const { data, error } = await supabase
            .from('reponses')
            .select('data')
            .eq ('id_eleve' , id_eleve)
            .eq('id_exam', quizId)
        console.log("Données récupérées depuis Supabase:", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données du quiz:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}
async function getQuizIdByName(quizName) {
    try {
        // Effectuer une requête SELECT à la table "exams" de Supabase en filtrant les résultats avec le nom du quiz
        const { data, error } = await supabase
            .from('exams')
            .select('id_exam')
            .eq('nom', quizName);

        // Afficher les données récupérées depuis Supabase pour vérification
        console.log(`Données récupérées depuis Supabase pour ${quizName}:`, data);

        if (error) {
            console.error("Erreur lors de la récupération de l'ID du quiz:", error.message);
            return { error: "Une erreur est survenue lors de la récupération de l'ID du quiz." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération de l'ID du quiz:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération de l'ID du quiz." };
    }
}
async function displayQuizs() {
    try {
        const { data, error } = await supabase
            .from('exams')
            .select('nom, id_exam'); // Sélectionnez à la fois le nom et l'ID du quiz

        if (error) {
            console.error("Erreur lors de la récupération des quizs:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des quizs." };
        }

        return { data }; // Retourne à la fois le nom et l'ID du quiz
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des quizs:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des quizs." };
    }
}
async function displayParticipants(quizId) {
    try {
        const { data, error } = await supabase
            .from('reponses')
            .select('id_eleve')
            .eq('id_exam', quizId);
        return data;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function getParticipantsNames(participantIds) {
    try {
        const { data, error } = await supabase
            .from('eleves')
            .select('Nom')
            .select('Prenom')
            .in('id_eleve', participantIds);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
}



// Ajout d'une nouvelle fonction pour insérer un nouveau quiz dans la table "exams"
async function createQuiz(quizName , quizData) {
    console.log("Data received in cerateQuiz :", quizName , quizData);

    try {
        const { data, error } = await supabase
            .from('exams')
            .insert({ nom: quizName , partage : quizData});

        console.log("Nouveau quiz créé:", quizName, quizData); // Affichage du nom du nouveau quiz pour vérification

        if (error) {
            console.error("Erreur lors de la création du quiz:", error.message);
            return { error: "Une erreur est survenue lors de la création du quiz." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la création du quiz:", error);
        return { error: "Une erreur non gérée est survenue lors de la création du quiz." };
    }
}
async function createCompo(quizData, id_eleve, id_classe ,  quizId , comportementId) { // Ajout des paramètres id_eleve et quizId
    console.log("Data received in createCompo:",quizData   , comportementId );

    try {
        const { data, error } = await supabase
            .from('reponses')
            .insert({
                data: quizData, // Assurez-vous que les réponses sont insérées dans la colonne appropriée
                id_eleve: id_eleve, // Insérez l'ID de l'élève dans la colonne id_eleve
                id_exam: quizId , // Insérez l'ID du quiz dans la colonne id_exam
                id_classe : id_classe,
                id_comportement : comportementId,
            });

        console.log("Nouvelle composition créée dans la base de données:", quizData); // Affichage du nom du nouveau quiz pour vérification

        if (error) {
            console.error("Erreur lors de la création de la composition:", error.message);
            return { error: "Une erreur est survenue lors de la création de la composition." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la création de la composition:", error);
        return { error: "Une erreur non gérée est survenue lors de la création de la composition." };
    }
}

async function getClasseId(nom, prenom) {
    try {
        const { data, error } = await supabase
            .from('eleves')
            .select('id_classe')
            .eq('Nom', nom)
            .eq('Prenom', prenom)
        console.log("Données récupérées depuis Supabase:", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données de l'élève:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}
async function getStudentComportement(id_eleve,quizId ) {
    console.log("Data received in getcomportement:", id_eleve , quizId);

    try {
        const { data, error } = await supabase
            .from('Comportement')
            .select('*')
            .eq('id_eleve', id_eleve)
            .eq('id_exam', quizId)
        console.log("id du comportement", data); // Ajoutez cette ligne pour voir ce que renvoie Supabase
        if (error) {
            console.error("Erreur lors de la récupération des données de l'élève:", error.message);
            return { error: "Une erreur est survenue lors de la récupération des données de l'élève." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        return { error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." };
    }
}

async function enregistrerQuestions(quizId, questions) {
    try {
        const { data, error } = await supabase
            .from('questions')
            .insert(questions.map(question => ({ id_exam: quizId, intitule: question })));

        if (error) {
            console.error("Erreur lors de l'enregistrement des questions :", error.message);
            return { error: "Une erreur est survenue lors de l'enregistrement des questions." };
        }
        return { data };
    } catch (error) {
        console.error("Erreur non gérée lors de l'enregistrement des questions :", error);
        return { error: "Une erreur non gérée est survenue lors de l'enregistrement des questions." };
    }
}









export { recupEleve, getQuizIdByName, createQuiz, getClasseId , addComp, enregistrerQuestions ,displayQuizs , getQuizData  , createCompo , displayParticipants , getParticipantsNames, getStudentReponse , recupEleve2 , getStudentComportement}

