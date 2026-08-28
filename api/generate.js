export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    const {
      characterType,
      height,
      weight
    } = req.body || {};

    if (!characterType || !height || !weight) {
      return res.status(400).json({
        error: "Informations manquantes."
      });
    }

    if (!process.env.openai_api_key) {
      return res.status(500).json({
        error: "La clé OpenAI n'est pas configurée."
      });
    }

    const prompt = `
Tu es un styliste expert en DisneyBound.

Crée un DisneyBound moderne et portable pour une personne de ${height} cm et ${weight} kg.

Type demandé :
${characterType === "villain" ? "Méchant Disney" : "Personnage Disney gentil"}

Choisis un personnage Disney correspondant.

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

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.openai_api_key}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: prompt
        })
      }
    );

    const openaiData =
      await openaiResponse.json();

    if (!openaiResponse.ok) {

      console.error(
        "Erreur OpenAI :",
        openaiData
      );

      return res.status(500).json({
        error:
          openaiData?.error?.message ||
          "Erreur OpenAI."
      });
    }

    let result = "";

    if (openaiData.output) {

      for (const item of openaiData.output) {

        if (
          item.type === "message" &&
          item.content
        ) {

          for (const content of item.content) {

            if (
              content.type === "output_text" &&
              content.text
            ) {

              result += content.text;

            }

          }

        }

      }

    }

    if (!result) {

      return res.status(500).json({
        error: "Aucune réponse de l'IA."
      });

    }

    // Nettoyer les éventuels blocs Markdown
    result = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(result);

    } catch (error) {

      console.error(
        "JSON reçu par OpenAI :",
        result
      );

      return res.status(500).json({
        error:
          "L'IA n'a pas renvoyé un résultat valide."
      });

    }

    return res.status(200).json({
      success: true,
      result: disneyBound
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        error.message ||
        "Erreur serveur."
    });

  }

}