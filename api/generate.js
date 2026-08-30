```javascript
export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * API GEMINI 3.5 FLASH-LITE
   * ==========================================
   */

  /*
   * ==========================================
   * 1. VERIFICATION DE LA METHODE
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
     * 2. RECUPERATION DES DONNEES
     * ==========================================
     */

    const body = req.body || {};

    const characterType = body.characterType;
    const height = body.height;
    const weight = body.weight;
    const image = body.image;
    const mimeType = body.mimeType;


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


    if (!height || !weight) {

      return res.status(400).json({
        success: false,
        error: "La taille ou le poids est manquant."
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
     * 4. CLE GEMINI
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key;


    if (!apiKey) {

      console.error(
        "ERREUR : gemini_api_key absente."
      );

      return res.status(500).json({
        success: false,
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }


    /*
     * ==========================================
     * 5. PROMPT DISNEYBOUND
     * ==========================================
     */

    const prompt = `

Tu es l'IA officielle de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante, réaliste et portable au quotidien à partir
de la photo fournie.

==========================================
ANALYSE DE LA PHOTO
==========================================

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
- accessoires déjà visibles

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
- toute autre information personnelle sensible.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour déterminer des
proportions générales de vêtements et proposer des coupes
adaptées.

Ne donne aucune analyse ou appréciation du corps.

==========================================
TYPE DE PERSONNAGE
==========================================

${
  characterType === "villain"
    ? "Le personnage doit être un MÉCHANT Disney."
    : "Le personnage doit être un PERSONNAGE DISNEY GENTIL."
}

Choisis UN personnage Disney.

Le personnage choisi doit correspondre :

- au style vestimentaire observé
- aux couleurs observées
- à l'univers demandé
- à une tenue portable au quotidien.

Évite de choisir systématiquement le même personnage.

==========================================
PRINCIPE DISNEYBOUND
==========================================

Le résultat doit être un véritable DisneyBound.

Le personnage sert uniquement d'inspiration.

NE REPRODUIS PAS son costume.

La tenue doit pouvoir être portée dans la vie quotidienne.

==========================================
INTERDICTIONS
==========================================

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte du personnage
- oreilles de personnage
- imprimés représentant le personnage
- logos du personnage
- accessoires de cosplay
- vêtements extravagants
- tenue de convention
- reproduction exacte d'une tenue Disney.

==========================================
PRIVILEGIER
==========================================

Privilégie :

- vêtements de mode classiques
- couleurs inspirées du personnage
- palette de couleurs
- matières
- silhouettes
- coupes modernes
- détails subtils
- accessoires discrets
- vêtements trouvables dans des boutiques classiques.

==========================================
COHERENCE AVEC LA PHOTO
==========================================

Conserve une partie importante du style observé.

Si le style observé est casual :

reste casual.

Si le style observé est streetwear :

reste majoritairement streetwear.

Si le style observé est chic :

reste chic.

Si le style observé est sportif :

reste sportif et moderne.

Le résultat ne doit jamais sembler complètement déconnecté
du style de la personne photographiée.

==========================================
CHAUSSURES
==========================================

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates
- chaussures casual

Les talons sont autorisés uniquement s'ils sont cohérents
avec le style observé.

==========================================
TENUE
==========================================

Propose exactement :

- 1 haut
- 1 bas
- 1 veste ou couche extérieure
- 1 paire de chaussures
- 2 à 4 accessoires

Chaque pièce doit être réaliste et achetable dans une
boutique de mode classique.

==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode dans une boutique en ligne.

La description et la recherche sont deux éléments différents.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"

==========================================
REGLES DES RECHERCHES
==========================================

Pour chaque recherche :

- maximum 8 mots
- mots-clés uniquement
- aucune phrase complète
- aucun guillemet
- aucun nom de personnage
- aucun nom de marque obligatoire
- aucun texte promotionnel
- aucune répétition
- une seule recherche par champ.

Les recherches doivent être naturelles pour Google,
Amazon, Zalando, Vinted ou une boutique de mode.

==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

Les accessoires doivent être courts et réalistes.

Exemple :

[
  "collier doré fin",
  "bracelet minimaliste",
  "sac noir"
]

==========================================
COULEURS
==========================================

Indique entre 3 et 5 couleurs principales.

Exemple :

[
  "noir",
  "violet",
  "doré",
  "argenté"
]

