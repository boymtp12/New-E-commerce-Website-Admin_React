import jwt_decode from "jwt-decode";

export function isTokenExpired(token) {
    try {
      const decodedToken = jwt_decode(token)
      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
      }
      return true;
    } catch (error) {
      return true; 
    }
  }