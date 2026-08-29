```javascript
export default async function handler(req, res) {

  console.log("=== API DISNEYBOUND TEST ===");

  // Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {

    const {
      characterType,
      height,
      weight,
      image,
      mimeType
    } = req.body || {};

    console.log("characterType:", characterType);
    console.log("height:", height);
    console.log("weight:", weight);
    console.log("mimeType:", mimeType);
    console.log("image reçue:", !!image);
    console.log(
      "taille image:",
      image ? image.length : 0
    );

    // Vérification
    if (!characterType) {
      return res.status(400).json({
        error: "characterType manquant"
      });
    }

    if (!height) {
      return res.status(400).json({
        error: "height manquant"
      });
    }

    if (!weight) {
      return res.status(400).json({
        error: "weight manquant"
      });
    }

    if (!image) {
      return res.status(400).json({
        error: "image manquante"
      });
    }

    // Réponse de test
    return res.status(200).json({
      success: true,

      result: {
        personnage: "TEST Disney",
        haut: "Test haut",
        bas: "Test bas",
        veste: "Test veste",
        chaussures: "Test chaussures",

        accessoires: [
          "Test accessoire 1",
          "Test accessoire 2"
        ],

        couleurs: [
          "Noir",
          "Blanc",
          "Rouge"
        ],

        recherches: {
          haut: "test haut",
          bas: "test bas",
          veste: "test veste",
          chaussures: "test chaussures",
          accessoires: "test accessoire"
        }
      }
    });

  } catch (error) {

    console.error(
      "ERREUR API :",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Erreur serveur"
    });
  }
}
```
