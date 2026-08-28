```javascript
export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {
    // Récupération des données envoyées par le site
    const {
      characterType,
      height,
      weight
    } = req.body;

    // Vérification des informations
    if (!characterType || !height || !weight) {
      return res.status(400).json({
        error: "Informations manquantes"
      });
    }

    // Construction du prompt
    const prompt = `
Tu es un styliste spécialisé dans le DisneyBound.

Crée une idée de tenue DisneyBound portable dans la vie quotidienne.

Type de personnage :
${characterType === "villain" ? "Méchant Disney" : "Personnage Disney gentil"}

Taille de la personne :
${height} cm

Poids :
${weight} kg

Le résultat doit être :
- élégant
- moderne
- portable dans la vie quotidienne
- inspiré visuellement du personnage
- sans reproduire exactement son costume
- adapté aux proportions de la personne
- composé de vêtements réellement portables

Donne une proposition comprenant :
1. Personnage Disney choisi
2. Haut
3. Bas
4. Chaussures
5. Veste éventuelle
6. Accessoires
7. Couleurs principales
8. Explication du DisneyBound
`;

    // Appel à OpenAI
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.openai_api_key}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: prompt
        })
      }
    );

    const data = await response.json();

    // Gestion des erreurs OpenAI
    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: "Erreur lors de la communication avec OpenAI"
      });
    }

    // Retour du résultat au site
    return res.status(200).json({
      success: true,
      result: data.output_text
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Erreur serveur"
    });
  }
}
```
