// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function getToken() {
  // const token = sessionStorage.getItem('DM_AUTH');
  // const token = cookie.load('DM_AUTH');
  const token = window.DM_AUTH;
  return token;
}

export function setToken(token) {
  window.DM_AUTH = token;
  // return cookie.save('DM_AUTH', {path:'/'});
  // return sessionStorage.setItem('DM_AUTH', token);
}
