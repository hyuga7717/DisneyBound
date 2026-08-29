export default async function handler(req, res) {

  /*
   * ==========================================
   * 1. VERIFICATION DE LA METHODE
   * ==========================================
   */

  if (req.method !== "POST") {

    return res.status(405).json({
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

    if (
      !characterType ||
      !height ||
      !weight ||
      !image ||
      !mimeType
    ) {

      return res.status(400).json({
        error: "Photo ou informations manquantes."
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
        "gemini_api_key absente."
      );

      return res.status(500).json({
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

Tu es l'IA de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et portable au quotidien à partir de la photo fournie.

Analyse uniquement :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- coupes générales
- style casual, streetwear, chic, sportif
- harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais :

- son identité
- son âge
- son origine
- sa profession
- son état de santé
- toute autre information personnelle.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour choisir des
coupes et proportions adaptées.

Ne donne aucune analyse ou appréciation du corps.

TYPE DE PERSONNAGE :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney correspondant :

- au style observé
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien.

Évite de choisir systématiquement le même personnage.

PRINCIPE DISNEYBOUND :

Inspire-toi du personnage sans reproduire son costume.

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte
- oreilles de personnage
- imprimés représentant le personnage
- accessoires de cosplay
- vêtements trop extravagants.

PRIVILÉGIE :

- couleurs
- palette
- matières
- silhouettes
- détails subtils
- accessoires discrets
- vêtements disponibles dans des boutiques classiques.

COHERENCE :

Conserve une partie importante du style observé.

Si le style est casual, reste casual.

Si le style est streetwear, reste majoritairement streetwear.

Si le style est chic, reste chic.

CHAUSSURES :

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement s'ils sont cohérents
avec le style observé.

RECHERCHES PRODUITS :

Pour chaque pièce, crée également une recherche permettant
de trouver un véritable produit de mode dans une boutique en ligne.

La description et la recherche sont deux éléments différents.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"

RÈGLES DES RECHERCHES :

- maximum 8 mots
- mots-clés uniquement
- pas de phrase complète
- pas de guillemets
- ne jamais utiliser le nom du personnage
- ne jamais répéter deux fois la recherche
- ne jamais coller la description et la recherche
- une seule recherche par champ.

ACCESSOIRES :

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

COULEURS :

Indique entre 3 et 5 couleurs principales.

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
     * 6. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
      encodeURIComponent(apiKey);


    /*
     * ==========================================
     * 7. APPEL GEMINI
     * ==========================================
     */

    const geminiResponse =
      await fetch(url, {

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

            temperature: 0.8

          }

        })

      });


    /*
     * ==========================================
     * 8. RECUPERATION REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();


    console.log(
      "Gemini status:",
      geminiResponse.status
    );


    console.log(
      "Gemini response:",
      geminiText
    );


    /*
     * ==========================================
     * 9. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      let geminiError;

      try {

        geminiError =
          JSON.parse(geminiText);

      } catch {

        geminiError = null;

      }


      return res.status(500).json({

        error:
          geminiError?.error?.message ||
          "Erreur Gemini : " +
          geminiResponse.status

      });

    }


    /*
     * ==========================================
     * 10. PARSE REPONSE GEMINI
     * ==========================================
     */

    let geminiData;

    try {

      geminiData =
        JSON.parse(geminiText);

    } catch (error) {

      console.error(
        "Gemini n'a pas renvoyé du JSON API valide :",
        geminiText
      );

      return res.status(500).json({

        error:
          "Réponse invalide reçue de Gemini."

      });

    }


    /*
     * ==========================================
     * 11. EXTRACTION DU TEXTE
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if (!resultText) {

      console.error(
        "Réponse Gemini sans texte :",
        geminiData
      );

      return res.status(500).json({

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 12. PARSE JSON DISNEYBOUND
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

      return res.status(500).json({

        error:
          "Gemini a répondu, mais son résultat n'est pas un JSON valide."

      });

    }


    /*
     * ==========================================
     * 13. VERIFICATION STRUCTURE
     * ==========================================
     */

    if (
      !disneyBound.personnage ||
      !disneyBound.haut ||
      !disneyBound.bas ||
      !disneyBound.veste ||
      !disneyBound.chaussures ||
      !Array.isArray(disneyBound.accessoires) ||
      !Array.isArray(disneyBound.couleurs) ||
      !disneyBound.recherches
    ) {

      console.error(
        "Structure DisneyBound incorrecte :",
        disneyBound
      );

      return res.status(500).json({

        error:
          "Gemini a renvoyé un format DisneyBound incomplet."

      });

    }


    /*
     * ==========================================
     * 14. REPONSE AU SITE
     * ==========================================
     */

    return res.status(200).json({

      success: true,

      result: disneyBound

    });


  } catch (error) {

    /*
     * ==========================================
     * ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "Erreur serveur DisneyBound :",
      error
    );


    return res.status(500).json({

      error:
        error?.message ||
        "Erreur interne du serveur."

    });

  }

}