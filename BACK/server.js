import express from "express";
import cors from "cors";
import { recupEleve , getQuizIdByName, createQuiz, getClasseId , addComp, enregistrerQuestions ,displayQuizs ,getQuizData , createCompo, displayParticipants, getParticipantsNames, getStudentReponse ,recupEleve2, getStudentComportement} from "./model/supabase.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/v1/add', async (req, res) => {
    try {
        const { Nom, Prenom, mousleave, new_tab , new_tab_time , score , id_eleve , id_exam} = req.body;

        await addComp({ Nom, Prenom, mousleave, new_tab , new_tab_time, score, id_eleve,id_exam });

        res.status(200).json({ message: 'Données insérées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données dans la base de données:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'insertion des données.' });
    }
});

app.get('/api/v1/displayQuizs', async (req, res) => {
    try {
        const { data, error } = await displayQuizs();

        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des quizs." });
        }

        res.json(data); // Renvoie à la fois le nom et l'ID du quiz
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des quizs:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération des quizs." });
    }
});

app.get('/api/V1/displayParticipants', async (req, res) => {
    try {
        const quizId = req.query.quizId; // Supposons que l'ID du quiz soit passé en tant que paramètre de requête
        const data = await displayParticipants(quizId);
        res.json({ data }); // Vous pouvez renvoyer les données des participants au format JSON
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des participants.' });
    }
});
app.get('/api/V1/displayParticipantsWithNames', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const participantsData = await displayParticipants(quizId);
        const participantIds = participantsData.map(participant => participant.id_eleve);
        const participantsNames = await getParticipantsNames(participantIds);
        
        res.json({ data: participantsNames });
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des participants.' });
    }
});


app.get('/api/v1/idEleve', async (req, res) => {
    const { nom, prenom } = req.query;

    try {
        const { data, error } = await recupEleve(nom, prenom);
        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des données de l'élève." });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." });
    }
});

app.get('/api/v1/idEleve2', async (req, res) => {
    const {prenom } = req.query;

    try {
        const { data, error } = await recupEleve2(prenom);
        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des données de l'élève." });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." });
    }
});

app.get('/api/v1/idClasse', async (req, res) => {
    const { nom, prenom } = req.query;
    try {
        const { data, error } = await getClasseId(nom, prenom);
        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des données de l'élève." });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des données de l'élève:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération des données de l'élève." });
    }
});

// Ajout d'une nouvelle route pour récupérer l'ID du quiz à partir de son nom
app.get('/api/v1/quizId', async (req, res) => {
    const { quizName } = req.query;

    try {
        // Utilisation de la fonction getQuizIdByName pour récupérer l'ID du quiz à partir de son nom
        const { data, error } = await getQuizIdByName(quizName);

        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'ID du quiz." });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération de l'ID du quiz:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération de l'ID du quiz." });
    }
});
app.get('/api/v1/getComportement', async (req, res) => {
    const { id_eleve , quizId } = req.query;

    try {
        // Utilisation de la fonction getQuizIdByName pour récupérer l'ID du quiz à partir de son nom
        const { data, error } = await getStudentComportement(id_eleve , quizId);

        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'ID du comportement." });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération de l'ID du quiz:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération de l'ID du quiz." });
    }
});
app.get('/api/v1/quizData', async (req, res) => {
    const { quizId} = req.query;

    try {

        const { data, error } = await getQuizData(quizId);

        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des donées du quiz" });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération de l'ID du quiz:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération de l'ID du quiz." });
    }
});
app.get('/api/v1/studentReponse', async (req, res) => {
    const { id_eleve ,quizId} = req.query;

    try {

        const { data, error } = await getStudentReponse(id_eleve , quizId);

        if (error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des donées du quiz" });
        }
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération de l'ID du quiz:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la récupération de l'ID du quiz." });
    }
});

app.post('/api/v1/createQuiz', async (req, res) => {
    try {
        const { quizName, quizData } = req.body;
        const result = await createQuiz(quizName, quizData);

        // Vérifier si result contient une erreur
        if (result.error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la création du quiz." });
        }
        // Envoyer le résultat de la création du quiz
        res.json(result.data);
    } catch (error) {
        console.error("Erreur non gérée lors de la création du quiz:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la création du quiz." });
    }
});
app.post('/api/v1/createCompo', async (req, res) => {
    try {
        const { quizData, id_eleve, id_classe  , quizId} = req.body; // Extraire quizData, id_eleve et quizId de req.body
        const result = await createCompo(quizData, id_eleve, id_classe , quizId); // Appeler createCompo avec les données extraites

        // Vérifier si result contient une erreur
        if (result.error) {
            return res.status(500).json({ error: "Une erreur est survenue lors de la création de la compo." });
        }
        // Envoyer le résultat de la création du quiz
        res.json(result.data);
    } catch (error) {
        console.error("Erreur non gérée lors de la création de la compo:", error);
        res.status(500).json({ error: "Une erreur non gérée est survenue lors de la création de la compo." });
    }
});


app.post('/api/v1/enregistrerQuestions', async (req, res) => {
    const { quizId, questions } = req.body;

    try {
        const result = await enregistrerQuestions(quizId, questions);
        if (result.error) {
            return res.status(500).json({ error: result.error });
        }
        res.json({ message: "Questions enregistrées avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des questions :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement des questions." });
    }
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
