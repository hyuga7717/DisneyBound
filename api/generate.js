export default async function handler(req, res) {
  /*
   * ==========================================
   * DISNEYBOUND AI
   * VERCEL + GEMINI
   * ==========================================
   */

  // ==========================================
  // 1. METHOD
  // ==========================================

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée."
    });
  }

  try {
    // ==========================================
    // 2. BODY
    // ==========================================

    const body = req.body || {};

    const {
      characterType,
      height,
      weight,
      topSize,
      bottomSize,
      topStyle,
      bottomStyle,
      jacketStyle,
      image,
      mimeType
    } = body;

    // ==========================================
    // 3. VALIDATION
    // ==========================================

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

    // ==========================================
    // 4. API KEY
    // ==========================================

    const apiKey = process.env.gemini_api_key;

    if (!apiKey) {
      console.error("ERREUR : gemini_api_key absente.");

      return res.status(500).json({
        success: false,
        error: "La clé Gemini n'est pas configurée dans Vercel."
      });
    }

    // ==========================================
    // 5. MODELE
    // ==========================================

    const model = "gemini-3.5-flash";

    // ==========================================
    // 6. PROMPT
    // ==========================================

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

IMPORTANT :

La taille du haut et la taille du bas doivent être
respectées exactement comme fournies.

Si l'utilisateur choisit :

M

utilise exactement :

M

Si l'utilisateur choisit :

40

utilise exactement :

40

N'écris jamais :

M / 38-40

N'écris jamais :

38-40

N'écris jamais :

M/40

N'écris jamais une équivalence entre plusieurs tailles.

La taille fournie par l'utilisateur est prioritaire.

==========================================
PREFERENCES DE COUPE
==========================================

Coupe souhaitée pour le haut :
${topStyle || "libre"}

Coupe souhaitée pour le bas :
${bottomStyle || "libre"}

Coupe souhaitée pour la veste :
${jacketStyle || "libre"}

IMPORTANT :

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

"longue" = proposer une pièce longue.

Si "libre" est sélectionné, choisis toi-même la
coupe la plus cohérente avec la photo et le personnage.

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
- aux préférences de coupe
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
PRIVILEGIER
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

La préférence de coupe de l'utilisateur est prioritaire
pour la pièce concernée.

La coupe choisie doit apparaître clairement dans la
description du vêtement et dans la recherche produit.

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

Pour chaque pièce, crée une recherche permettant
de trouver un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent prendre en compte :

- la pièce
- la couleur
- la coupe
- le style
- la taille lorsqu'elle est utile

IMPORTANT :

La taille doit être exactement celle fournie
par l'utilisateur.

Exemple :

Taille du bas = 40

Recherche acceptable :

jupe longue fluide violette 40

Recherche interdite :

jupe longue M 38-40

Recherche interdite :

jupe longue 38-40

Recherche interdite :

jupe M/40

Même règle pour la taille du haut.

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

Les recherches doivent être suffisamment précises
pour permettre de trouver de vrais vêtements.

==========================================
ACCESSOIRES
==========================================

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

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

    // ==========================================
    // 7. URL GEMINI
    // ==========================================

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(apiKey);

    // ==========================================
    // 8. LOGS
    // ==========================================

    console.log("DisneyBound -> Gemini :", model);

    console.log("Tailles :", {
      topSize,
      bottomSize
    });

    console.log("Coupes :", {
      topStyle,
      bottomStyle,
      jacketStyle
    });

    // ==========================================
    // 9. APPEL GEMINI
    // ==========================================

    const geminiResponse = await fetch(url, {
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
          responseMimeType: "application/json",
          temperature: 0.8
        }
      })
    });

    // ==========================================
    // 10. LECTURE REPONSE GEMINI
    // ==========================================

    const geminiText = await geminiResponse.text();

    console.log(
      "Gemini HTTP :",
      geminiResponse.status
    );

    console.log(
      "Gemini response length :",
      geminiText.length
    );

    // ==========================================
    // 11. ERREUR GEMINI
    // ==========================================

    if (!geminiResponse.ok) {
      let errorData = null;

      try {
        errorData = JSON.parse(geminiText);
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

      return res.status(502).json({
        success: false,
        error: "Erreur Gemini : " + message
      });
    }

    // ==========================================
    // 12. PARSE REPONSE GEMINI
    // ==========================================

    let geminiData;

    try {
      geminiData = JSON.parse(geminiText);
    } catch (error) {
      console.error(
        "Gemini API non JSON :",
        geminiText
      );

      return res.status(502).json({
        success: false,
        error: "Gemini a renvoyé une réponse API invalide."
      });
    }

    // ==========================================
    // 13. RECUPERATION TEXTE
    // ==========================================

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

      return res.status(502).json({
        success: false,
        error: "Gemini n'a pas renvoyé de résultat."
      });
    }

    // ==========================================
    // 14. NETTOYAGE EVENTUEL DU JSON
    // ==========================================

    let cleanResult = resultText.trim();

    // Supprime d'éventuels blocs Markdown
    if (cleanResult.startsWith("```")) {
      cleanResult = cleanResult
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    // ==========================================
    // 15. PARSE JSON DISNEYBOUND
    // ==========================================

    let disneyBound;

    try {
      disneyBound = JSON.parse(cleanResult);
    } catch (error) {
      console.error(
        "JSON DisneyBound invalide :",
        cleanResult
      );

      return res.status(502).json({
        success: false,
        error:
          "Le résultat Gemini n'est pas un JSON DisneyBound valide."
      });
    }

    // ==========================================
    // 16. VALIDATION OBJET
    // ==========================================

    if (
      typeof disneyBound !== "object" ||
      disneyBound === null ||
      Array.isArray(disneyBound)
    ) {
      return res.status(502).json({
        success: false,
        error: "Le résultat DisneyBound est invalide."
      });
    }

    // ==========================================
    // 17. CHAMPS OBLIGATOIRES
    // ==========================================

    const requiredFields = [
      "personnage",
      "haut",
      "bas",
      "veste",
      "chaussures"
    ];

    for (const field of requiredFields) {
      if (
        typeof disneyBound[field] !== "string" ||
        !disneyBound[field].trim()
      ) {
        return res.status(502).json({
          success: false,
          error:
            `Le champ "${field}" est manquant.`
        });
      }
    }

    // ==========================================
    // 18. ACCESSOIRES
    // ==========================================

    if (!Array.isArray(disneyBound.accessoires)) {
      disneyBound.accessoires = [];
    }

    // Maximum 4 accessoires
    disneyBound.accessoires =
      disneyBound.accessoires
        .filter(
          item =>
            typeof item === "string" &&
            item.trim()
        )
        .slice(0, 4);

    // ==========================================
    // 19. COULEURS
    // ==========================================

    if (!Array.isArray(disneyBound.couleurs)) {
      disneyBound.couleurs = [];
    }

    disneyBound.couleurs =
      disneyBound.couleurs
        .filter(
          color =>
            typeof color === "string" &&
            color.trim()
        )
        .slice(0, 5);

    // ==========================================
    // 20. RECHERCHES
    // ==========================================

    if (
      !disneyBound.recherches ||
      typeof disneyBound.recherches !== "object" ||
      Array.isArray(disneyBound.recherches)
    ) {
      disneyBound.recherches = {};
    }

    const searchFields = [
      "haut",
      "bas",
      "veste",
      "chaussures",
      "accessoires"
    ];

    for (const field of searchFields) {
      if (
        typeof disneyBound.recherches[field] !== "string"
      ) {
        disneyBound.recherches[field] = "";
      }

      disneyBound.recherches[field] =
        disneyBound.recherches[field]
          .replace(/["']/g, "")
          .replace(/\s+/g, " ")
          .trim();
    }

    // ==========================================
    // 21. VALIDATION DES TAILLES
    // ==========================================

    const normalizedTopSize =
      String(topSize)
        .toLowerCase()
        .trim();

    const normalizedBottomSize =
      String(bottomSize)
        .toLowerCase()
        .trim();

    const normalizedTopSearch =
      disneyBound.recherches.haut
        .toLowerCase()
        .trim();

    const normalizedBottomSearch =
      disneyBound.recherches.bas
        .toLowerCase()
        .trim();

    // Détecte les plages du type 38-40
    const rangePattern =
      /\b\d{2}\s*[-–]\s*\d{2}\b/;

    // Détecte les équivalences du type M/40
    const mixedSizePattern =
      /\b(?:xs|s|m|l|xl|xxl|3xl|4xl)\s*\/\s*\d{2}\b|\b\d{2}\s*\/\s*(?:xs|s|m|l|xl|xxl|3xl|4xl)\b/i;

    const forbiddenTop =
      rangePattern.test(normalizedTopSearch) ||
      mixedSizePattern.test(normalizedTopSearch);

    const forbiddenBottom =
      rangePattern.test(normalizedBottomSearch) ||
      mixedSizePattern.test(normalizedBottomSearch);

    if (forbiddenTop || forbiddenBottom) {
      console.warn(
        "Gemini a généré une plage de tailles.",
        {
          topSearch:
            disneyBound.recherches.haut,
          bottomSearch:
            disneyBound.recherches.bas
        }
      );

      // On retire les plages de tailles
      disneyBound.recherches.haut =
        disneyBound.recherches.haut
          .replace(/\b\d{2}\s*[-–]\s*\d{2}\b/g, "")
          .replace(/\s+/g, " ")
          .trim();

      disneyBound.recherches.bas =
        disneyBound.recherches.bas
          .replace(/\b\d{2}\s*[-–]\s*\d{2}\b/g, "")
          .replace(/\s+/g, " ")
          .trim();
    }

    // ==========================================
    // 22. GARANTIE TAILLE HAUT
    // ==========================================

    if (
      normalizedTopSize &&
      !normalizedTopSearch.includes(normalizedTopSize)
    ) {
      console.warn(
        "Taille haut absente de la recherche Gemini."
      );

      disneyBound.recherches.haut =
        `${disneyBound.recherches.haut} ${topSize}`
          .replace(/\s+/g, " ")
          .trim();
    }

    // ==========================================
    // 23. GARANTIE TAILLE BAS
    // ==========================================

    if (
      normalizedBottomSize &&
      !normalizedBottomSearch.includes(normalizedBottomSize)
    ) {
      console.warn(
        "Taille bas absente de la recherche Gemini."
      );

      disneyBound.recherches.bas =
        `${disneyBound.recherches.bas} ${bottomSize}`
          .replace(/\s+/g, " ")
          .trim();
    }

    // ==========================================
    // 24. LIMITE 8 MOTS
    // ==========================================

    for (const field of searchFields) {
      const words =
        disneyBound.recherches[field]
          .split(/\s+/)
          .filter(Boolean);

      if (words.length > 8) {
        disneyBound.recherches[field] =
          words.slice(0, 8).join(" ");
      }
    }

    // ==========================================
    // 25. REPONSE FINALE
    // ==========================================

    console.log(
      "DisneyBound réussi :",
      disneyBound.personnage
    );

    return res.status(200).json({
      success: true,
      result: disneyBound
    });

  } catch (error) {
    // ==========================================
    // 26. ERREUR GENERALE
    // ==========================================

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