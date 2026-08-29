export default async function handler(req, res) {

  // =========================
  // VÉRIFIER LA MÉTHODE
  // =========================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }


  try {

    // =========================
    // RÉCUPÉRER LES DONNÉES
    // =========================

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};


    // =========================
    // VALIDATION
    // =========================

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


    // =========================
    // CLÉ GEMINI
    // =========================

    if (!process.env.gemini_api_key) {

      return res.status(500).json({
        error:
          "La clé Gemini n'est pas configurée dans Vercel."
      });

    }


    // =========================
    // PROMPT
    // =========================

    const prompt = `

Tu es l'IA de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et portable au quotidien à partir de la photo fournie.

==================================================
1. ANALYSE DE LA PHOTO
==================================================

Analyse uniquement :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- coupes générales
- style casual, streetwear, chic, sportif, etc.
- harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais son identité, son âge, son origine,
sa profession ou toute autre information personnelle.

==================================================
2. MORPHOLOGIE
==================================================

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour choisir des
coupes et proportions adaptées.

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

Choisis UN personnage Disney qui correspond :

- au style observé
- aux couleurs observées
- au type demandé
- à une tenue portable au quotidien

Évite de choisir systématiquement le même personnage.

Si plusieurs personnages conviennent, choisis celui
qui correspond le mieux au style de la photo.

==================================================
4. PRINCIPE DISNEYBOUND
==================================================

DisneyBound signifie S'INSPIRER d'un personnage,
pas reproduire son costume.

La tenue doit être moderne et portable.

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
- vêtements disponibles dans des boutiques classiques

==================================================
5. COHÉRENCE AVEC LA PHOTO
==================================================

La tenue proposée doit conserver une partie importante
du style observé sur la photo.

Ne change pas complètement le style de la personne
uniquement pour correspondre au personnage.

Si la personne porte un style casual, reste casual.

Si la personne porte un style streetwear, reste
majoritairement streetwear.

Si la personne porte un style chic, reste chic.

==================================================
6. CHAUSSURES
==================================================

Privilégie les chaussures réellement portables :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement lorsqu'ils sont
cohérents avec le style observé.

==================================================
7. RECHERCHES VÊTEMENTS
==================================================

Pour chaque pièce, crée également une requête de recherche
destinée à trouver un véritable vêtement ou accessoire
dans une boutique en ligne.

IMPORTANT :

La description de la tenue et la recherche sont DEUX
éléments différents.

La description doit expliquer ce que la personne doit porter.

La recherche doit uniquement contenir les mots-clés
nécessaires pour trouver le produit.

Exemple :

haut :
"Body noir à fines bretelles"

recherches.haut :
"body noir fines bretelles femme"

INTERDICTIONS :

- ne jamais répéter deux fois la même recherche
- ne jamais coller la description et la recherche ensemble
- ne jamais écrire deux recherches dans le même champ
- ne jamais ajouter la recherche à la fin de la description
- ne jamais utiliser de phrase complète dans une recherche
- ne jamais mettre de guillemets dans les recherches

Les recherches doivent être courtes et directement
utilisables dans un moteur de recherche de vêtements.

==================================================
8. FORMAT DE RÉPONSE
==================================================

Réponds UNIQUEMENT avec le JSON demandé.

Aucun texte avant le JSON.

Aucun texte après le JSON.

==================================================
9. DESCRIPTION DES VÊTEMENTS
==================================================

IMPORTANT :

Les champs suivants doivent contenir UNIQUEMENT
la description du vêtement.

Ils ne doivent JAMAIS contenir une recherche produit.

Exemple correct :

"Top asymétrique violet prune"

Exemple incorrect :

"Top asymétrique violet prune femme top asymétrique"

Les champs :

"haut"
"bas"
"veste"
"chaussures"

doivent être courts, naturels et sans répétition.

==================================================
10. RECHERCHES PRODUITS
==================================================

Les champs "recherches" doivent contenir UNIQUEMENT
les mots-clés permettant de rechercher le produit
dans une boutique de vêtements.

Exemple :

"haut": "Top asymétrique violet prune"

"recherches": {
  "haut": "top asymétrique violet prune femme"
}

NE RÉPÈTE JAMAIS la description deux fois.

Chaque recherche doit être courte.

Maximum environ 8 mots par recherche.

N'utilise pas le nom du personnage.

==================================================
11. ACCESSOIRES
==================================================

Propose entre 2 et 4 accessoires maximum.

Chaque accessoire doit être une description courte.

Exemple :

"Collier doré fin"

"Bracelet jonc doré"

"Petit sac noir"

La recherche correspondante doit être courte.

==================================================
12. COULEURS
==================================================

Indique entre 3 et 5 couleurs principales de la tenue.

==================================================
13. FORMAT JSON
==================================================

Réponds UNIQUEMENT avec un JSON valide.

Aucun texte avant ou après le JSON.

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
12. CONTRÔLE FINAL
==================================================

Avant de répondre, vérifie obligatoirement :

- exactement 1 personnage
- exactement 1 haut
- exactement 1 bas
- exactement 1 veste
- exactement 1 type de chaussures
- 2 à 4 accessoires
- 3 à 5 couleurs
- une recherche par catégorie
- aucune répétition
- aucune recherche dans les descriptions
- aucun nom de personnage dans les recherches
- tenue portable au quotidien
- inspiration Disney subtile
- aucun cosplay
- JSON valide

==================================================
9. RÈGLE ABSOLUE POUR LES CHAMPS
==================================================

ATTENTION : les champs de description NE DOIVENT JAMAIS
contenir les termes de recherche.

Exemple OBLIGATOIRE :

"haut": "Body noir à fines bretelles"

ET

"recherches": {
  "haut": "body noir fines bretelles femme"
}

Il est STRICTEMENT INTERDIT de produire :

"haut": "Body noir à fines bretellesbody noir fines bretelles femme"

Même règle pour :
- bas
- veste
- chaussures
- accessoires

Chaque champ doit avoir UNE SEULE valeur.

Les champs "haut", "bas", "veste", "chaussures" et
"accessoires" servent uniquement à décrire la tenue.

Les champs "recherches" servent uniquement aux recherches
de produits.

Ne mélange jamais les deux.

`;


    // =========================
    // APPEL GEMINI
    // =========================

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

            responseMimeType:
              "application/json"

          }

        })

      }
    );


    // =========================
    // RÉPONSE GEMINI
    // =========================

    const data =
      await response.json();


    // =========================
    // ERREUR GEMINI
    // =========================

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


    // =========================
    // RÉCUPÉRER LE JSON
    // =========================

    const result =
      data?.candidates?.[0]
        ?.content?.parts?.[0]?.text;


    if (!result) {

      console.error(
        "Réponse Gemini inattendue :",
        data
      );

      return res.status(500).json({

        error:
          "Gemini n'a pas renvoyé de résultat."

      });

    }


    // =========================
    // PARSER LE JSON
    // =========================

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


    // =========================
    // RETOUR AU SITE
    // =========================

    return res.status(200).json({

      success: true,

      result: disneyBound

    });


  } catch (error) {

    // =========================
    // ERREUR SERVEUR
    // =========================

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