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

```
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

const apiKey = process.env.gemini_api_key;

if (!apiKey) {
  console.error("gemini_api_key absente.");

  return res.status(500).json({
    success: false,
    error: "La clé Gemini n'est pas configurée dans Vercel."
  });
}

/*
 * ==========================================
 * 5. MODELE
 * ==========================================
 */

const model = "gemini-3.5-flash-lite";

/*
 * ==========================================
 * 6. PROMPT
 * ==========================================
 */

const prompt = `
```

Tu es l'IA officielle de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante, réaliste et portable au quotidien à partir
de la photo fournie.

Analyse uniquement les éléments visuels utiles à la
création d'une tenue :

* style vestimentaire général
* couleurs visibles
* vêtements portés
* coupes générales
* matières apparentes
* style casual
* style streetwear
* style chic
* style sportif
* harmonie générale
* accessoires visibles

Ne cherche jamais à identifier la personne.

Ne déduis jamais :

* identité
* âge
* origine
* ethnie
* profession
* état de santé
* personnalité
* situation sociale
* information personnelle sensible

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour déterminer
des proportions générales de vêtements et proposer
des coupes adaptées.

Ne donne aucune analyse ou appréciation du corps.

==========================================
TAILLES FOURNIES PAR L'UTILISATEUR
==================================

Taille du haut :
${topSize}

Taille du bas :
${bottomSize}

IMPORTANT :

Les tailles doivent être respectées exactement comme
fournies par l'utilisateur.

Une taille peut être :

XS
S
M
L
XL
XXL
3XL
4XL
34
36
38
40
42
44
46
48
50
52
54
56

NE TRANSFORME JAMAIS une taille en plage.

Si l'utilisateur choisit :

M

utilise exactement M.

Si l'utilisateur choisit :

40

utilise exactement 40.

N'écris jamais :

M / 38-40

N'écris jamais :

38-40

N'écris jamais :

M/40

N'écris jamais une équivalence entre plusieurs tailles.

La taille fournie par l'utilisateur est prioritaire.

==========================================
PRÉFÉRENCES DE COUPE
====================

Coupe souhaitée pour le haut :
${topStyle || "libre"}

Coupe souhaitée pour le bas :
${bottomStyle || "libre"}

Coupe souhaitée pour la veste :
${jacketStyle || "libre"}

IMPORTANT :

Les préférences de coupe doivent réellement être prises
en compte.

Si une coupe précise est choisie, respecte cette coupe
dans la tenue ET dans la recherche produit.

Exemples :

"évasé" = proposer réellement une pièce évasée.

"large" = proposer réellement une coupe large.

"oversize" = proposer réellement une coupe oversize.

"streetwear" = proposer réellement une pièce streetwear.

"sexy" = proposer une pièce élégante et séduisante sans
devenir un costume ou un cosplay.

"chic" = proposer une pièce élégante et raffinée.

"ajusté" = proposer une pièce près du corps.

"fluide" = proposer une pièce avec une coupe fluide.

"court" = proposer une pièce courte.

"long" = proposer une pièce longue.

Si "libre" est sélectionné, choisis toi-même la coupe
la plus cohérente avec la photo et le personnage.

==========================================
TYPE DE PERSONNAGE
==================

${
characterType === "villain"
? "Choisis un MÉCHANT Disney."
: "Choisis un PERSONNAGE DISNEY GENTIL."
}

Choisis UN personnage Disney correspondant :

* au style observé
* aux couleurs observées
* au type demandé
* aux préférences de coupe
* à une tenue portable au quotidien

Évite de choisir systématiquement le même personnage.

==========================================
PRINCIPE DISNEYBOUND
====================

Inspire-toi du personnage sans reproduire son costume.

La tenue doit être portable dans la vie quotidienne.

==========================================
INTERDIT
========

* cosplay
* déguisement
* costume
* reproduction exacte
* oreilles de personnage
* imprimés représentant le personnage
* logos du personnage
* accessoires cosplay
* vêtements extravagants
* tenue de convention

==========================================
PRIVILÉGIER
===========

* vêtements classiques
* couleurs inspirées du personnage
* palette cohérente
* matières
* silhouettes modernes
* détails subtils
* accessoires discrets
* vêtements trouvables en boutique classique

==========================================
COHÉRENCE STYLE
===============

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
==========

Privilégie :

* baskets
* sneakers
* bottines
* mocassins
* chaussures plates
* chaussures casual

Les talons sont autorisés uniquement s'ils sont cohérents
avec le style observé.

==========================================
TENUE
=====

Propose :

* 1 haut
* 1 bas
* 1 veste ou couche extérieure
* 1 paire de chaussures
* 2 à 4 accessoires

==========================================
RECHERCHES PRODUITS
===================

Pour chaque pièce, crée une recherche permettant
de trouver un véritable produit de mode en ligne.

La description et la recherche doivent être différentes.

Les recherches doivent prendre en compte :

* la pièce
* la couleur
* la coupe
* le style
* la taille lorsqu'elle est utile

IMPORTANT :

La taille doit être exactement celle fournie par
l'utilisateur.

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
RÈGLES RECHERCHES
=================

* maximum 8 mots
* mots-clés uniquement
* aucune phrase
* aucun guillemet
* aucun nom de personnage
* aucune marque obligatoire
* aucune répétition
* une seule recherche par champ

Les recherches doivent être suffisamment précises
pour permettre de trouver de vrais vêtements.

==========================================
ACCESSOIRES
===========

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être court.

==========================================
COULEURS
========

Indique entre 3 et 5 couleurs principales.

==========================================
JSON
====

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

```
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

