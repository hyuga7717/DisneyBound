export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * GEMINI 3.5 FLASH-LITE
   * ==========================================
   */

  /*
   * ==========================================
   * 1. METHOD
   * ==========================================
   */

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      error:
        "Méthode non autorisée."
    });

  }

  try {

    /*
     * ==========================================
     * 2. BODY
     * ==========================================
     */

    const body =
      req.body || {};

    const characterType =
      body.characterType;

    const height =
      body.height;

    const weight =
      body.weight;

    const topSize =
      body.topSize;

    const bottomSize =
      body.bottomSize;

    const shoeSize =
      body.shoeSize;

    const fitPreference =
      body.fitPreference;

    const stylePreference =
      body.stylePreference;

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
        error:
          "Le type de personnage est manquant."
      });

    }

    if (!height || !weight) {

      return res.status(400).json({
        success: false,
        error:
          "La taille ou le poids est manquant."
      });

    }

    if (!topSize || !bottomSize) {

      return res.status(400).json({
        success: false,
        error:
          "La taille de haut ou de bas est manquante."
      });

    }

    if (!shoeSize) {

      return res.status(400).json({
        success: false,
        error:
          "La pointure est manquante."
      });

    }

    if (!fitPreference) {

      return res.status(400).json({
        success: false,
        error:
          "La coupe préférée est manquante."
      });

    }

    if (!stylePreference) {

      return res.status(400).json({
        success: false,
        error:
          "Le style vestimentaire est manquant."
      });

    }

    if (!image) {

      return res.status(400).json({
        success: false,
        error:
          "La photo est manquante."
      });

    }

    if (!mimeType) {

      return res.status(400).json({
        success: false,
        error:
          "Le type d'image est manquant."
      });

    }

    /*
     * ==========================================
     * 4. GEMINI API KEY
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key;

    if (!apiKey) {

      console.error(
        "gemini_api_key absente."
      );

      return res.status(500).json({
        success: false,
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }

    /*
     * ==========================================
     * 5. PROMPT
     * ==========================================
     */

    const prompt = `

Tu es l'IA officielle de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante, réaliste et portable au quotidien à partir
de la photo fournie.

Analyse uniquement les éléments visuels utiles à la
création d'une tenue :

- style vestimentaire général
- couleurs visibles
- vêtements portés
- coupes générales
- matières apparentes
- style casual
- style streetwear
- style chic
- style sportif
- harmonie générale
- accessoires visibles

Ne cherche jamais à identifier la personne.

Ne déduis jamais :

- identité
- âge
- origine
- ethnie
- profession
- état de santé
- personnalité
- situation sociale
- information personnelle sensible.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour déterminer
des proportions générales de vêtements et proposer des
coupes adaptées.

Ne donne aucune analyse ou appréciation du corps.

==========================================
INFORMATIONS VESTIMENTAIRES FOURNIES
==========================================

Taille haut : ${topSize}

Taille bas : ${bottomSize}

Pointure : ${shoeSize}

Coupe préférée : ${fitPreference}

Style vestimentaire préféré : ${stylePreference}

Ces informations sont importantes.

Utilise-les pour :

- choisir des coupes cohérentes
- respecter les préférences de silhouette
- choisir des vêtements réalistes
- adapter les proportions
- améliorer la pertinence des recherches produits.

Ne mentionne jamais le poids dans le résultat final.

Ne fais aucune remarque sur le corps.

==========================================
TYPE DE PERSONNAGE
==========================================

${
  characterType === "villain"
    ? "Choisis un MÉCHANT Disney."
    : "Choisis un PERSONNAGE DISNEY GENTIL."
}

Choisis UN personnage Disney correspondant :

- au style observé
- aux couleurs observées
- au type demandé
- au style vestimentaire préféré
- à une tenue portable au quotidien.

Évite de choisir systématiquement le même personnage.

==========================================
PRINCIPE DISNEYBOUND
==========================================

Inspire-toi du personnage sans reproduire son costume.

La tenue doit être portable dans la vie quotidienne.

Le résultat doit évoquer le personnage grâce :

- aux couleurs
- aux matières
- aux formes
- aux associations
- aux détails subtils.

==========================================
INTERDIT
==========================================

- cosplay
- déguisement
- costume
- reproduction exacte
- oreilles de personnage
- imprimés représentant le personnage
- logos du personnage
- accessoires cosplay
- vêtements extravagants
- tenue de convention.

==========================================
PRIVILÉGIER
==========================================

- vêtements classiques
- couleurs inspirées du personnage
- palette cohérente
- matières
- silhouettes modernes
- détails subtils
- accessoires discrets
- vêtements trouvables en boutique classique.

==========================================
COHERENCE STYLE
==========================================

Conserve une partie importante du style observé.

Le style préféré fourni par l'utilisateur doit également
être pris en compte.

Casual = casual.

Streetwear = majoritairement streetwear.

Chic = chic.

Sportif = sportif et moderne.

Si le style observé et le style préféré sont différents,
trouve un compromis naturel plutôt que d'ignorer complètement
l'un des deux.

==========================================
TAILLES ET COUPES
==========================================

Respecte les tailles fournies :

Haut : ${topSize}

Bas : ${bottomSize}

Pointure : ${shoeSize}

Coupe préférée : ${fitPreference}

Ne mets PAS automatiquement les tailles dans les
descriptions des vêtements.

Les tailles servent principalement à choisir des coupes
et des proportions adaptées.

==========================================
CHAUSSURES
==========================================

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates
- chaussures casual.

Les talons sont autorisés uniquement s'ils sont cohérents
avec le style observé et le style préféré.

La pointure fournie est ${shoeSize}.

==========================================
TENUE
==========================================

Propose :

- 1 haut
- 1 bas
- 1 veste ou couche extérieure
- 1 paire de chaussures
- 2 à 4 accessoires.

==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent être suffisamment précises pour
correspondre au vêtement proposé.

Exemple :

haut :
"Top noir ajusté à fines bretelles"

recherches.haut :
"top noir fines bretelles femme"

==========================================
REGLES RECHERCHES
==========================================

- maximum 8 mots
- mots-clés uniquement
- aucune phrase
- aucun guillemet
- aucun nom de personnage
- aucune marque obligatoire
- aucune répétition
- une seule recherche par champ.

Les recherches doivent être naturelles pour une recherche
sur une boutique de mode en ligne.

==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court et réaliste.

==========================================
COULEURS
==========================================

Indique entre 3 et 5 couleurs principales.

==========================================
JSON
==========================================

Réponds UNIQUEMENT avec le JSON.

Aucun texte avant.

Aucun texte après.

Structure exacte :

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
     * 6. MODELE
     * ==========================================
     *
     * NE PAS CHANGER.
     *
     * Gemini 3.5 Flash-Lite
     *
     */

    const model =
      "gemini-3.5-flash-lite";

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
     * 8. APPEL GEMINI
     * ==========================================
     */

    console.log(
      "DisneyBound → Gemini :",
      model
    );

    const geminiResponse =
      await fetch(
        url,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              contents: [

                {

                  role:
                    "user",

                  parts: [

                    {
                      text:
                        prompt
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
                  0.8

              }

            })

        }
      );

    /*
     * ==========================================
     * 9. REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();

    console.log(
      "Gemini HTTP :",
      geminiResponse.status
    );

    console.log(
      "Gemini réponse reçue :",
      geminiText
    );

    /*
     * ==========================================
     * 10. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      console.error(
        "Gemini error:",
        geminiText
      );

      let errorData =
        null;

      try {

        errorData =
          JSON.parse(
            geminiText
          );

      } catch {

        errorData =
          null;

      }

      const message =
        errorData?.error?.message ||
        errorData?.message ||
        geminiText ||
        "Erreur inconnue Gemini.";

      return res.status(500).json({

        success:
          false,

        error:
          "Erreur Gemini : " +
          message

      });

    }

    /*
     * ==========================================
     * 11. JSON GEMINI API
     * ==========================================
     */

    let geminiData;

    try {

      geminiData =
        JSON.parse(
          geminiText
        );

    } catch {

      console.error(
        "Gemini API non JSON:",
        geminiText
      );

      return res.status(500).json({

        success:
          false,

        error:
          "Gemini a renvoyé une réponse API invalide."

      });

    }

    /*
     * ==========================================
     * 12. TEXTE RESULTAT
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!resultText) {

      console.error(
        "Gemini sans texte:",
        JSON.stringify(
          geminiData
        )
      );

      return res.status(500).json({

        success:
          false,

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }

    /*
     * ==========================================
     * 13. JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(
          resultText
        );

    } catch {

      console.error(
        "JSON DisneyBound invalide:",
        resultText
      );

      return res.status(500).json({

        success:
          false,

        error:
          "Le résultat Gemini n'est pas un JSON DisneyBound valide."

      });

    }

    /*
     * ==========================================
     * 14. NORMALISATION
     * ==========================================
     */

    if (
      typeof disneyBound !==
        "object" ||
      disneyBound === null
    ) {

      return res.status(500).json({

        success:
          false,

        error:
          "Le résultat DisneyBound est invalide."

      });

    }

    /*
     * ==========================================
     * 15. VERIFICATION
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
      const field of
      requiredFields
    ) {

      if (
        typeof disneyBound[field] !==
          "string" ||
        !disneyBound[field].trim()
      ) {

        return res.status(500).json({

          success:
            false,

          error:
            `Le champ "${field}" est manquant.`

        });

      }

    }

    if (
      !Array.isArray(
        disneyBound.accessoires
      )
    ) {

      return res.status(500).json({

        success:
          false,

        error:
          "Les accessoires sont invalides."

      });

    }

    if (
      !Array.isArray(
        disneyBound.couleurs
      )
    ) {

      return res.status(500).json({

        success:
          false,

        error:
          "Les couleurs sont invalides."

      });

    }

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !==
        "object"
    ) {

      return res.status(500).json({

        success:
          false,

        error:
          "Les recherches produits sont invalides."

      });

    }

    /*
     * ==========================================
     * 16. NORMALISATION RECHERCHES
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
      const field of
      searchFields
    ) {

      if (
        typeof disneyBound.recherches[field] !==
          "string"
      ) {

        disneyBound.recherches[field] =
          "";

      }

      disneyBound.recherches[field] =
        disneyBound.recherches[field]
          .trim();

    }

    /*
     * ==========================================
     * 17. REPONSE
     * ==========================================
     */

    console.log(
      "DisneyBound réussi :",
      disneyBound.personnage
    );

    return res.status(200).json({

      success:
        true,

      result:
        disneyBound

    });

  } catch (error) {

    /*
     * ==========================================
     * 18. ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "Erreur API DisneyBound:",
      error
    );

    return res.status(500).json({

      success:
        false,

      error:
        error?.message ||
        "Erreur interne du serveur."

    });

  }

}