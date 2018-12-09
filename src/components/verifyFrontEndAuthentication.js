import Cookies from "universal-cookie";

export function verifyFrontEndAuthentication(userObject, isAuthenticated) {
  if (userObject === null) {
    const cookies = new Cookies();
    if (cookies.get('userObject')) {
      return {
        isAuthenticated: cookies.get('userObject').isAuthenticated,
        userObject: cookies.get('userObject').userObject
      };
    } else {
      return {
        isAuthenticated: false,
        userObject: false
      }
    }
  } else {
    return {
      isAuthenticated,
      userObject
    }
  }
}