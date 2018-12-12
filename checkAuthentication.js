import Cookies from "universal-cookie";

export function checkAuthentication(req) {
  const isClient = typeof document !== 'undefined';
  const cookies =  isClient ? new Cookies() : new Cookies(req.req.headers.cookie);
  const retrieveUserObjectFromCookie = cookies.get('userObject');
  const url = isClient ? req.asPath : req.req.url;
  if (retrieveUserObjectFromCookie) {
    return {
      isAuthenticated: true,
      userObject: retrieveUserObjectFromCookie.userObject,
      pathName: 'https://brainflop.com' + url
    };
  }
  return {
    isAuthenticated: false,
    userObject: false,
    pathName: 'https://brainflop.com' + url
  }
}