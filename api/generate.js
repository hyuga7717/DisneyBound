export default async function handler(req, res) {

  // Vérifier que la requête est bien POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    // Récupérer les informations envoyées par le site
    const {
      characterType,
      height,
      weight
    } = req.body || {};

    // Vérifier les informations
    if (!characterType || !height || !weight) {
      return res.status(400).json({
        error: "Il manque la taille, le poids ou le type de personnage."
      });
    }

    // Construire la demande pour l'IA
    const prompt = `
Tu es un styliste expert en DisneyBound.

Je veux créer une tenue DisneyBound pour une personne.

Type de personnage :
${characterType === "villain" ? "Méchant Disney" : "Personnage Disney gentil"}

Taille :
${height} cm

Poids :
${weight} kg

Choisis un personnage Disney correspondant au type demandé.

Crée ensuite une tenue DisneyBound moderne, élégante et portable au quotidien.

IMPORTANT :
- Ne reproduis pas le costume du personnage.
- Utilise seulement ses couleurs, son univers et ses éléments visuels comme inspiration.
- La tenue doit être réaliste et portable.
- Adapte les proportions et la coupe à la morphologie générale de la personne.

Réponds exactement avec cette structure :

PERSONNAGE :
[personnage choisi]

HAUT :
[haut]

BAS :
[bas]

CHAUSSURES :
[chaussures]

VESTE :
[veste ou "Aucune"]

ACCESSOIRE :
[accessoire]

COULEURS :
[couleurs principales]

EXPLICATION :
[explique pourquoi cette tenue correspond au personnage]
`;

    // Vérifier que la clé existe
    if (!process.env.openai_api_key) {

      console.error("OPENAI_API_KEY manquante");

      return res.status(500).json({
        error: "La clé OpenAI n'est pas configurée dans Vercel."
      });
    }

    // Appel à OpenAI
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

    // Lire la réponse OpenAI
    const openaiData =
      await openaiResponse.json();

    // Afficher l'erreur réelle dans les logs Vercel
    if (!openaiResponse.ok) {

      console.error(
        "Erreur OpenAI :",
        openaiData
      );

      return res.status(500).json({
        error:
          openaiData?.error?.message ||
          "Erreur lors de la communication avec OpenAI."
      });
    }

    // Extraire le texte de la réponse
    let result = "";

    if (openaiData.output) {

      for (const item of openaiData.output) {

        if (item.type === "message" && item.content) {

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

    // Vérifier que nous avons reçu du texte
    if (!result) {

      console.error(
        "Réponse OpenAI inattendue :",
        openaiData
      );

      return res.status(500).json({
        error:
          "L'IA a répondu mais aucun texte n'a été trouvé."
      });
    }

    // Envoyer le résultat au site
    return res.status(200).json({
      success: true,
      result: result
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