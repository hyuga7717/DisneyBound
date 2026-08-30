export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * GEMINI 3.5 FLASH-LITE
   * ==========================================
   */

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée."
    });

  }

  try {

    /*
     * ==========================================
     * 1. BODY
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

    const image =
      body.image;

    const mimeType =
      body.mimeType;


    /*
     * ==========================================
     * 2. VALIDATION
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

    if (!topSize) {

      return res.status(400).json({
        success: false,
        error:
          "La taille habituelle du haut est manquante."
      });

    }

    if (!bottomSize) {

      return res.status(400).json({
        success: false,
        error:
          "La taille habituelle du bas est manquante."
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
     * 3. CLE GEMINI
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
     * 4. MODELE
     * ==========================================
     */

    const model =
      "gemini-3.5-flash-lite";


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

INFORMATIONS FOURNIES PAR L'UTILISATEUR :

Taille : ${height} cm
Poids : ${weight} kg
Taille habituelle du haut : ${topSize}
Taille habituelle du bas : ${bottomSize}

Utilise ces informations uniquement pour choisir des
proportions et des tailles de vêtements cohérentes.

IMPORTANT :

Les tailles habituelles fournies par l'utilisateur sont
des informations de référence.

Ne tente PAS de calculer une taille de vêtement à partir
du poids ou de la taille de la personne.

Utilise en priorité les tailles de vêtements indiquées
par l'utilisateur.

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
- à une tenue portable au quotidien.

Évite de choisir systématiquement le même personnage.

==========================================
PRINCIPE DISNEYBOUND
==========================================

Inspire-toi du personnage sans reproduire son costume.

La tenue doit être portable dans la vie quotidienne.

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

Casual = casual.

Streetwear = majoritairement streetwear.

Chic = chic.

Sportif = sportif et moderne.

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
avec le style observé.

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
TAILLES
==========================================

Indique les tailles utilisées pour la tenue.

Pour le haut :

Conserve la taille habituelle fournie par l'utilisateur :
${topSize}

Pour le bas :

Conserve la taille habituelle fournie par l'utilisateur :
${bottomSize}

IMPORTANT :

Lorsque cela est pertinent, indique les deux systèmes :

- taille en lettres : XS, S, M, L, XL, XXL
- taille française chiffrée : 34, 36, 38, 40, 42, 44, etc.

Ne supprime jamais la taille chiffrée.

==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent intégrer la taille uniquement lorsque
cela permet réellement d'obtenir de meilleurs résultats.

Exemple :

haut :

"Top noir ajusté à fines bretelles"

recherches.haut :

"top noir fines bretelles femme 38"

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

==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

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

Utilise exactement cette structure :

{
  "personnage": "",
  "haut": "",
  "bas": "",
  "veste": "",
  "chaussures": "",
  "accessoires": [],
  "couleurs": [],
  "tailles": {
    "haut": "",
    "bas": ""
  },
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
     * 6. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(apiKey);


    /*
     * ==========================================
     * 7. APPEL GEMINI
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
          method: "POST",

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
     * 8. REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();

    console.log(
      "Gemini HTTP :",
      geminiResponse.status
    );


    /*
     * ==========================================
     * 9. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      console.error(
        "Gemini error:",
        geminiText
      );

      let errorData = null;

      try {

        errorData =
          JSON.parse(
            geminiText
          );

      } catch {

        errorData = null;

      }

      const message =
        errorData?.error?.message ||
        errorData?.message ||
        geminiText ||
        "Erreur inconnue Gemini.";

      return res.status(500).json({

        success: false,

        error:
          "Erreur Gemini : " +
          message

      });

    }


    /*
     * ==========================================
     * 10. JSON API GEMINI
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

        success: false,

        error:
          "Gemini a renvoyé une réponse API invalide."

      });

    }


    /*
     * ==========================================
     * 11. EXTRACTION TEXTE
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

        success: false,

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 12. JSON DISNEYBOUND
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

        success: false,

        error:
          "Le résultat Gemini n'est pas un JSON DisneyBound valide."

      });

    }


    /*
     * ==========================================
     * 13. VALIDATION STRUCTURE
     * ==========================================
     */

    if (
      typeof disneyBound !==
        "object" ||
      disneyBound === null
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Le résultat DisneyBound est invalide."

      });

    }


    const requiredFields = [

      "personnage",
      "haut",
      "bas",
      "veste",
      "chaussures"

    ];


    for (
      const field of requiredFields
    ) {

      if (
        !disneyBound[field]
      ) {

        return res.status(500).json({

          success: false,

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

        success: false,

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

        success: false,

        error:
          "Les couleurs sont invalides."

      });

    }


    if (
      !disneyBound.tailles ||
      typeof disneyBound.tailles !==
        "object"
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Les tailles sont invalides."

      });

    }


    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !==
        "object"
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Les recherches produits sont invalides."

      });

    }


    /*
     * ==========================================
     * 14. REPONSE
     * ==========================================
     */

    console.log(
      "DisneyBound réussi :",
      disneyBound.personnage
    );

    return res.status(200).json({

      success: true,

      result:
        disneyBound

    });


  } catch (error) {

    /*
     * ==========================================
     * 15. ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "Erreur API DisneyBound:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "Erreur interne du serveur."

    });

  }

}