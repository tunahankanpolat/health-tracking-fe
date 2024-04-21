import axios from "axios";
export default class AwsLambdaService {
  postAuthorizedCode(
    authorizedCode,
    userId,
    scope,
    state,
    codeVerifier,
    platform,
    clientId,
    redirectUri
  ) {
    console.log("authorizedCode", authorizedCode);
    console.log("userId", userId);
    return axios.post(
      process.env.EXPO_PUBLIC_POST_AUTHORIZATION_CODE_URL,
      {
        code: authorizedCode,
        id: userId,
        scope: scope,
        state: state,
        codeVerifier: codeVerifier,
        platform: platform,
        clientId: clientId,
        redirectUri: redirectUri,
      },
      {
        ACCESS_CONTROL_ALLOW_ORIGIN:
          "https://bqv3mvxf35gnesdyiwsmmh3tfy0mcyor.lambda-url.eu-west-1.on.aws",
      }
    );
  }

  async getHealthData(userId) {
    return await axios.post(
      process.env.EXPO_PUBLIC_GET_HEALTH_DATA_URL,
      {
        user_id: userId,
      },
      {
        ACCESS_CONTROL_ALLOW_ORIGIN:
          "https://bqv3mvxf35gnesdyiwsmmh3tfy0mcyor.lambda-url.eu-west-1.on.aws",
      }
    );
  }
}
