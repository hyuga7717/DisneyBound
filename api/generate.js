export default async function handler(req, res) {

  /*
   * ==========================================
   * DISNEYBOUND AI
   * GEMINI
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
    const topSize = body.topSize;
    const bottomSize = body.bottomSize;
    const topStyle = body.topStyle;
    const bottomStyle = body.bottomStyle;
    const jacketStyle = body.jacketStyle;
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

    if (
      characterType !== "hero" &&
      characterType !== "villain"
    ) {
      return res.status(400).json({
        success: false,
        error: "Le type de personnage est invalide."
      });
    }

    if (!height || !weight) {
      return res.status(400).json({
        success: false,
        error: "La taille ou le poids est manquant."
      });
    }

    if (!topSize) {
      return res.status(400).json({
        success: false,
        error: "La taille du haut est manquante."
      });
    }

    if (!bottomSize) {
      return res.status(400).json({
        success: false,
        error: "La taille du bas est manquante."
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
     * 4. API KEY
     * ==========================================
     */

    const apiKey =
      process.env.gemini_api_key ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {

      console.error(
        "Clé Gemini absente."
      );

      return res.status(500).json({
        success: false,
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }

    /*
     * ==========================================
     * 5. MODELE
     * ==========================================
     *
     * IMPORTANT :
     * On garde ici le modèle configuré dans ton projet.
     */

    const model =
      process.env.GEMINI_MODEL ||
      "gemini-3.5-flash-lite";

    /*
     * ==========================================
     * 6. TYPE PERSONNAGE
     * ==========================================
     */

    const characterInstruction =
      characterType === "villain"
        ? "Choisis obligatoirement un MÉCHANT Disney."
        : "Choisis obligatoirement un PERSONNAGE DISNEY GENTIL.";

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
des proportions générales de vêtements et proposer
des coupes adaptées.

Ne donne aucune analyse ou appréciation du corps.


==========================================
TAILLES FOURNIES PAR L'UTILISATEUR
==========================================

Taille du haut :
${topSize}

Taille du bas :
${bottomSize}


==========================================
RÈGLE ABSOLUE SUR LES TAILLES
==========================================

Les tailles fournies par l'utilisateur sont PRIORITAIRES.

La taille du haut doit rester exactement :

${topSize}

La taille du bas doit rester exactement :

${bottomSize}

NE MODIFIE JAMAIS ces tailles.

NE LES TRANSFORME JAMAIS en plage.

NE CRÉE JAMAIS d'équivalence.

Exemples interdits :

M / 38-40
38-40
M/40
M ou L
38 ou 40
38-42

Si la taille est M, écris M.

Si la taille est 40, écris 40.

Si la taille est XL, écris XL.

La recherche produit doit utiliser exactement
la taille fournie lorsque cela est pertinent.


==========================================
PRÉFÉRENCES DE COUPE
==========================================

Coupe souhaitée pour le haut :
${topStyle || "libre"}

Coupe souhaitée pour le bas :
${bottomStyle || "libre"}

Coupe souhaitée pour la veste :
${jacketStyle || "libre"}


Les préférences de coupe doivent réellement être
prises en compte.

Si une coupe précise est choisie, respecte cette
coupe dans la tenue ET dans la recherche produit.

Exemples :

"évasé" = proposer réellement une pièce évasée.

"large" = proposer réellement une coupe large.

"oversize" = proposer réellement une coupe oversize.

"streetwear" = proposer réellement une pièce
correspondant à un style streetwear.

"sexy" = proposer une pièce élégante et séduisante
sans devenir un costume ou un cosplay.

"chic" = proposer une pièce élégante et raffinée.

"ajusté" = proposer une pièce près du corps.

"fluide" = proposer une pièce avec une matière
et une coupe fluides.

"court" = proposer une pièce courte.

"long" = proposer une pièce longue.

Si "libre" est sélectionné, choisis toi-même la
coupe la plus cohérente avec la photo et le personnage.


==========================================
TYPE DE PERSONNAGE
==========================================

${characterInstruction}

Choisis UN personnage Disney correspondant :

- au style observé
- aux couleurs observées
- au type demandé
- aux préférences de coupe
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
COHÉRENCE STYLE
==========================================

Conserve une partie importante du style observé.

Casual = casual.

Streetwear = majoritairement streetwear.

Chic = chic.

Sportif = sportif et moderne.

La préférence de coupe de l'utilisateur est prioritaire
pour la pièce concernée.


==========================================
COULEURS
==========================================

IMPORTANT :

Il n'y aura PLUS de section séparée "palette de couleurs".

Les couleurs doivent être intégrées directement dans
la description de CHAQUE pièce.

Exemple :

"Caraco noir ajusté à fines bretelles..."

"Jupe midi rouge fluide..."

"Blazer noir structuré..."

"Ballerines jaune moutarde..."

Les descriptions doivent donc indiquer clairement
les couleurs choisies.

Ne crée pas de champ "couleurs" dans le JSON.


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

Chaque description doit être suffisamment précise
pour comprendre la couleur, la coupe et le style.


==========================================
RECHERCHES PRODUITS
==========================================

Pour chaque pièce, crée une recherche permettant
de trouver un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent prendre en compte :

- la pièce
- la couleur
- la coupe
- le style
- la taille lorsqu'elle est utile


==========================================
RÈGLES RECHERCHES
==========================================

Maximum 8 mots.

Mots-clés uniquement.

Aucune phrase.

Aucun guillemet.

Aucun nom de personnage.

Aucune marque obligatoire.

Aucune répétition inutile.

Une seule recherche par champ.


==========================================
RÈGLE DE TAILLE DANS LES RECHERCHES
==========================================

Pour le haut :

utilise exactement :
${topSize}

Pour le bas :

utilise exactement :
${bottomSize}

Ne remplace jamais une taille par une autre.

Ne transforme jamais une taille en plage.

Ne mets jamais plusieurs tailles.

Exemple si haut = M :

caraco noir ajuste fines bretelles M

Correct.

Exemples interdits :

caraco noir M/L

caraco noir 38-40

caraco noir M/40


Exemple si bas = 40 :

jupe midi rouge fluide 40

Correct.

Exemples interdits :

jupe midi rouge 38-40

jupe midi rouge M/40

jupe midi rouge 40-42


==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

Les accessoires doivent également comporter
leur couleur lorsque cela est utile.


==========================================
FORMAT JSON
==========================================

Réponds UNIQUEMENT avec le JSON.

Aucun texte avant.

Aucun texte après.

Structure EXACTE :

{
  "personnage": "",
  "haut": "",
  "bas": "",
  "veste": "",
  "chaussures": "",
  "accessoires": [],
  "recherches": {
    "haut": "",
    "bas": "",
    "veste": "",
    "chaussures": "",
    "accessoires": ""
  }
}

IMPORTANT :

Il ne doit PAS y avoir de champ "couleurs".

Les couleurs doivent être intégrées dans les
descriptions des vêtements et accessoires.
`;

    /*
     * ==========================================
     * 8. URL GEMINI
     * ==========================================
     */

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(apiKey);

    /*
     * ==========================================
     * 9. LOG
     * ==========================================
     */

    console.log(
      "DisneyBound → Gemini :",
      model
    );

    console.log(
      "Type :",
      characterType
    );

    console.log(
      "Tailles :",
      {
        topSize,
        bottomSize
      }
    );

    console.log(
      "Coupes :",
      {
        topStyle,
        bottomStyle,
        jacketStyle
      }
    );

    /*
     * ==========================================
     * 10. APPEL GEMINI
     * ==========================================
     */

    const geminiResponse =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
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
                        mime_type: mimeType,
                        data: image
                      }
                    }

                  ]
                }
              ],

              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7
              }

            })
        }
      );

    /*
     * ==========================================
     * 11. REPONSE GEMINI
     * ==========================================
     */

    const geminiText =
      await geminiResponse.text();

    console.log(
      "Gemini HTTP :",
      geminiResponse.status
    );

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
        "Erreur Gemini :",
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
     * 12. JSON API GEMINI
     * ==========================================
     */

    let geminiData;

    try {

      geminiData =
        JSON.parse(geminiText);

    } catch {

      console.error(
        "Gemini API non JSON :",
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
     * 13. TEXTE RESULTAT
     * ==========================================
     */

    const resultText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts
        ?.find(
          part =>
            typeof part?.text === "string"
        )
        ?.text;

    if (!resultText) {

      console.error(
        "Gemini sans texte :",
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
     * 14. JSON DISNEYBOUND
     * ==========================================
     */

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(resultText);

    } catch {

      console.error(
        "JSON DisneyBound invalide :",
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
     * 15. VALIDATION OBJET
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
     * 16. CHAMPS OBLIGATOIRES
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
     * 17. ACCESSOIRES
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
     * 18. RECHERCHES
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
     * 19. NORMALISATION
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
        typeof disneyBound.recherches[field] !==
        "string"
      ) {

        disneyBound.recherches[field] = "";

      }

    }

    /*
     * ==========================================
     * 20. SECURITE TAILLES
     * ==========================================
     *
     * On refuse les recherches qui contiennent
     * des plages ou plusieurs tailles.
     */

    const topSearch =
      disneyBound.recherches.haut
        .toLowerCase()
        .trim();

    const bottomSearch =
      disneyBound.recherches.bas
        .toLowerCase()
        .trim();

    const topSizeNormalized =
      String(topSize)
        .toLowerCase()
        .trim();

    const bottomSizeNormalized =
      String(bottomSize)
        .toLowerCase()
        .trim();

    const forbiddenPatterns = [

      /\b\d+\s*-\s*\d+\b/,

      /\b(xs|s|m|l|xl|xxl|3xl|4xl)\s*\/\s*(xs|s|m|l|xl|xxl|3xl|4xl)\b/i,

      /\b(xs|s|m|l|xl|xxl|3xl|4xl)\s+(ou|ou bien)\s+(xs|s|m|l|xl|xxl|3xl|4xl)\b/i,

      /\b\d+\s*\/\s*\d+\b/

    ];

    const topHasForbidden =
      forbiddenPatterns.some(
        pattern =>
          pattern.test(topSearch)
      );

    const bottomHasForbidden =
      forbiddenPatterns.some(
        pattern =>
          pattern.test(bottomSearch)
      );

    if (
      topHasForbidden ||
      bottomHasForbidden
    ) {

      console.error(
        "Recherche produit contenant une plage de tailles.",
        {
          topSearch,
          bottomSearch
        }
      );

      return res.status(500).json({
        success: false,
        error:
          "L'IA a généré une recherche avec une plage de tailles. Veuillez réessayer."
      });

    }

    /*
     * ==========================================
     * 21. VERIFICATION TAILLES FOURNIES
     * ==========================================
     */

    if (
      topSearch &&
      !topSearch.includes(topSizeNormalized)
    ) {

      console.warn(
        "La taille du haut n'apparaît pas dans la recherche.",
        {
          topSize,
          topSearch
        }
      );

      disneyBound.recherches.haut =
        `${topSearch} ${topSize}`.trim();

    }

    if (
      bottomSearch &&
      !bottomSearch.includes(bottomSizeNormalized)
    ) {

      console.warn(
        "La taille du bas n'apparaît pas dans la recherche.",
        {
          bottomSize,
          bottomSearch
        }
      );

      disneyBound.recherches.bas =
        `${bottomSearch} ${bottomSize}`.trim();

    }

    /*
     * ==========================================
     * 22. SUPPRESSION PALETTE
     * ==========================================
     *
     * Même si Gemini ajoute accidentellement
     * un champ couleurs, il ne sera jamais renvoyé.
     */

    delete disneyBound.couleurs;

    /*
     * ==========================================
     * 23. REPONSE
     * ==========================================
     */

    console.log(
      "DisneyBound réussi :",
      disneyBound.personnage
    );

    return res.status(200).json({
      success: true,
      result: disneyBound
    });

  } catch (error) {

    /*
     * ==========================================
     * 24. ERREUR GENERALE
     * ==========================================
     */

    console.error(
      "Erreur API DisneyBound :",
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