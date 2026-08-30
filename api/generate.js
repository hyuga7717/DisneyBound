export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * GEMINI 3.5 FLASH-LITE
   * VERSION AVEC TAILLES ET PREFERENCES
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

    const body =
      req.body || {};


    const characterType =
      body.characterType;


    const height =
      body.height;


    const weight =
      body.weight;


    const clothingSize =
      body.clothingSize;


    const bottomSize =
      body.bottomSize;


    const shoeSize =
      body.shoeSize;


    const preferredFit =
      body.preferredFit;


    const shoppingSection =
      body.shoppingSection;


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


    if (!clothingSize) {

      return res.status(400).json({
        success: false,
        error:
          "La taille de haut est manquante."
      });

    }


    if (!bottomSize) {

      return res.status(400).json({
        success: false,
        error:
          "La taille de bas est manquante."
      });

    }


    if (!shoeSize) {

      return res.status(400).json({
        success: false,
        error:
          "La pointure est manquante."
      });

    }


    if (!preferredFit) {

      return res.status(400).json({
        success: false,
        error:
          "La coupe préférée est manquante."
      });

    }


    if (!shoppingSection) {

      return res.status(400).json({
        success: false,
        error:
          "Le rayon shopping est manquant."
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
des proportions générales de vêtements et proposer
des coupes adaptées.

Ne donne aucune analyse ou appréciation du corps.


==========================================
INFORMATIONS SHOPPING
==========================================

Taille de haut :
${clothingSize}

Taille de bas :
${bottomSize}

Pointure :
${shoeSize}

Coupe préférée :
${preferredFit}

Rayon shopping :
${shoppingSection}


IMPORTANT :

Les tailles fournies par l'utilisateur sont des tailles
qu'il porte habituellement.

Utilise-les principalement pour construire des recherches
produits réalistes et adaptées.

Ne critique jamais les tailles.

Ne commente jamais le corps de la personne.

Ne transforme jamais les tailles en jugement physique.


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

Le résultat doit ressembler à une vraie tenue de mode
et non à un déguisement.


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

La coupe préférée de l'utilisateur doit également être
respectée autant que possible :

${preferredFit}


==========================================
RAYON SHOPPING
==========================================

Le résultat doit correspondre au rayon choisi :

${shoppingSection}

Utilise ce choix pour adapter :

- les vêtements
- les coupes
- les recherches produits
- les termes utilisés dans les recherches.


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
avec le style observé et avec la tenue proposée.

La recherche chaussures doit prendre en compte la pointure
${shoeSize} lorsque cela est pertinent.


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
TAILLES DES PRODUITS
==========================================

Lorsque tu crées les recherches produits :

Le haut doit être recherché avec la taille habituelle :

${clothingSize}

Le bas doit être recherché avec la taille habituelle :

${bottomSize}

Les chaussures doivent correspondre à :

${shoeSize}

Cependant, ne mets PAS obligatoirement la taille dans
chaque recherche si cela rend la recherche moins naturelle.

La recherche doit surtout permettre de trouver le bon type
de produit.

Exemple :

Taille haut :
M

Bonne recherche :

"body noir fines bretelles femme"

Mauvaise recherche :

"body noir fines bretelles femme taille M"

La taille peut être utilisée lorsque cela améliore réellement
la recherche.


==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant de trouver
un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Exemple :

haut :

"Body noir ajusté à fines bretelles"

recherches.haut :

"body noir fines bretelles femme"


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
- une seule recherche par champ
- recherche naturelle permettant de trouver un vrai produit
- recherche adaptée au rayon shopping
- recherche adaptée au style observé.


==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

Les accessoires doivent être courts.

Ils doivent rester portables au quotidien.


==========================================
COULEURS
==========================================

Indique entre 3 et 5 couleurs principales.

Les couleurs doivent correspondre à l'inspiration DisneyBound
et à la tenue proposée.


==========================================
QUALITE DU RESULTAT
==========================================

Le résultat doit être cohérent de la tête aux pieds.

Le haut, le bas, la veste, les chaussures et les accessoires
doivent former une véritable tenue.

Évite les associations incohérentes.

Évite les pièces impossibles à porter ensemble.

Le résultat doit pouvoir être acheté dans des boutiques
de mode classiques.


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
      "Gemini response :",
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
     * 16. VERIFICATION RECHERCHES
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
      const field of searchFields
    ) {

      if (
        typeof disneyBound.recherches[field] !== "string" ||
        !disneyBound.recherches[field].trim()
      ) {

        return res.status(500).json({

          success: false,

          error:
            `La recherche "${field}" est manquante.`

        });

      }

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

      success: true,

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

      success: false,

      error:
        error?.message ||
        "Erreur interne du serveur."

    });

  }

}