==========================================
FORMAT DE REPONSE
==========================================

IMPORTANT :

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
     * 6. MODELE GEMINI
     * ==========================================
     *
     * IMPORTANT :
     * On utilise Gemini 3.5 Flash-Lite.
     *
     * Ce modèle est choisi pour :
     * - son coût réduit
     * - sa rapidité
     * - les usages à gros volume
     * - notre objectif de nombreuses générations
     *
     * NE PAS remplacer par Gemini 2.5.
     * NE PAS remplacer automatiquement par Gemini 3.6.
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
      "DisneyBound : appel Gemini",
      model
    );


    const geminiResponse =
      await fetch(
        url,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
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
                    inline_data: {

                      mime_type: mimeType,

                      data: image

                    }

                  }

                ]

              }

            ],

            generationConfig: {

              responseMimeType:
                "application/json"

            }

          })

        }
      );


    /*
     * ==========================================
     * 9. LECTURE REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();


    console.log(
      "Gemini HTTP status:",
      geminiResponse.status
    );


    /*
     * ==========================================
     * 10. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      console.error(
        "Erreur complète Gemini :",
        geminiText
      );


      let geminiError = null;


      try {

        geminiError =
          JSON.parse(
            geminiText
          );

      } catch {

        geminiError = null;

      }


      const message =
        geminiError?.error?.message ||
        geminiError?.message ||
        geminiText ||
        `Erreur Gemini HTTP ${geminiResponse.status}`;


      return res.status(500).json({

        success: false,

        error:
          "Erreur Gemini : " +
          message

      });

    }


    /*
     * ==========================================
     * 11. PARSE REPONSE API GEMINI
     * ==========================================
     */

    let geminiData;


    try {

      geminiData =
        JSON.parse(
          geminiText
        );

    } catch (error) {

      console.error(
        "Gemini a renvoyé une réponse API non JSON :",
        geminiText
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini a renvoyé une réponse invalide."

      });

    }


    /*
     * ==========================================
     * 12. EXTRACTION DU TEXTE
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if (!resultText) {

      console.error(
        "Gemini ne contient aucun texte.",
        geminiData
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 13. PARSE DU JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;


    try {

      disneyBound =
        JSON.parse(
          resultText
        );

    } catch (error) {

      console.error(
        "JSON DisneyBound invalide :",
        resultText
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini a répondu, mais le résultat DisneyBound n'est pas un JSON valide."

      });

    }


    /*
     * ==========================================
     * 14. VERIFICATION STRUCTURE
     * ==========================================
     */

    if (
      typeof disneyBound !== "object" ||
      disneyBound === null
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Le résultat DisneyBound n'est pas un objet valide."

      });

    }


    if (!disneyBound.personnage) {

      return res.status(500).json({

        success: false,

        error:
          "Le personnage Disney est manquant."

      });

    }


    if (!disneyBound.haut) {

      return res.status(500).json({

        success: false,

        error:
          "Le haut est manquant."

      });

    }


    if (!disneyBound.bas) {

      return res.status(500).json({

        success: false,

        error:
          "Le bas est manquant."

      });

    }


    if (!disneyBound.veste) {

      return res.status(500).json({

        success: false,

        error:
          "La veste est manquante."

      });

    }


    if (!disneyBound.chaussures) {

      return res.status(500).json({

        success: false,

        error:
          "Les chaussures sont manquantes."

      });

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
      typeof disneyBound.recherches !== "object"
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Les recherches produits sont invalides."

      });

    }


    /*
     * ==========================================
     * 15. VERIFICATION DES RECHERCHES
     * ==========================================
     */

    const requiredSearches = [
      "haut",
      "bas",
      "veste",
      "chaussures",
      "accessoires"
    ];


    for (
      const key of requiredSearches
    ) {

      if (
        !disneyBound.recherches[key]
      ) {

        return res.status(500).json({

          success: false,

          error:
            `La recherche produit "${key}" est manquante.`

        });

      }

    }


    /*
     * ==========================================
     * 16. REPONSE AU SITE
     * ==========================================
     */

    console.log(
      "DisneyBound généré avec succès :",
      disneyBound.personnage
    );


    return res.status(200).json({

      success: true,

      result: disneyBound

    });


  } catch (error) {

    /*
     * ==========================================
     * 17. ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "Erreur serveur DisneyBound :",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "Erreur interne du serveur DisneyBound."

    });

  }

}
```
