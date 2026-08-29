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

Tu es l'IA officielle de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et PORTABLE AU QUOTIDIEN à partir de la photo fournie.

==================================================
ANALYSE DE LA PHOTO
==================================================

Analyse uniquement les éléments nécessaires pour choisir
une tenue :

- style vestimentaire général
- couleurs visibles
- types de vêtements
- coupe générale
- style casual, streetwear, chic, sportif, etc.
- harmonie générale de la tenue

NE cherche JAMAIS à identifier la personne.

NE déduis pas son identité, son âge, son origine,
sa profession ou toute autre information personnelle.

==================================================
MORPHOLOGIE
==================================================

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour proposer des
vêtements avec des coupes et proportions cohérentes.

Ne donne jamais d'analyse du corps ou de jugement
sur l'apparence physique.

==================================================
PERSONNAGE
==================================================

Le type demandé est :

${
  characterType === "villain"
    ? "Méchant Disney"
    : "Personnage Disney gentil"
}

Choisis UN personnage Disney qui correspond :

1. au style observé sur la photo
2. aux couleurs observées
3. au type demandé
4. à une tenue portable dans la vie quotidienne

Le personnage doit être reconnaissable grâce à
l'inspiration de la tenue, mais la tenue ne doit
PAS reproduire son costume.

==================================================
RÈGLE DISNEYBOUND
==================================================

IMPORTANT :

DisneyBound signifie S'INSPIRER d'un personnage,
pas se déguiser en personnage.

ÉVITE :

- costumes
- déguisements
- vêtements avec le visage du personnage
- imprimés Disney trop évidents
- oreilles de personnage
- accessoires de cosplay
- vêtements extravagants
- tenues impossibles à porter au quotidien
- reproduction exacte du costume original

PRIVILÉGIE :

- couleurs du personnage
- palette de couleurs
- matières
- style
- silhouettes
- détails subtils
- accessoires discrets
- vêtements disponibles dans des boutiques classiques

La tenue doit pouvoir être portée dans la rue,
au travail, en sortie ou dans la vie quotidienne.

==================================================
CHAUSSURES
==================================================

Choisis des chaussures réalistes et cohérentes avec
le style de la personne.

PRIVILÉGIE :

- baskets
- sneakers
- bottines
- mocassins
- chaussures plates

Les talons sont autorisés uniquement s'ils correspondent
clairement au style observé sur la photo.

==================================================
VÊTEMENTS
==================================================

Les vêtements doivent être des produits réalistes
que l'on pourrait trouver dans des boutiques comme :

SHEIN
Zalando
ASOS
H&M
Zara
Mango
Uniqlo

==================================================
RECHERCHES PRODUITS
==================================================

Pour chaque catégorie, crée une recherche courte,
naturelle et exploitable dans un moteur de recherche
de vêtements.

Les recherches doivent décrire :

- le type de vêtement
- la couleur
- éventuellement la matière
- éventuellement la coupe
- éventuellement homme ou femme si évident

Exemples :

"t-shirt noir oversize homme"

"pantalon cargo vert olive homme"

"veste bomber noire homme"

"baskets blanches homme"

"bracelet cuir marron homme"

Évite les recherches trop longues.

N'utilise PAS le nom du personnage dans les recherches
produits.

==================================================
FORMAT DE RÉPONSE
==================================================

Réponds UNIQUEMENT avec un JSON valide.

Aucun texte avant ou après le JSON.

Format obligatoire :

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
CONTRAINTES FINALES
==================================================

- exactement 1 personnage
- exactement 1 haut
- exactement 1 bas
- exactement 1 veste
- exactement 1 type de chaussures
- 2 à 4 accessoires maximum
- 3 à 5 couleurs maximum
- 1 recherche par catégorie
- recherches courtes
- tenue cohérente
- tenue portable
- inspiration Disney subtile
- aucun cosplay
- aucun déguisement

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