````javascript
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

    if (!characterType) {
      return res.status(400).json({
        error: "Choisis Gentil ou Méchant."
      });
    }

    if (!height || !weight) {
      return res.status(400).json({
        error: "La taille et le poids sont obligatoires."
      });
    }

    if (!image) {
      return res.status(400).json({
        error: "La photo est obligatoire."
      });
    }

    if (!mimeType) {
      return res.status(400).json({
        error: "Le format de la photo est manquant."
      });
    }


    /*
     * ==========================================
     * 4. VERIFICATION FORMAT IMAGE
     * ==========================================
     */

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        error: "Format d'image non pris en charge."
      });
    }


    /*
     * ==========================================
     * 5. CLE GEMINI
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key;

    if (!apiKey) {

      console.error(
        "gemini_api_key absente dans Vercel."
      );

      return res.status(500).json({
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });
    }


    /*
     * ==========================================
     * 6. TYPE DE PERSONNAGE
     * ==========================================
     */

    const characterInstruction =
      characterType === "villain"
        ? "Méchant Disney"
        : "Personnage Disney gentil";


    /*
     * ==========================================
     * 7. PROMPT GEMINI
     * ==========================================
     */

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

Utilise ces informations uniquement pour choisir
des coupes et proportions adaptées aux vêtements.

Ne donne aucune analyse du corps.

==================================================
PERSONNAGE
==================================================

Type demandé :

${characterInstruction}

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

DisneyBound signifie s'inspirer d'un personnage
sans reproduire son costume.

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte du costume
- oreilles de personnage
- imprimés représentant le personnage
- accessoires de cosplay
- vêtements trop extravagants

PRIVILÉGIE :

- couleurs du personnage
- palette de couleurs
- matières
- silhouettes
- détails subtils
- accessoires discrets
- vêtements trouvables dans des boutiques classiques

==================================================
COHERENCE AVEC LA PHOTO
==================================================

La tenue doit conserver une partie importante
du style observé sur la photo.

Si la photo montre un style casual,
reste casual.

Si la photo montre du streetwear,
reste majoritairement streetwear.

Si la photo montre un style chic,
reste chic.

Ne change pas complètement le style
uniquement pour correspondre au personnage.

==================================================
CHAUSSURES
==================================================

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement lorsqu'ils
sont cohérents avec le style observé.

==================================================
VETEMENTS
==================================================

Crée :

1. un haut
2. un bas
3. une veste
4. des chaussures
5. entre 2 et 4 accessoires

Les descriptions doivent être courtes,
naturelles et faciles à comprendre.

Exemple :

"Top noir ajusté à fines bretelles"

CORRECT.

Ne mets jamais de recherche produit
dans les descriptions.

==================================================
RECHERCHES PRODUITS
==================================================

Pour chaque élément, crée une recherche destinée
à trouver un véritable produit dans une boutique
de vêtements en ligne.

La recherche doit être différente de la description.

Exemple :

Description :

"Top noir ajusté à fines bretelles"

Recherche :

"top noir fines bretelles femme"

==================================================
REGLES ABSOLUES DES RECHERCHES
==================================================

Chaque recherche :

- contient uniquement des mots-clés
- maximum 8 mots
- ne contient pas de phrase complète
- ne contient pas de guillemets
- ne contient pas le nom du personnage
- ne contient pas deux recherches
- ne répète jamais la description
- ne doit jamais être collée à la description

IMPORTANT :

Une recherche = une seule chaîne de texte.

INTERDIT :

"top noir fines bretelles femme top noir"

CORRECT :

"top noir fines bretelles femme"

==================================================
ACCESSOIRES
==================================================

Propose entre 2 et 4 accessoires maximum.

Les accessoires doivent être courts.

Exemple :

"Collier doré fin"

"Bracelet jonc doré"

"Petit sac noir"

La recherche accessoires doit être une seule
chaîne de mots-clés.

Exemple :

"collier doré fin femme"

==================================================
COULEURS
==================================================

Indique entre 3 et 5 couleurs principales.

Chaque couleur doit être un élément séparé
dans le tableau.

Exemple :

[
  "noir",
  "violet",
  "doré"
]

IMPORTANT :

Ne colle jamais les couleurs.

INTERDIT :

"noirvioletdoré"

CORRECT :

[
  "noir",
  "violet",
  "doré"
]

==================================================
FORMAT DE REPONSE
==================================================

Réponds UNIQUEMENT avec le JSON.

Aucun texte avant le JSON.

Aucun texte après le JSON.

Utilise EXACTEMENT cette structure :

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

==================================================
REGLES JSON
==================================================

Le JSON doit être parfaitement valide.

Utilise uniquement des guillemets doubles.

N'utilise jamais de commentaire.

Ne mets jamais de Markdown.

