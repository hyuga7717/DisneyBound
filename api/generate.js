export default async function handler(req, res) {

  /*
   * ==========================================
   * 1. MÉTHODE
   * ==========================================
   */

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée. Utilise POST."
    });

  }


  try {

    /*
     * ==========================================
     * 2. BODY
     * ==========================================
     */

    const body = req.body || {};

    const characterType =
      body.characterType;

    const height =
      body.height;

    const weight =
      body.weight;

    const image =
      body.image;

    const mimeType =
      body.mimeType;


    /*
     * ==========================================
     * 3. VALIDATION
     * ==========================================
     */

    if (!characterType) {

      return res.status(400).json({
        success: false,
        error: "Le type de personnage est manquant."
      });

    }


    if (!height) {

      return res.status(400).json({
        success: false,
        error: "La taille est manquante."
      });

    }


    if (!weight) {

      return res.status(400).json({
        success: false,
        error: "Le poids est manquant."
      });

    }


    if (!image) {

      return res.status(400).json({
        success: false,
        error: "La photo est manquante."
      });

    }


    if (!mimeType) {

      return res.status(400).json({
        success: false,
        error: "Le type de fichier image est manquant."
      });

    }


    /*
     * ==========================================
     * 4. CLÉ GEMINI
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key ||
      process.env.GEMINI_API_KEY;


    if (!apiKey) {

      console.error(
        "Aucune clé Gemini trouvée."
      );

      return res.status(500).json({
        success: false,
        error:
          "La clé Gemini n'est pas configurée dans les variables d'environnement Vercel."
      });

    }


    /*
     * ==========================================
     * 5. PROMPT
     * ==========================================
     */

    const prompt = `

Tu es une IA spécialisée dans la création de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante, portable et inspirée subtilement d'un personnage Disney.

Analyse la photo uniquement pour comprendre :

- le style vestimentaire général
- les couleurs visibles
- les types de vêtements
- les coupes générales
- le style casual
- le style streetwear
- le style chic
- le style sportif
- l'harmonie générale de la tenue

NE CHERCHE JAMAIS À IDENTIFIER LA PERSONNE.

NE DÉDUIS JAMAIS :

- son identité
- son âge
- son origine
- sa profession
- son état de santé
- son genre
- toute autre information personnelle sensible.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise uniquement ces informations pour choisir des coupes
et proportions adaptées aux vêtements.

Ne donne aucune analyse ou appréciation du corps.

TYPE DE PERSONNAGE DEMANDÉ :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney.

Le personnage choisi doit correspondre :

- au style observé
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien.

Évite de choisir systématiquement le même personnage.

PRINCIPE DISNEYBOUND :

Le résultat doit être inspiré du personnage,
mais ne doit jamais reproduire son costume.

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte du costume
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

COHÉRENCE AVEC LA PHOTO :

Conserve une partie importante du style observé.

Si la personne porte un style casual,
reste principalement casual.

Si elle porte un style streetwear,
reste principalement streetwear.

Si elle porte un style chic,
reste principalement chic.

CHAUSSURES :

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates
- sandales plates

Les talons sont autorisés uniquement s'ils correspondent
au style observé.

RECHERCHES PRODUITS :

Pour chaque pièce, crée une recherche permettant
de trouver un véritable produit de mode dans une boutique en ligne.

La description et la recherche doivent être différentes.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"

RÈGLES DES RECHERCHES :

- maximum 8 mots
- mots-clés uniquement
- aucune phrase complète
- aucun guillemet
- ne jamais utiliser le nom du personnage
- une seule recherche par champ
- ne pas répéter inutilement les mêmes mots
- la recherche doit être réellement exploitable sur un site marchand.

ACCESSOIRES :

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

COULEURS :

Indique entre 3 et 5 couleurs principales.

IMPORTANT :

Réponds UNIQUEMENT avec l'objet JSON.

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


    /*
     * ==========================================
     * 6. MODÈLE GEMINI
     * ==========================================
     *
     * On utilise un modèle Gemini actuellement
     * prévu pour la génération multimodale.
     */

    const model =
      "gemini-2.5-flash";


    /*
     * ==========================================
     * 7. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(apiKey);


    /*
     * ==========================================
     * 8. REQUÊTE GEMINI
     * ==========================================
     */

    const geminiResponse =
      await fetch(
        url,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              contents: [

                {

                  role: "user",

                  parts: [

                    {
                      text: prompt
                    },

                    {
                      inline_data: {

                        mime_type:
                          mimeType,

                        data:
                          image

                      }

                    }

                  ]

                }

              ],

              generationConfig: {

                responseMimeType:
                  "application/json",

                temperature:
                  0.7,

                maxOutputTokens:
                  1500

              }

            })

        }
      );


    /*
     * ==========================================
     * 9. LECTURE RÉPONSE GEMINI
     * ==========================================
     */

    const rawGeminiText =
      await geminiResponse.text();


    console.log(
      "Gemini HTTP status:",
      geminiResponse.status
    );


    console.log(
      "Gemini réponse brute:",
      rawGeminiText
    );


    /*
     * ==========================================
     * 10. PARSE RÉPONSE GEMINI
     * ==========================================
     */

    let geminiData;


    try {

      geminiData =
        JSON.parse(
          rawGeminiText
        );

    } catch {

      return res.status(502).json({

        success: false,

        error:
          "Gemini a renvoyé une réponse qui n'est pas du JSON valide.",

        details:
          rawGeminiText

      });

    }


    /*
     * ==========================================
     * 11. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      const geminiMessage =
        geminiData?.error?.message ||
        geminiData?.error?.status ||
        "Erreur inconnue de Gemini.";

      console.error(
        "Erreur Gemini:",
        geminiData
      );


      return res.status(502).json({

        success: false,

        error:
          "Erreur Gemini : " +
          geminiMessage

      });

    }


    /*
     * ==========================================
     * 12. EXTRACTION TEXTE
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts
        ?.map(part => part?.text || "")
        .join("")
        .trim();


    if (!resultText) {

      console.error(
        "Gemini sans texte:",
        JSON.stringify(
          geminiData,
          null,
          2
        )
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini n'a renvoyé aucun résultat exploitable."

      });

    }


    console.log(
      "Texte DisneyBound:",
      resultText
    );


    /*
     * ==========================================
     * 13. PARSE DISNEYBOUND
     * ==========================================
     */

    let disneyBound;


    try {

      disneyBound =
        JSON.parse(
          resultText
        );

    } catch {

      /*
       * Sécurité supplémentaire :
       * Gemini peut parfois renvoyer du texte
       * autour du JSON malgré responseMimeType.
       */

      const firstBrace =
        resultText.indexOf("{");

      const lastBrace =
        resultText.lastIndexOf("}");


      if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
      ) {

        const possibleJson =
          resultText.slice(
            firstBrace,
            lastBrace + 1
          );


        try {

          disneyBound =
            JSON.parse(
              possibleJson
            );

        } catch {

          console.error(
            "JSON DisneyBound invalide:",
            resultText
          );


          return res.status(502).json({

            success: false,

            error:
              "Gemini a répondu, mais le résultat DisneyBound n'est pas un JSON valide."

          });

        }

      } else {

        return res.status(502).json({

          success: false,

          error:
            "Gemini n'a pas renvoyé un objet DisneyBound valide."

        });

      }

    }


    /*
     * ==========================================
     * 14. NORMALISATION
     * ==========================================
     */

    if (
      !Array.isArray(
        disneyBound.accessoires
      )
    ) {

      disneyBound.accessoires = [];

    }


    if (
      !Array.isArray(
        disneyBound.couleurs
      )
    ) {

      disneyBound.couleurs = [];

    }


    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !==
      "object"
    ) {

      disneyBound.recherches = {};

    }


    /*
     * ==========================================
     * 15. VÉRIFICATION DES CHAMPS
     * ==========================================
     */

    const requiredFields = [

      "personnage",

      "haut",

      "bas",

      "veste",

      "chaussures"

    ];


    for (
      const field
      of requiredFields
    ) {

      if (
        typeof disneyBound[field] !==
        "string" ||
        !disneyBound[field].trim()
      ) {

        console.error(
          "Champ DisneyBound manquant:",
          field,
          disneyBound
        );


        return res.status(502).json({

          success: false,

          error:
            "Le résultat Gemini est incomplet. Champ manquant : " +
            field

        });

      }

    }


    /*
     * ==========================================
     * 16. VÉRIFICATION RECHERCHES
     * ==========================================
     */

    const searchFields = [

      "haut",

      "bas",

      "veste",

      "chaussures",

      "accessoires"

    ];


    for (
      const field
      of searchFields
    ) {

      if (
        typeof disneyBound.recherches[field] !==
        "string"
      ) {

        disneyBound.recherches[field] =
          "";

      }

    }


    /*
     * ==========================================
     * 17. NETTOYAGE
     * ==========================================
     */

    disneyBound.personnage =
      disneyBound.personnage.trim();

    disneyBound.haut =
      disneyBound.haut.trim();

    disneyBound.bas =
      disneyBound.bas.trim();

    disneyBound.veste =
      disneyBound.veste.trim();

    disneyBound.chaussures =
      disneyBound.chaussures.trim();


    disneyBound.accessoires =
      disneyBound.accessoires
        .filter(
          item =>
            typeof item ===
            "string" &&
            item.trim()
        )
        .map(
          item =>
            item.trim()
        )
        .slice(
          0,
          4
        );


    disneyBound.couleurs =
      disneyBound.couleurs
        .filter(
          item =>
            typeof item ===
            "string" &&
            item.trim()
        )
        .map(
          item =>
            item.trim()
        )
        .slice(
          0,
          5
        );


    /*
     * ==========================================
     * 18. RÉPONSE FINALE
     * ==========================================
     */

    return res.status(200).json({

      success: true,

      result:
        disneyBound

    });


  } catch (error) {

    /*
     * ==========================================
     * 19. ERREUR GÉNÉRALE
     * ==========================================
     */

    console.error(
      "Erreur générale /api/generate:",
      error
    );


    let errorMessage =
      "Erreur interne du serveur.";


    if (
      error &&
      typeof error.message ===
      "string"
    ) {

      errorMessage =
        error.message;

    }


    return res.status(500).json({

      success: false,

      error:
        errorMessage

    });

  }

}