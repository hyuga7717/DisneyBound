```javascript
export default async function handler(req, res) {

  // ==================================================
  // MÉTHODE
  // ==================================================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    // ==================================================
    // DONNÉES REÇUES
    // ==================================================

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};

    // ==================================================
    // VÉRIFICATION
    // ==================================================

    if (!characterType) {
      return res.status(400).json({
        error: "Le type de personnage est manquant."
      });
    }

    if (!height || !weight) {
      return res.status(400).json({
        error: "La taille ou le poids est manquant."
      });
    }

    if (!image) {
      return res.status(400).json({
        error: "La photo est manquante."
      });
    }

    // ==================================================
    // TYPE MIME SÉCURISÉ
    // ==================================================

    const safeMimeType =
      typeof mimeType === "string" &&
      /^image\/(jpeg|jpg|png|webp|gif)$/.test(mimeType)
        ? mimeType
        : "image/jpeg";

    // ==================================================
    // CLÉ API
    // ==================================================

    if (!process.env.gemini_api_key) {
      return res.status(500).json({
        error: "La clé Gemini n'est pas configurée dans Vercel."
      });
    }

    // ==================================================
    // PROMPT
    // ==================================================

    const prompt = `

Tu es l'IA de DisneyBound.

À partir de la photo fournie, crée une tenue DisneyBound
moderne, élégante et portable au quotidien.

ANALYSE UNIQUEMENT :

- style vestimentaire
- couleurs visibles
- types de vêtements
- coupes générales
- style casual, streetwear, chic ou sportif
- harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais :
- son identité
- son âge
- son origine
- sa profession
- sa personnalité
- toute autre information personnelle.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour choisir
des coupes et proportions adaptées.

Le type demandé est :
${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney correspondant
au style observé et au type demandé.

DisneyBound signifie s'inspirer du personnage,
pas reproduire son costume.

INTERDIT :
- cosplay
- déguisement
- costume
- oreilles de personnage
- imprimés représentant le personnage
- accessoires de cosplay
- vêtements extravagants

PRIVILÉGIE :
- couleurs
- palette
- matières
- silhouettes
- détails subtils
- accessoires discrets
- vêtements disponibles dans des boutiques classiques

La tenue doit rester cohérente avec le style
observé sur la photo.

Si le style est casual, reste casual.
Si le style est streetwear, reste streetwear.
Si le style est chic, reste chic.
Si le style est sportif, reste sportif/casual.

CHAUSSURES :

Privilégie :
- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement
s'ils sont cohérents avec le style observé.

DESCRIPTION DES VÊTEMENTS :

"haut", "bas", "veste" et "chaussures"
doivent contenir uniquement une description
courte du vêtement.

NE PAS mettre de recherche dans ces champs.

Exemple :

"haut": "Body noir à fines bretelles"

RECHERCHES :

Chaque recherche doit être directement utilisable
dans une boutique de vêtements.

Maximum 8 mots.

Les recherches doivent être différentes
des descriptions.

Exemple :

"haut": "Body noir à fines bretelles"

"recherches.haut": "body noir fines bretelles femme"

Ne jamais répéter la description.

Ne jamais mettre le nom du personnage
dans une recherche.

ACCESSOIRES :

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

COULEURS :

Indique entre 3 et 5 couleurs principales.

RÉPONDS UNIQUEMENT AVEC LE JSON.

Aucun texte avant le JSON.
Aucun texte après le JSON.

Utilise exactement cette structure :

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

    // ==================================================
    // APPEL GEMINI
    // ==================================================

    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
      encodeURIComponent(process.env.gemini_api_key);

    const response = await fetch(
      geminiUrl,
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
                    mimeType: safeMimeType,
                    data: image
                  }
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

    // ==================================================
    // RÉPONSE GEMINI
    // ==================================================

    const data = await response.json();

    // ==================================================
    // ERREUR GEMINI
    // ==================================================

    if (!response.ok) {

      console.error(
        "Erreur Gemini :",
        JSON.stringify(data, null, 2)
      );

      return res.status(500).json({
        error:
          data?.error?.message ||
          "Erreur lors de la communication avec Gemini."
      });
    }

    // ==================================================
    // RÉCUPÉRATION DU TEXTE
    // ==================================================

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {

      console.error(
        "Réponse Gemini inattendue :",
        JSON.stringify(data, null, 2)
      );

      return res.status(500).json({
        error: "Gemini n'a pas renvoyé de résultat."
      });
    }

    // ==================================================
    // PARSE JSON
    // ==================================================

    let disneyBound;

    try {

      disneyBound = JSON.parse(result);

    } catch (error) {

      console.error(
        "JSON Gemini invalide :",
        result
      );

      return res.status(500).json({
        error: "Gemini n'a pas renvoyé un JSON valide."
      });
    }

    // ==================================================
    // VÉRIFICATION DU RÉSULTAT
    // ==================================================

    if (
      !disneyBound.personnage ||
      !disneyBound.haut ||
      !disneyBound.bas ||
      !disneyBound.veste ||
      !disneyBound.chaussures
    ) {

      console.error(
        "Résultat incomplet :",
        disneyBound
      );

      return res.status(500).json({
        error:
          "La réponse de Gemini est incomplète."
      });
    }

    // ==================================================
    // VALEURS PAR DÉFAUT
    // ==================================================

    if (!Array.isArray(disneyBound.accessoires)) {
      disneyBound.accessoires = [];
    }

    if (!Array.isArray(disneyBound.couleurs)) {
      disneyBound.couleurs = [];
    }

    if (!disneyBound.recherches) {
      disneyBound.recherches = {};
    }

    // ==================================================
    // RÉPONSE AU SITE
    // ==================================================

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
        error?.message ||
        "Erreur serveur."
    });
  }
}
```