Ne mets jamais de ```.

Ne mets jamais de texte avant ou après le JSON.
`;


    /*
     * ==========================================
     * 8. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
      encodeURIComponent(apiKey);


    /*
     * ==========================================
     * 9. APPEL GEMINI
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
                  inlineData: {
                    mimeType: mimeType,
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
              0.7

          }

        })

      });


    /*
     * ==========================================
     * 10. REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();


    console.log(
      "Gemini status:",
      geminiResponse.status
    );


    /*
     * ==========================================
     * 11. ERREUR GEMINI
     * ==========================================
     */

    if (!geminiResponse.ok) {

      console.error(
        "Erreur Gemini :",
        geminiText
      );

      let errorMessage =
        "Erreur lors de la communication avec Gemini.";

      try {

        const errorData =
          JSON.parse(geminiText);

        if (
          errorData &&
          errorData.error &&
          errorData.error.message
        ) {

          errorMessage =
            errorData.error.message;

        }

      } catch (error) {

        console.error(
          "Impossible de lire l'erreur Gemini."
        );

      }


      return res.status(
        geminiResponse.status >= 400
          ? geminiResponse.status
          : 500
      ).json({

        error:
          errorMessage

      });

    }


    /*
     * ==========================================
     * 12. PARSE REPONSE API GEMINI
     * ==========================================
     */

    let geminiData;

    try {

      geminiData =
        JSON.parse(geminiText);

    } catch (error) {

      console.error(
        "Réponse API Gemini invalide :",
        geminiText
      );

      return res.status(500).json({

        error:
          "Gemini a renvoyé une réponse invalide."

      });

    }


    /*
     * ==========================================
     * 13. EXTRACTION DU TEXTE
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if (!resultText) {

      console.error(
        "Gemini sans résultat :",
        geminiData
      );

      return res.status(500).json({

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    /*
     * ==========================================
     * 14. NETTOYAGE DU JSON
     * ==========================================
     */

    let cleanResult =
      resultText.trim();


    /*
     * Gemini peut parfois entourer le JSON
     * avec ```json ... ```
     *
     * On retire uniquement ces balises.
     */

    if (
      cleanResult.startsWith("```json")
    ) {

      cleanResult =
        cleanResult
          .replace(/^```json\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

    } else if (
      cleanResult.startsWith("```")
    ) {

      cleanResult =
        cleanResult
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

    }


    /*
     * ==========================================
     * 15. PARSE JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(cleanResult);

    } catch (error) {

      console.error(
        "JSON DisneyBound invalide :",
        cleanResult
      );

      return res.status(500).json({

        error:
          "Gemini a répondu, mais son résultat n'est pas un JSON valide."

      });

    }


    /*
     * ==========================================
     * 16. NORMALISATION
     * ==========================================
     */

    disneyBound.personnage =
      String(
        disneyBound.personnage || ""
      ).trim();

    disneyBound.haut =
      String(
        disneyBound.haut || ""
      ).trim();

    disneyBound.bas =
      String(
        disneyBound.bas || ""
      ).trim();

    disneyBound.veste =
      String(
        disneyBound.veste || ""
      ).trim();

    disneyBound.chaussures =
      String(
        disneyBound.chaussures || ""
      ).trim();


    /*
     * ACCESSOIRES
     */

    if (
      !Array.isArray(
        disneyBound.accessoires
      )
    ) {

      disneyBound.accessoires = [];

    }

    disneyBound.accessoires =
      disneyBound.accessoires
        .filter(Boolean)
        .map(
          item =>
            String(item).trim()
        )
        .slice(0, 4);


    /*
     * COULEURS
     */

    if (
      !Array.isArray(
        disneyBound.couleurs
      )
    ) {

      disneyBound.couleurs = [];

    }

    disneyBound.couleurs =
      disneyBound.couleurs
        .filter(Boolean)
        .map(
          item =>
            String(item).trim()
        )
        .slice(0, 5);


    /*
     * RECHERCHES
     */

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !== "object"
    ) {

      disneyBound.recherches = {};

    }


    const recherches =
      disneyBound.recherches;


    recherches.haut =
      String(
        recherches.haut || ""
      ).trim();

    recherches.bas =
      String(
        recherches.bas || ""
      ).trim();

    recherches.veste =
      String(
        recherches.veste || ""
      ).trim();

    recherches.chaussures =
      String(
        recherches.chaussures || ""
      ).trim();

    recherches.accessoires =
      String(
        recherches.accessoires || ""
      ).trim();


    /*
     * ==========================================
     * 17. VERIFICATION MINIMALE
     * ==========================================
     */

    if (
      !disneyBound.personnage ||
      !disneyBound.haut ||
      !disneyBound.bas ||
      !disneyBound.veste ||
      !disneyBound.chaussures
    ) {

      console.error(
        "Résultat DisneyBound incomplet :",
        disneyBound
      );

      return res.status(500).json({

        error:
          "Gemini a renvoyé un résultat DisneyBound incomplet."

      });

    }


    /*
     * ==========================================
     * 18. REPONSE AU SITE
     * ==========================================
     */

    return res.status(200).json({

      success: true,

      result: disneyBound

    });


  } catch (error) {

    /*
     * ==========================================
     * 19. ERREUR GENERALE
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
````