console.log("DisneyBound → Gemini :", model);

console.log("Tailles :", {
  topSize,
  bottomSize
});

console.log("Coupes :", {
  topStyle,
  bottomStyle,
  jacketStyle
});

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

/*
 * ==========================================
 * 9. REPONSE GEMINI
 * ==========================================
 */

const geminiText = await geminiResponse.text();

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

  return res.status(500).json({
    success: false,
    error: "Erreur Gemini : " + message
  });
}

/*
 * ==========================================
 * 11. JSON API GEMINI
 * ==========================================
 */

let geminiData;

try {
  geminiData = JSON.parse(geminiText);
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
 * 12. TEXTE RESULTAT
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
 * 13. JSON DISNEYBOUND
 * ==========================================
 */

let disneyBound;

try {
  disneyBound = JSON.parse(resultText);
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
 * 14. VALIDATION OBJET
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
 * 15. CHAMPS OBLIGATOIRES
 * ==========================================
 */

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
    return res.status(500).json({
      success: false,
      error:
        `Le champ "${field}" est manquant.`
    });
  }
}

/*
 * ==========================================
 * 16. ACCESSOIRES
 * ==========================================
 */

if (!Array.isArray(disneyBound.accessoires)) {
  return res.status(500).json({
    success: false,
    error:
      "Les accessoires sont invalides."
  });
}

/*
 * ==========================================
 * 17. COULEURS
 * ==========================================
 */

if (!Array.isArray(disneyBound.couleurs)) {
  return res.status(500).json({
    success: false,
    error:
      "Les couleurs sont invalides."
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
 * 19. NORMALISATION RECHERCHES
 * ==========================================
 */

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
}

/*
 * ==========================================
 * 20. VERIFICATION DES TAILLES
 * ==========================================
 */

const topSearch =
  disneyBound.recherches.haut.trim();

const bottomSearch =
  disneyBound.recherches.bas.trim();

const forbiddenPatterns = [
  /\b\d+\s*-\s*\d+\b/i,
  /\b(xs|s|m|l|xl|xxl|3xl|4xl)\s*\/\s*\d+\b/i,
  /\b\d+\s*\/\s*(xs|s|m|l|xl|xxl|3xl|4xl)\b/i
];

const hasForbiddenTopSize =
  forbiddenPatterns.some(
    pattern => pattern.test(topSearch)
  );

const hasForbiddenBottomSize =
  forbiddenPatterns.some(
    pattern => pattern.test(bottomSearch)
  );

if (
  hasForbiddenTopSize ||
  hasForbiddenBottomSize
) {
  console.warn(
    "Gemini a utilisé une plage ou une équivalence de taille.",
    {
      topSearch,
      bottomSearch
    }
  );
}

/*
 * ==========================================
 * 21. REPONSE
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
```

} catch (error) {
/*
* ==========================================
* 22. ERREUR GENERALE
* ==========================================
*/

```
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
```

}
}
