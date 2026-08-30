````javascript
export default async function handler(req, res) {

  // ==========================================
  // 1. MÉTHODE
  // ==========================================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée."
    });
  }

  try {

    // ==========================================
    // 2. DONNÉES REÇUES
    // ==========================================

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};

    console.log("=== DISNEYBOUND API ===");
    console.log("characterType:", characterType);
    console.log("height:", height);
    console.log("weight:", weight);
    console.log("mimeType:", mimeType);
    console.log("image présente:", !!image);

    // ==========================================
    // 3. VALIDATION
    // ==========================================

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

    if (!mimeType) {
      return res.status(400).json({
        error: "Le type MIME de la photo est manquant."
      });
    }

    // ==========================================
    // 4. CLÉ GEMINI
    // ==========================================

    const apiKey = process.env.gemini_api_key;

    if (!apiKey) {

      console.error(
        "ERREUR : gemini_api_key absente."
      );

      return res.status(500).json({
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });
    }

    // ==========================================
    // 5. PROMPT
    // ==========================================

    const prompt = `

Tu es l'IA de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et portable au quotidien à partir de la photo fournie.

==================================================
ANALYSE DE LA PHOTO
==================================================

Analyse uniquement :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- coupes générales
- style casual
- style streetwear
- style chic
- style sportif
- harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais :

- identité
- âge
- origine
- profession
- état de santé
- personnalité
- toute autre information personnelle.

==================================================
MORPHOLOGIE
==================================================

Taille : ${height} cm
Poids : ${weight} kg

Utilise ces informations uniquement pour choisir des
coupes et proportions adaptées.

Ne donne aucune analyse ou appréciation du corps.

==================================================
PERSONNAGE
==================================================

Type demandé :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney.

Le personnage doit correspondre :

- au style de la photo
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien

Évite de choisir systématiquement le même personnage.

==================================================
DISNEYBOUND
==================================================

Inspire-toi du personnage sans reproduire son costume.

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte
- oreilles de personnage
- imprimés représentant le personnage
- accessoires de cosplay
- vêtements extravagants.

PRIVILÉGIE :

- couleurs
- palette
- matières
- silhouettes
- détails subtils
- accessoires discrets
- vêtements trouvables dans des boutiques classiques.

==================================================
COHÉRENCE AVEC LA PHOTO
==================================================

Conserve une partie importante du style observé.

Si le style est casual, reste casual.

Si le style est streetwear, reste majoritairement streetwear.

Si le style est chic, reste chic.

==================================================
CHAUSSURES
==================================================

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement s'ils sont cohérents
avec le style observé.

==================================================
RECHERCHES PRODUITS
==================================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode dans une boutique en ligne.

DESCRIPTION ET RECHERCHE SONT DEUX CHOSES DIFFÉRENTES.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"

RÈGLES :

- maximum 8 mots
- mots-clés uniquement
- pas de phrase
- pas de guillemets
- pas de nom du personnage
- une seule recherche par champ
- aucune répétition
- ne jamais coller description et recherche

==================================================
ACCESSOIRES
==================================================

Propose entre 2 et 4 accessoires.

Chaque accessoire doit être court.

==================================================
COULEURS
==================================================

Indique entre 3 et 5 couleurs principales.

==================================================
RÉPONSE
==================================================

Réponds UNIQUEMENT avec un JSON valide.

Aucun texte avant.

Aucun texte après.

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

    // ==========================================
    // 6. URL GEMINI
    // ==========================================

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

    // ==========================================
    // 7. REQUÊTE GEMINI
    // ==========================================

    const geminiResponse = await fetch(url, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },

      body: JSON.stringify({

        contents: [
          {
            role: "user",

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
          responseMimeType: "application/json",
          temperature: 0.7
        }

      })

    });

    // ==========================================
    // 8. RÉPONSE GEMINI
    // ==========================================

    const rawGemini = await geminiResponse.text();

    console.log(
      "Gemini HTTP status:",
      geminiResponse.status
    );

    console.log(
      "Gemini raw response:",
      rawGemini
    );

    // ==========================================
    // 9. ERREUR GEMINI
    // ==========================================

    if (!geminiResponse.ok) {

      let errorMessage =
        "Erreur Gemini.";

      try {

        const errorData =
          JSON.parse(rawGemini);

        errorMessage =
          errorData?.error?.message ||
          errorMessage;

      } catch {

        console.error(
          "Gemini a renvoyé une réponse non JSON."
        );

      }

      return res.status(500).json({
        error: errorMessage
      });
    }

    // ==========================================
    // 10. JSON DE L'API GEMINI
    // ==========================================

    let geminiData;

    try {

      geminiData =
        JSON.parse(rawGemini);

    } catch (error) {

      console.error(
        "Impossible de parser la réponse API Gemini :",
        rawGemini
      );

      return res.status(500).json({
        error:
          "Gemini a renvoyé une réponse invalide."
      });
    }

    // ==========================================
    // 11. RÉCUPÉRATION DU TEXTE
    // ==========================================

    const parts =
      geminiData?.candidates?.[0]?.content?.parts;

    if (!Array.isArray(parts)) {

      console.error(
        "Aucune partie dans la réponse Gemini :",
        geminiData
      );

      return res.status(500).json({
        error:
          "Gemini n'a pas renvoyé de contenu."
      });
    }

    const resultText =
      parts
        .filter(part => typeof part.text === "string")
        .map(part => part.text)
        .join("")
        .trim();

    console.log(
      "Texte Gemini :",
      resultText
    );

    if (!resultText) {

      return res.status(500).json({
        error:
          "Gemini n'a pas renvoyé de texte."
      });
    }

    // ==========================================
    // 12. NETTOYAGE DU JSON
    // ==========================================

    let cleanJson =
      resultText.trim();

    // Supprime éventuellement les ```json
    if (cleanJson.startsWith("```")) {

      cleanJson =
        cleanJson
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
    }

    // ==========================================
    // 13. PARSE DU JSON DISNEYBOUND
    // ==========================================

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(cleanJson);

    } catch (error) {

      console.error(
        "JSON DisneyBound invalide :",
        cleanJson
      );

      return res.status(500).json({
        error:
          "Gemini a répondu mais le JSON DisneyBound est invalide."
      });
    }

    // ==========================================
    // 14. NORMALISATION
    // ==========================================

    if (!disneyBound.personnage) {
      disneyBound.personnage =
        "Personnage Disney";
    }

    if (!disneyBound.haut) {
      disneyBound.haut = "";
    }

    if (!disneyBound.bas) {
      disneyBound.bas = "";
    }

    if (!disneyBound.veste) {
      disneyBound.veste = "";
    }

    if (!disneyBound.chaussures) {
      disneyBound.chaussures = "";
    }

    if (!Array.isArray(disneyBound.accessoires)) {
      disneyBound.accessoires = [];
    }

    if (!Array.isArray(disneyBound.couleurs)) {
      disneyBound.couleurs = [];
    }

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !== "object"
    ) {

      disneyBound.recherches = {};

    }

    if (!disneyBound.recherches.haut) {
      disneyBound.recherches.haut = "";
    }

    if (!disneyBound.recherches.bas) {
      disneyBound.recherches.bas = "";
    }

    if (!disneyBound.recherches.veste) {
      disneyBound.recherches.veste = "";
    }

    if (!disneyBound.recherches.chaussures) {
      disneyBound.recherches.chaussures = "";
    }

    if (!disneyBound.recherches.accessoires) {
      disneyBound.recherches.accessoires = "";
    }

    // ==========================================
    // 15. RÉPONSE FINALE AU SITE
    // ==========================================

    console.log(
      "DisneyBound final :",
      disneyBound
    );

    return res.status(200).json({

      success: true,

      result: disneyBound

    });

  } catch (error) {

    console.error(
      "ERREUR SERVEUR DISNEYBOUND :",
      error
    );

    return res.status(500).json({

      error:
        error?.message ||
        "Erreur interne du serveur."

    });

  }

}
````
