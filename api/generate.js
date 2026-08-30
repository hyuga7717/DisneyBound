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


    if (!topSize) {

      return res.status(400).json({

        success: false,

        error:
          "La taille du haut est manquante."

      });

    }


    if (!bottomSize) {

      return res.status(400).json({

        success: false,

        error:
          "La taille du bas est manquante."

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

Sa taille de haut est :

${topSize}

Sa taille de bas est :

${bottomSize}

Utilise la taille, le poids et les tailles de vêtements
UNIQUEMENT pour déterminer des proportions générales,
des coupes et des volumes de vêtements adaptés.

La taille de haut ${topSize} doit être respectée pour
la sélection et la description du haut.

La taille de bas ${bottomSize} doit être respectée pour
la sélection et la description du bas.

Si la taille du bas est numérique, il s'agit d'une taille
française/européenne de vêtement.

Ne donne aucune analyse ou appréciation du corps.

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
TAILLES
==========================================

La taille du haut sélectionnée est :

${topSize}

La taille du bas sélectionnée est :

${bottomSize}

IMPORTANT :

Ne remplace jamais ces tailles par une autre taille.

Adapte les descriptions des vêtements à ces tailles.

Pour le haut, choisis une coupe compatible avec la taille
${topSize}.

Pour le bas, choisis une coupe compatible avec la taille
${bottomSize}.

Ne mentionne pas le poids de la personne dans le résultat.

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
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent rester suffisamment générales pour
permettre de trouver des produits disponibles en ligne.

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

IMPORTANT :

Ne mets pas la taille dans les recherches produits.

La taille est déjà utilisée pour déterminer la coupe et
le vêtement adapté.

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
     * Gemini 3.5 Flash-Lite
     *
     */

    const model =
      "gemini-3.5-flash-lite";


    /*
     * ==========================================
     * 7. URL
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

        success: false,

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

        success: false,

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

        success: false,

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

        success: false,

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
     * 16. REPONSE
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
     * 17. ERREUR GENERALE
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