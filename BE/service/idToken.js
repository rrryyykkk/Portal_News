import axios from "axios";
import admin from "firebase-admin";

export const exchangeCustomTokenForIdToken = async (customToken) => {
  const apiKey = process.env.FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;

  const response = await axios.post(url, {
    token: customToken,
    returnSecureToken: true,
  });

  return response.data.idToken;
};

export const refreshedIdToken = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { email } = req.body;
    console.log("email:", email);
    if (!email) return res.status(400).json({ message: "Invalid email" });

    const user = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(user.uid);
    const idToken = await exchangeCustomTokenForIdToken(customToken);

    res.json({ idToken });
  } catch (error) {
    console.error("Error refreshing ID token:", error);
    res.status(500).json({ message: "Failed to refresh ID token" });
  }
};
