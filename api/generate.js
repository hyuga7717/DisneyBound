export default async function handler(req, res) {

  // =========================
  // VÉRIFIER LA MÉTHODE
  // =========================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }


  try {

    // =========================
    // RÉCUPÉRER LES DONNÉES
    // =========================

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};


    // =========================
    // VALIDATION
    // =========================

    if (
      !characterType ||
      !height ||
      !weight ||
      !image ||
      !mimeType
    ) {

      return res.status(400).json({
        error: "Photo ou informations manquantes."
      });

    }


    // =========================
    // CLÉ GEMINI
    // =========================

    if (!process.env.gemini_api_key) {

      return res.status(500).json({
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }


    // =========================
    // PROMPT
    // =========================

    const prompt = `

Tu es l'IA de DisneyBound.

À partir de la photo fournie, ton objectif est de proposer
une tenue DisneyBound portable dans la vie quotidienne.

Analyse uniquement les éléments nécessaires pour proposer
la tenue :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- style général

Ne cherche jamais à identifier la personne.

La personne mesure ${height} cm et pèse ${weight} kg.

Le type de personnage demandé est :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis un personnage Disney correspondant au style observé
et au type demandé.

Propose :

1. Un personnage Disney
2. Un haut
3. Un bas
4. Une veste
5. Des chaussures
6. Des accessoires

La tenue doit être inspirée du personnage mais rester
portable au quotidien.

Les recherches doivent correspondre à de vrais produits
de mode et être suffisamment précises pour être utilisées
dans un catalogue de vêtements.

Réponds exclusivement avec ce JSON :

{
  "personnage": "",
  "haut": "",
  "bas": "",
  "veste": "",
  "chaussures": "",
  "accessoires": [],
  "couleurs": [],
  "recherches": {
    "haut": "",
    "bas": "",
    "veste": "",
    "chaussures": "",
    "accessoires": ""
  }
}

`;


    // =========================
    // APPEL GEMINI
    // =========================

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
        process.env.gemini_api_key,
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          contents: [

            {
              parts: [

                {
                  text: prompt
                },

                {
                  inlineData: {
                    mimeType: mimeType,
                    data: image
                  }
                }

              ]
            }

          ],

          generationConfig: {

            responseMimeType:
              "application/json"

          }

        })

      }
    );


    // =========================
    // RÉPONSE GEMINI
    // =========================

    const data =
      await response.json();


    // =========================
    // ERREUR GEMINI
    // =========================

    if (!response.ok) {

      console.error(
        "Erreur Gemini :",
        data
      );

      return res.status(500).json({

        error:
          data?.error?.message ||
          "Erreur lors de la communication avec Gemini."

      });

    }


    // =========================
    // RÉCUPÉRER LE JSON
    // =========================

    const result =
      data?.candidates?.[0]
        ?.content?.parts?.[0]?.text;


    if (!result) {

      console.error(
        "Réponse Gemini inattendue :",
        data
      );

      return res.status(500).json({

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    // =========================
    // PARSER LE JSON
    // =========================

    let disneyBound;


    try {

      disneyBound =
        JSON.parse(result);

    } catch (error) {

      console.error(
        "JSON Gemini invalide :",
        result
      );

      return res.status(500).json({

        error:
          "Gemini n'a pas renvoyé un JSON valide."

      });

    }


    // =========================
    // RETOUR AU SITE
    // =========================

    return res.status(200).json({

      success: true,

      result: disneyBound

    });


  } catch (error) {

    // =========================
    // ERREUR SERVEUR
    // =========================

    console.error(
      "Erreur serveur :",
      error
    );

    return res.status(500).json({

      error:
        error.message ||
        "Erreur serveur."

    });

  }

}