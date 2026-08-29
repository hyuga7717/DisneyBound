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
      weight
    } = req.body || {};

    // Vérification
    if (!characterType || !height || !weight) {
      return res.status(400).json({
        error: "Informations manquantes."
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
Tu es un styliste expert en DisneyBound.

Crée un DisneyBound moderne et portable pour une personne de ${height} cm et ${weight} kg.

Type demandé :
${characterType === "villain"
  ? "Méchant Disney"
  : "Personnage Disney gentil"}

Choisis un personnage Disney correspondant au type demandé.

Ensuite, sélectionne exactement 5 pièces de vêtements ou accessoires que l'on pourrait rechercher dans une boutique de mode comme SHEIN.

IMPORTANT :
- Ne reproduis pas le costume du personnage.
- Inspire-toi uniquement de ses couleurs, de son univers et de ses éléments visuels.
- Les vêtements doivent être modernes et portables au quotidien.
- Les recherches doivent être suffisamment précises pour trouver des produits réels.

Réponds UNIQUEMENT avec ce JSON :

{
  "character": "Nom du personnage",
  "items": [
    {
      "category": "Haut",
      "search": "termes précis pour rechercher le produit"
    },
    {
      "category": "Bas",
      "search": "termes précis pour rechercher le produit"
    },
    {
      "category": "Chaussures",
      "search": "termes précis pour rechercher le produit"
    },
    {
      "category": "Veste",
      "search": "termes précis pour rechercher le produit"
    },
    {
      "category": "Accessoire",
      "search": "termes précis pour rechercher le produit"
    }
  ]
}
`;

    // Appel à Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
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
                }
              ]
            }
          ],
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