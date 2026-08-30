export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb"
    }
  }
};

export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * GEMINI 3.5 FLASH-LITE
   * VERSION ROBUSTE
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
     * 2. VERIFICATION BODY
     * ==========================================
     */

    if (!req.body) {

      return res.status(400).json({
        success: false,
        error: "Aucune donnée reçue par le serveur."
      });

    }


    /*
     * ==========================================
     * 3. BODY
     * ==========================================
     */

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;


    const characterType =
      body?.characterType;

    const height =
      body?.height;

    const weight =
      body?.weight;

    const image =
      body?.image;

    const mimeType =
      body?.mimeType;


    /*
     * ==========================================
     * 4. VALIDATION
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
     * 5. VERIFICATION IMAGE
     * ==========================================
     */

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];


    if (!allowedMimeTypes.includes(mimeType)) {

      return res.status(400).json({
        success: false,
        error:
          "Format d'image non supporté. Utilise JPG, PNG ou WEBP."
      });

    }


    /*
     * ==========================================
     * 6. GEMINI API KEY
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key;


    if (!apiKey) {

      console.error(
        "DisneyBound : gemini_api_key absente."
      );


      return res.status(500).json({
        success: false,
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }


    /*
     * ==========================================
     * 7. PROMPT
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

Utilise ces informations uniquement pour déterminer
des proportions générales de vêtements et proposer des
coupes adaptées.

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

Les talons sont autorisés uniquement s'ils sont
cohérents avec le style observé.

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

Pour chaque pièce, crée une recherche permettant de
trouver un véritable produit de mode en ligne.

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
- aucune phrase
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
     * 8. MODELE GEMINI
     * ==========================================
     *
     * IMPORTANT :
     *
     * On conserve Gemini 3.5 Flash-Lite.
     *
     * Modèle stable, rapide et économique.
     *
     */

    const model =
      "gemini-3.5-flash-lite";


    /*
     * ==========================================
     * 9. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(apiKey);


    /*
     * ==========================================
     * 10. LOG
     * ==========================================
     */

    console.log(
      "=========================================="
    );

    console.log(
      "DisneyBound → Gemini"
    );

    console.log(
      "Model :",
      model
    );

    console.log(
      "Character :",
      characterType
    );

    console.log(
      "Height :",
      height
    );

    console.log(
      "Weight :",
      weight
    );

    console.log(
      "Mime type :",
      mimeType
    );

    console.log(
      "Image size :",
      image.length
    );

    console.log(
      "=========================================="
    );


    /*
     * ==========================================
     * 11. APPEL GEMINI
     * ==========================================
     */

    const controller =
      new AbortController();


    const timeout =
      setTimeout(
        () => controller.abort(),
        60000
      );


    let geminiResponse;


    try {

      geminiResponse =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            signal:
              controller.signal,

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
                    "application/json"

                }

              })

          }
        );

    } catch (fetchError) {

      clearTimeout(timeout);


      console.error(
        "=========================================="
      );

      console.error(
        "ERREUR FETCH GEMINI"
      );

      console.error(
        fetchError
      );

      console.error(
        "=========================================="
      );


      return res.status(502).json({

        success: false,

        error:
          fetchError?.name === "AbortError"
            ? "Gemini a mis trop de temps à répondre."
            : "Impossible de contacter l'API Gemini.",

        details:
          fetchError?.message ||
          "Erreur réseau inconnue."

      });

    }


    clearTimeout(timeout);


    /*
     * ==========================================
     * 12. RECUPERATION REPONSE GEMINI
     * ==========================================
     */

    let geminiText;


    try {

      geminiText =
        await geminiResponse.text();

    } catch (readError) {

      console.error(
        "Erreur lecture réponse Gemini :",
        readError
      );


      return res.status(502).json({

        success: false,

        error:
          "Impossible de lire la réponse de Gemini."

      });

    }


    /*
     * ==========================================
     * 13. LOG REPONSE GEMINI
     * ==========================================
     */

    console.log(
      "Gemini HTTP :",
      geminiResponse.status
    );


    console.log(
      "Gemini response length :",
      geminiText.length
    );


    console.log(
      "Gemini response :",
      geminiText
    );


    /*
     * ==========================================
     * 14. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      let errorData = null;


      try {

        errorData =
          JSON.parse(
            geminiText
          );

      } catch {

        errorData = null;

      }


      const geminiMessage =
        errorData?.error?.message ||
        errorData?.message ||
        geminiText ||
        "Erreur inconnue Gemini.";


      console.error(
        "=========================================="
      );

      console.error(
        "GEMINI ERROR"
      );

      console.error(
        geminiResponse.status
      );

      console.error(
        geminiMessage
      );

      console.error(
        "=========================================="
      );


      return res.status(502).json({

        success: false,

        error:
          "Erreur Gemini : " +
          geminiMessage,

        status:
          geminiResponse.status

      });

    }


    /*
     * ==========================================
     * 15. PARSE GEMINI API
     * ==========================================
     */

    let geminiData;


    try {

      geminiData =
        JSON.parse(
          geminiText
        );

    } catch (parseError) {

      console.error(
        "Gemini API non JSON :",
        geminiText
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini a renvoyé une réponse API invalide.",

        details:
          parseError?.message ||
          "JSON invalide."

      });

    }


    /*
     * ==========================================
     * 16. VERIFICATION CANDIDATE
     * ==========================================
     */

    const candidate =
      geminiData?.candidates?.[0];


    if (!candidate) {

      console.error(
        "Gemini sans candidate :",
        JSON.stringify(
          geminiData
        )
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini n'a pas fourni de résultat."

      });

    }


    /*
     * ==========================================
     * 17. VERIFICATION FINISH REASON
     * ==========================================
     */

    if (
      candidate.finishReason &&
      candidate.finishReason !== "STOP"
    ) {

      console.error(
        "Gemini finishReason :",
        candidate.finishReason
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini a interrompu la génération.",

        finishReason:
          candidate.finishReason

      });

    }


    /*
     * ==========================================
     * 18. EXTRACTION TEXTE
     * ==========================================
     */

    const parts =
      candidate?.content?.parts;


    if (!Array.isArray(parts)) {

      console.error(
        "Gemini sans parts :",
        JSON.stringify(
          candidate
        )
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de contenu."

      });

    }


    const resultText =
      parts
        .map(
          part =>
            typeof part?.text === "string"
              ? part.text
              : ""
        )
        .join("")
        .trim();


    if (!resultText) {

      console.error(
        "Gemini sans texte :",
        JSON.stringify(
          geminiData
        )
      );


      return res.status(502).json({

        success: false,

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 19. LOG RESULTAT
     * ==========================================
     */

    console.log(
      "DisneyBound JSON brut :",
      resultText
    );


    /*
     * ==========================================
     * 20. PARSE JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;


    try {

      disneyBound =
        JSON.parse(
          resultText
        );

    } catch (jsonError) {

      console.error(
        "=========================================="
      );

      console.error(
        "JSON DISNEYBOUND INVALIDE"
      );

      console.error(
        resultText
      );

      console.error(
        "=========================================="
      );


      return res.status(502).json({

        success: false,

        error:
          "Le résultat Gemini n'est pas un JSON DisneyBound valide.",

        details:
          jsonError?.message ||
          "JSON invalide."

      });

    }


    /*
     * ==========================================
     * 21. VERIFICATION OBJET
     * ==========================================
     */

    if (
      typeof disneyBound !== "object" ||
      disneyBound === null ||
      Array.isArray(disneyBound)
    ) {

      return res.status(502).json({

        success: false,

        error:
          "Le résultat DisneyBound est invalide."

      });

    }


    /*
     * ==========================================
     * 22. CHAMPS OBLIGATOIRES
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

        return res.status(502).json({

          success: false,

          error:
            `Le champ "${field}" est manquant ou invalide.`

        });

      }

    }


    /*
     * ==========================================
     * 23. ACCESSOIRES
     * ==========================================
     */

    if (
      !Array.isArray(
        disneyBound.accessoires
      )
    ) {

      return res.status(502).json({

        success: false,

        error:
          "Les accessoires sont invalides."

      });

    }


    /*
     * ==========================================
     * 24. COULEURS
     * ==========================================
     */

    if (
      !Array.isArray(
        disneyBound.couleurs
      )
    ) {

      return res.status(502).json({

        success: false,

        error:
          "Les couleurs sont invalides."

      });

    }


    /*
     * ==========================================
     * 25. RECHERCHES
     * ==========================================
     */

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !== "object" ||
      Array.isArray(disneyBound.recherches)
    ) {

      return res.status(502).json({

        success: false,

        error:
          "Les recherches produits sont invalides."

      });

    }


    /*
     * ==========================================
     * 26. NORMALISATION RECHERCHES
     * ==========================================
     */

    const recherches = {

      haut:
        typeof disneyBound.recherches.haut === "string"
          ? disneyBound.recherches.haut
          : "",

      bas:
        typeof disneyBound.recherches.bas === "string"
          ? disneyBound.recherches.bas
          : "",

      veste:
        typeof disneyBound.recherches.veste === "string"
          ? disneyBound.recherches.veste
          : "",

      chaussures:
        typeof disneyBound.recherches.chaussures === "string"
          ? disneyBound.recherches.chaussures
          : "",

      accessoires:
        typeof disneyBound.recherches.accessoires === "string"
          ? disneyBound.recherches.accessoires
          : ""

    };


    /*
     * ==========================================
     * 27. RESULTAT FINAL
     * ==========================================
     */

    const finalResult = {

      personnage:
        disneyBound.personnage.trim(),

      haut:
        disneyBound.haut.trim(),

      bas:
        disneyBound.bas.trim(),

      veste:
        disneyBound.veste.trim(),

      chaussures:
        disneyBound.chaussures.trim(),

      accessoires:
        disneyBound.accessoires
          .filter(
            item =>
              typeof item === "string" &&
              item.trim()
          )
          .slice(0, 4)
          .map(
            item =>
              item.trim()
          ),

      couleurs:
        disneyBound.couleurs
          .filter(
            item =>
              typeof item === "string" &&
              item.trim()
          )
          .slice(0, 5)
          .map(
            item =>
              item.trim()
          ),

      recherches

    };


    /*
     * ==========================================
     * 28. LOG SUCCESS
     * ==========================================
     */

    console.log(
      "=========================================="
    );

    console.log(
      "DISNEYBOUND SUCCESS"
    );

    console.log(
      "Personnage :",
      finalResult.personnage
    );

    console.log(
      "=========================================="
    );


    /*
     * ==========================================
     * 29. REPONSE
     * ==========================================
     */

    return res.status(200).json({

      success: true,

      result:
        finalResult

    });


  } catch (error) {

    /*
     * ==========================================
     * ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "=========================================="
    );

    console.error(
      "ERREUR CRITIQUE API DISNEYBOUND"
    );

    console.error(
      error
    );

    console.error(
      "=========================================="
    );


    /*
     * IMPORTANT :
     *
     * Même une erreur inattendue doit retourner
     * un JSON valide au navigateur.
     */

    try {

      return res.status(500).json({

        success: false,

        error:
          error?.message ||
          "Erreur interne du serveur DisneyBound.",

        type:
          error?.name ||
          "UnknownError"

      });

    } catch (responseError) {

      console.error(
        "Impossible de retourner le JSON d'erreur :",
        responseError
      );

      return res.status(500).end();

    }

  }

}