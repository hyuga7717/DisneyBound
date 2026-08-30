````javascript
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
      error: "Méthode non autorisée."
    });

  }


  try {

    /*
     * ==========================================
     * 2. BODY
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
        error: "Le type d'image est manquant."
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
- information personnelle sensible

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
    ? "Choisis un MÉCHANT Disney."
    : "Choisis un PERSONNAGE DISNEY GENTIL."
}

Choisis UN personnage Disney correspondant :

- au style observé
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien

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
- tenue de convention


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
- vêtements trouvables en boutique classique


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
- chaussures casual

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
- 2 à 4 accessoires


==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"


==========================================
REGLES RECHERCHES
==========================================

- maximum 8 mots
- mots-clés uniquement
- aucune phrase complète
- aucun guillemet
- aucun nom de personnage
- aucune marque obligatoire
- aucune répétition
- une seule recherche par champ


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

Réponds UNIQUEMENT avec un objet JSON valide.

Aucun texte avant.

Aucun texte après.

N'utilise PAS de bloc Markdown.

N'utilise PAS de ```.

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
     * ON GARDE GEMINI 3.5 FLASH-LITE
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
                "application/json",

              temperature:
                0.8

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
      "Gemini HTTP :",
      geminiResponse.status
    );


    console.log(
      "Gemini RAW :",
      geminiText
    );


    /*
     * ==========================================
     * 10. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      let errorData = null;

      try {

        errorData =
          JSON.parse(geminiText);

      } catch {

        errorData = null;

      }


      const message =
        errorData?.error?.message ||
        errorData?.message ||
        geminiText ||
        "Erreur inconnue Gemini.";


      console.error(
        "Gemini ERROR :",
        message
      );


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
        JSON.parse(geminiText);

    } catch (error) {

      console.error(
        "Gemini API n'a pas renvoyé du JSON :",
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
     * 12. VERIFICATION CANDIDATE
     * ==========================================
     */

    const candidate =
      geminiData?.candidates?.[0];


    if (!candidate) {

      console.error(
        "Gemini sans candidate :",
        JSON.stringify(geminiData)
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 13. VERIFICATION CONTENT
     * ==========================================
     */

    const parts =
      candidate?.content?.parts;


    if (
      !Array.isArray(parts) ||
      parts.length === 0
    ) {

      console.error(
        "Gemini sans parts :",
        JSON.stringify(candidate)
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de contenu."

      });

    }


    /*
     * ==========================================
     * 14. EXTRACTION TEXTE
     * ==========================================
     */

    const resultText =
      parts
        .map(part => part?.text || "")
        .join("")
        .trim();


    if (!resultText) {

      console.error(
        "Gemini sans texte :",
        JSON.stringify(geminiData)
      );


      return res.status(500).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de texte."

      });

    }


    console.log(
      "DisneyBound JSON reçu :",
      resultText
    );


    /*
     * ==========================================
     * 15. PARSE JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(resultText);

    } catch (error) {

      console.error(
        "JSON DisneyBound invalide :",
        resultText
      );


      /*
       * Petite tentative de récupération
       * si Gemini ajoute accidentellement
       * du texte autour du JSON.
       */

      try {

        const firstBrace =
          resultText.indexOf("{");

        const lastBrace =
          resultText.lastIndexOf("}");


        if (
          firstBrace !== -1 &&
          lastBrace !== -1 &&
          lastBrace > firstBrace
        ) {

          const extracted =
            resultText.slice(
              firstBrace,
              lastBrace + 1
            );


          disneyBound =
            JSON.parse(extracted);

        }

      } catch {

        disneyBound = null;

      }


      if (!disneyBound) {

        return res.status(500).json({

          success: false,

          error:
            "Le résultat Gemini n'est pas un JSON DisneyBound valide."

        });

      }

    }


    /*
     * ==========================================
     * 16. VERIFICATION OBJET
     * ==========================================
     */

    if (
      typeof disneyBound !== "object" ||
      disneyBound === null ||
      Array.isArray(disneyBound)
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Le résultat DisneyBound est invalide."

      });

    }


    /*
     * ==========================================
     * 17. CHAMPS OBLIGATOIRES
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
        typeof disneyBound[field] !== "string" ||
        !disneyBound[field].trim()
      ) {

        return res.status(500).json({

          success: false,

          error:
            `Le champ "${field}" est manquant.`

        });

      }

    }


    /*
     * ==========================================
     * 18. ACCESSOIRES
     * ==========================================
     */

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


    /*
     * ==========================================
     * 19. COULEURS
     * ==========================================
     */

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


    /*
     * ==========================================
     * 20. RECHERCHES
     * ==========================================
     */

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !== "object" ||
      Array.isArray(disneyBound.recherches)
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Les recherches produits sont invalides."

      });

    }


    /*
     * ==========================================
     * 21. NORMALISATION DES RECHERCHES
     * ==========================================
     */

    const rechercheFields = [

      "haut",
      "bas",
      "veste",
      "chaussures",
      "accessoires"

    ];


    for (
      const field of rechercheFields
    ) {

      if (
        typeof disneyBound.recherches[field] !== "string"
      ) {

        disneyBound.recherches[field] = "";

      }

    }


    /*
     * ==========================================
     * 22. REPONSE FINALE
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
     * 23. ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "ERREUR API DISNEYBOUND :",
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
````
