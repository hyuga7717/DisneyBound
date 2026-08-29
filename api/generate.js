export default async function handler(req, res) {

// ==========================================
// 1. VERIFICATION DE LA METHODE
// ==========================================

if (req.method !== "POST") {
return res.status(405).json({
error: "Méthode non autorisée"
});
}

try {

```
// ==========================================
// 2. RECUPERATION DES DONNEES
// ==========================================

const {
  characterType,
  height,
  weight,
  image,
  mimeType
} = req.body || {};


// ==========================================
// 3. VERIFICATION DES DONNEES
// ==========================================

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


// ==========================================
// 4. VERIFICATION DE LA CLE GEMINI
// ==========================================

const apiKey =
  process.env.gemini_api_key;


if (!apiKey) {

  console.error(
    "ERREUR : gemini_api_key absente"
  );

  return res.status(500).json({
    error:
      "La clé Gemini n'est pas configurée dans Vercel."
  });

}


// ==========================================
// 5. PROMPT
// ==========================================

const prompt = `
```

Tu es l'IA de DisneyBound.

Ta mission est de créer une tenue DisneyBound moderne,
élégante et portable au quotidien à partir de la photo fournie.

Analyse uniquement :

* style vestimentaire général
* couleurs visibles
* types de vêtements
* coupes générales
* style casual, streetwear, chic, sportif, etc.
* harmonie générale

Ne cherche jamais à identifier la personne.

Ne déduis jamais son identité, son âge, son origine,
sa profession ou toute autre information personnelle.

La personne mesure ${height} cm et pèse ${weight} kg.

Utilise ces informations uniquement pour choisir
des coupes et proportions adaptées.

Le type demandé est :

${
characterType === "villain"
? "Méchant Disney"
: "Personnage Disney gentil"
}

Choisis UN personnage Disney qui correspond :

* au style observé
* aux couleurs observées
* au type demandé
* à une tenue portable au quotidien

Évite de choisir systématiquement le même personnage.

DisneyBound signifie s'inspirer d'un personnage
et non reproduire son costume.

INTERDIT :

* cosplay
* déguisement
* costume
* reproduction exacte du costume
* oreilles de personnage
* imprimés représentant le personnage
* accessoires de cosplay
* vêtements trop extravagants

PRIVILEGIE :

* couleurs du personnage
* palette de couleurs
* matières
* silhouettes
* détails subtils
* accessoires discrets
* vêtements disponibles dans des boutiques classiques

La tenue doit conserver une partie importante
du style observé sur la photo.

Pour chaque pièce, crée également une requête
de recherche permettant de trouver un véritable
produit dans une boutique de vêtements.

IMPORTANT :

La description de la tenue et la recherche sont
deux éléments différents.

Exemple :

"haut": "Body noir à fines bretelles"

"recherches": {
"haut": "body noir fines bretelles femme"
}

INTERDICTIONS POUR LES RECHERCHES :

* ne jamais répéter deux fois la même recherche
* ne jamais coller la description et la recherche ensemble
* ne jamais écrire deux recherches dans le même champ
* ne jamais ajouter la recherche à la description
* ne jamais utiliser de phrase complète
* ne jamais utiliser de guillemets dans les recherches
* ne jamais utiliser le nom du personnage

Maximum environ 8 mots par recherche.

Les champs :

"haut"
"bas"
"veste"
"chaussures"

doivent contenir uniquement une description courte
et naturelle du vêtement.

Propose entre 2 et 4 accessoires maximum.

Indique entre 3 et 5 couleurs principales.

Réponds UNIQUEMENT avec un JSON valide.

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
`;

```
// ==========================================
// 6. URL GEMINI
// ==========================================

const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
  encodeURIComponent(apiKey);


// ==========================================
// 7. APPEL GEMINI
// ==========================================

console.log(
  "Appel Gemini en cours..."
);


const response =
  await fetch(
    url,
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


// ==========================================
// 8. RECUPERATION REPONSE GEMINI
// ==========================================

const responseText =
  await response.text();


console.log(
  "Status Gemini :",
  response.status
);


console.log(
  "Réponse Gemini :",
  responseText.substring(0, 1000)
);


// ==========================================
// 9. PARSING REPONSE GEMINI
// ==========================================

let data;


try {

  data =
    JSON.parse(responseText);

} catch (error) {

  console.error(
    "Gemini n'a pas renvoyé du JSON :",
    responseText
  );

  return res.status(500).json({
    error:
      "Réponse invalide reçue de Gemini."
  });

}


// ==========================================
// 10. ERREUR GEMINI
// ==========================================

if (!response.ok) {

  console.error(
    "Erreur API Gemini :",
    data
  );


  return res.status(500).json({

    error:
      data?.error?.message ||
      "Erreur lors de la communication avec Gemini."

  });

}


// ==========================================
// 11. RECUPERATION DU RESULTAT
// ==========================================

const result =
  data?.candidates?.[0]
    ?.content
    ?.parts?.[0]
    ?.text;


if (!result) {

  console.error(
    "Réponse Gemini sans résultat :",
    JSON.stringify(data)
  );


  return res.status(500).json({

    error:
      "Gemini n'a pas renvoyé de résultat."

  });

}


// ==========================================
// 12. CONVERSION DU JSON GEMINI
// ==========================================

let disneyBound;


try {

  disneyBound =
    JSON.parse(result);

} catch (error) {

  console.error(
    "JSON retourné par Gemini :",
    result
  );


  return res.status(500).json({

    error:
      "Gemini n'a pas renvoyé un JSON valide."

  });

}


// ==========================================
// 13. VERIFICATION DU RESULTAT
// ==========================================

if (
  !disneyBound.personnage ||
  !disneyBound.haut ||
  !disneyBound.bas ||
  !disneyBound.veste ||
  !disneyBound.chaussures
) {

  console.error(
    "JSON incomplet :",
    disneyBound
  );


  return res.status(500).json({

    error:
      "Le résultat Gemini est incomplet."

  });

}


// ==========================================
// 14. NORMALISATION
// ==========================================

if (
  !Array.isArray(
    disneyBound.accessoires
  )
) {

  disneyBound.accessoires = [];

}


if (
  !Array.isArray(
    disneyBound.couleurs
  )
) {

  disneyBound.couleurs = [];

}


if (
  !disneyBound.recherches ||
  typeof disneyBound.recherches !== "object"
) {

  disneyBound.recherches = {

    haut: "",
    bas: "",
    veste: "",
    chaussures: "",
    accessoires: ""

  };

}


// ==========================================
// 15. REPONSE AU SITE
// ==========================================

console.log(
  "DisneyBound généré :",
  disneyBound.personnage
);


return res.status(200).json({

  success: true,

  result: disneyBound

});
```

} catch (error) {

```
// ==========================================
// 16. ERREUR SERVEUR
// ==========================================

console.error(
  "ERREUR SERVEUR GENERATEUR :",
  error
);


return res.status(500).json({

  error:
    error?.message ||
    "Erreur serveur inconnue."

});
```

}

}
