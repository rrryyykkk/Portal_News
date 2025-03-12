import axios from "axios";

export const exchangeCustomTokenForIdToken = async (customToken) => {
  const apiKey = process.env.FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;

  const response = await axios.post(url, {
    token: customToken,
    returnSecureToken: true,
  });

  return response.data.idToken;
};
