import Cookies from "universal-cookie";

export function checkAuthentication(cookie) {
  const cookies = new Cookies(cookie);
  const retrieveUserObjectFromCookie = cookies.get('userObject');
  if (retrieveUserObjectFromCookie) {
    return {
      isAuthenticated: true,
      userObject: retrieveUserObjectFromCookie
    };
  }
  return {
    isAuthenticated: false,
    userObject: false
  }
}