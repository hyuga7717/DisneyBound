```js
export default async function handler(req, res) {

  // ==================================================
  // 1. VÉRIFIER LA MÉTHODE
  // ==================================================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    // ==================================================
    // 2. RÉCUPÉRER LES DONNÉES DU SITE
    // ==================================================

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};

    // ==================================================
    // 3. VÉRIFICATION DES DONNÉES
    // ==================================================

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

    // ==================================================
    // 4. VÉRIFIER LA CLÉ GEMINI
    // ==================================================

    if (!process.env.gemini_api_key) {
      return res.status(500).json({
        error: "La clé Gemini n'est pas configurée dans Vercel."
      });
    }

    // ==================================================
    // 5. PROMPT GEMINI
    // ==================================================

    const prompt = `

Tu es l'IA de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et portable au quotidien à partir de la photo fournie.

==================================================
1. ANALYSE DE LA PHOTO
==================================================

Analyse uniquement les éléments utiles à la création de la tenue :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- coupes générales
- style casual, streetwear, chic, sportif, etc.
- harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais :
- son identité
- son âge
- son origine
- sa profession
- sa personnalité
- toute autre information personnelle.

==================================================
2. MORPHOLOGIE
==================================================

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations UNIQUEMENT pour choisir des coupes
et proportions adaptées.

Ne donne aucune analyse ou appréciation du corps.

==================================================
3. PERSONNAGE DISNEY
==================================================

Le type demandé est :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney correspondant au mieux :

- au style observé
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien

Évite de choisir systématiquement le même personnage.

Si plusieurs personnages conviennent,
choisis celui qui correspond le mieux au style observé.

==================================================
4. PRINCIPE DISNEYBOUND
==================================================

DisneyBound signifie S'INSPIRER d'un personnage,
et non reproduire son costume.

La tenue doit être moderne et portable dans la vie quotidienne.

INTERDIT :

- cosplay
- déguisement
- costume
- reproduction exacte du costume
- oreilles de personnage
- imprimés représentant le personnage
- accessoires de cosplay
- vêtements extrêmement extravagants

PRIVILÉGIE :

- palette de couleurs du personnage
- matières
- silhouettes
- détails subtils
- accessoires discrets
- vêtements réellement disponibles dans des boutiques classiques

==================================================
5. COHÉRENCE AVEC LA PHOTO
==================================================

La tenue doit conserver une partie importante
du style vestimentaire observé sur la photo.

Si la personne est casual :
reste casual.

Si la personne est streetwear :
reste majoritairement streetwear.

Si la personne est chic :
reste chic.

Si la personne est sportive :
reste majoritairement sportif/casual.

Ne transforme pas complètement le style de la personne
uniquement pour correspondre au personnage.

==================================================
6. CHAUSSURES
==================================================

Privilégie :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement lorsqu'ils sont
cohérents avec le style observé sur la photo.

==================================================
7. DESCRIPTION DES VÊTEMENTS
==================================================

Les champs :

"haut"
"bas"
"veste"
"chaussures"

doivent contenir UNIQUEMENT une description naturelle
du vêtement.

IMPORTANT :

NE JAMAIS mettre dans ces champs :

- une recherche produit
- plusieurs variantes
- deux descriptions
- des mots-clés de recherche
- une deuxième fois le nom du vêtement
- une recherche avec "femme" ou "homme" collée à la description

Exemple CORRECT :

"Body noir à fines bretelles"

Exemple INCORRECT :

"Body noir à fines bretelles femme body noir fines bretelles"

Chaque champ doit contenir UNE SEULE pièce.

==================================================
8. RECHERCHES PRODUITS
==================================================

Les recherches servent UNIQUEMENT à rechercher
un produit réel dans une boutique de vêtements.

Chaque recherche doit :

- être différente de la description
- être courte
- contenir uniquement des mots-clés
- être directement utilisable dans un moteur de recherche
- contenir le type de produit
- contenir la couleur
- contenir une caractéristique importante
- contenir "femme" ou "homme" uniquement lorsque pertinent

