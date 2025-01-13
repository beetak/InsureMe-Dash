import jwt_decode from 'jwt-decode';

export function decodeToken(token) {
  console.log("decoding token", token);
  return jwt_decode(token);
}