export default async function handler(req, res) {

  // Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    // Récupérer les informations du site
    const {
  characterType,
  height,
  weight,
  image,
  mimeType
} = req.body || {};

    // Vérification
   if (!characterType || !height || !weight || !image || !mimeType) {
  return res.status(400).json({
    error: "Photo ou informations manquantes."
  });
   }
    // Vérifier la clé Gemini
    if (!process.env.gemini_api_key) {
      return res.status(500).json({
        error: "La clé Gemini n'est pas configurée dans Vercel."
      });
    }

    // Demande envoyée à Gemini
    const prompt = `

Tu es l'IA de DisneyBound.

À partir de la photo fournie, ton objectif est de proposer
une tenue DisneyBound portable dans la vie quotidienne.

Analyse uniquement les éléments nécessaires pour proposer la tenue :

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

Propose ensuite :

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

    // Appel à Gemini
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
]
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();

    // Gestion des erreurs Gemini
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

    // Récupérer le texte
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {

      console.error(
        "Réponse Gemini inattendue :",
        data
      );

      return res.status(500).json({
        error: "Gemini n'a pas renvoyé de résultat."
      });
    }

    // Convertir le JSON
    let disneyBound;

    try {

      disneyBound =
        JSON.parse(result);

    } catch (error) {

      console.error(
        "JSON Gemini :",
        result
      );

      return res.status(500).json({
        error:
          "Gemini n'a pas renvoyé un JSON valide."
      });
    }

    // Retour au site
    return res.status(200).json({
      success: true,
      result: disneyBound
    });

  } catch (error) {

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