Maximum 8 mots par recherche.

IMPORTANT :

NE JAMAIS coller la recherche à la description.

Exemple CORRECT :

"haut": "Body noir à fines bretelles"

"recherches.haut": "body noir fines bretelles femme"

==================================================
9. ACCESSOIRES
==================================================

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être une description courte
et naturelle.

Exemple :

"Collier doré fin"
"Bracelet jonc doré"
"Petite pochette noire"

La recherche des accessoires doit être placée
UNIQUEMENT dans :

"recherches.accessoires"

==================================================
10. COULEURS
==================================================

Indique entre 3 et 5 couleurs principales
utilisées dans la tenue.

==================================================
11. RÈGLE ABSOLUE CONTRE LES DOUBLONS
==================================================

AVANT DE RÉPONDRE, vérifie :

1. Aucun champ ne contient deux fois la même information.
2. Aucun vêtement n'est répété.
3. Les descriptions ne contiennent aucune recherche produit.
4. Les recherches ne contiennent pas de phrase complète.
5. Les recherches ne sont jamais collées à une description.
6. Les recherches font maximum 8 mots.
7. Les recherches ne contiennent jamais le nom du personnage.
8. Chaque champ de vêtement contient UNE seule pièce.
9. Les accessoires contiennent entre 2 et 4 éléments.
10. Le JSON est strictement valide.

==================================================
12. FORMAT DE RÉPONSE
==================================================

Réponds UNIQUEMENT avec un JSON VALIDE.

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
13. CONTRÔLE FINAL
==================================================

Avant de répondre, vérifie mentalement :

- personnage = uniquement le nom du personnage
- haut = uniquement le vêtement
- bas = uniquement le vêtement
- veste = uniquement le vêtement
- chaussures = uniquement les chaussures
- accessoires = uniquement les accessoires
- couleurs = uniquement les couleurs
- recherches.haut = uniquement les mots-clés produit
- recherches.bas = uniquement les mots-clés produit
- recherches.veste = uniquement les mots-clés produit
- recherches.chaussures = uniquement les mots-clés produit
- recherches.accessoires = uniquement les mots-clés produit

Ne mélange jamais les descriptions et les recherches.

`;

    // ==================================================
    // 6. APPEL À GEMINI
    // ==================================================

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
      process.env.gemini_api_key,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
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
            responseMimeType: "application/json"
          }
        })
      }
    );

    // ==================================================
    // 7. RÉCUPÉRER LA RÉPONSE GEMINI
    // ==================================================

    const data = await response.json();

    // ==================================================
    // 8. GESTION DES ERREURS GEMINI
    // ==================================================

    if (!response.ok) {

      console.error(
        "Erreur Gemini :",
        data
      );

      return res.status(500).json({
        error:
          data?.error?.message ||
          "Erreur lors de la communication avec Gemini."
      });
    }

    // ==================================================
    // 9. RÉCUPÉRER LE TEXTE
    // ==================================================

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {

      console.error(
        "Réponse Gemini inattendue :",
        data
      );

      return res.status(500).json({
        error: "Gemini n'a pas renvoyé de résultat."
      });
    }

    // ==================================================
    // 10. CONVERTIR LE JSON GEMINI
    // ==================================================

    let disneyBound;

    try {

      disneyBound =
        JSON.parse(result);

    } catch (error) {

      console.error(
        "JSON Gemini invalide :",
        result
      );

      return res.status(500).json({
        error:
          "Gemini n'a pas renvoyé un JSON valide."
      });
    }

    // ==================================================
    // 11. VÉRIFICATION DU FORMAT
    // ==================================================

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
          "La réponse de Gemini ne respecte pas le format demandé."
      });
    }

    // ==================================================
    // 12. RETOUR AU SITE
    // ==================================================

    return res.status(200).json({
      success: true,
      result: disneyBound
    });

  } catch (error) {

    // ==================================================
    // 13. ERREUR SERVEUR
    // ==================================================

    console.error(
      "Erreur serveur :",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Erreur serveur."
    });
  }
}
```
