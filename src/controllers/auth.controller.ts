import 'dotenv/config';
import {Request, Response} from "express";
import {OAuth2Client} from "google-auth-library";

export const requestGoogleAuthUrl = async (req: Request, res: Response): Promise<void> => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent'
  });

  res.json({url: authorizeUrl});
}

export const getGoogleAuthInfo = async (req: Request, res: Response) => {
  const code = req.query.code as string

  async function getUserData(access_token: string, id_token: string) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
    return response.json();
  }

  try {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );
    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);
    const userTokens = oAuth2Client.credentials;
    // console.log('userTokens=', userTokens);
    const userInfo = await getUserData(userTokens.access_token, userTokens.id_token);
    console.log('userInfo=', userInfo);
    console.log("====================================");
    console.log('id=', userInfo.id);
    console.log('email=', userInfo.email);
    console.log('name=', userInfo.name);
    console.log('picture=', userInfo.picture);
    res.send("ok")

  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
}