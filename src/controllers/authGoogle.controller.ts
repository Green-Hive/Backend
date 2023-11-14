import 'dotenv/config';
import {NextFunction, Request, Response} from "express";
import {OAuth2Client} from "google-auth-library";
import prisma from "../services/prisma.ts";
import {Provider} from "@prisma/client";

export const requestGoogleAuthUrl = async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    prompt: 'consent'
  });

  return res.json({url: authorizeUrl});
}

export const getGoogleAuthInfo = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.query.code as string

  const getUserData = async (access_token: string, id_token: string) => {
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

    const {name, email, id} = await getUserData(userTokens.access_token, userTokens.id_token);
    const existingUser = await prisma.user.findFirst({
      where: {email},
    });

    if (existingUser) {
      if (existingUser.provider === Provider.LOCAL) {
        const updatedUser = await prisma.user.update({
          where: {email},
          data: {
            id,
            provider: Provider.GOOGLE,
          },
        });
        console.log('Google user updated!');
      } else {
        console.error('User exists!');
      }
    } else {
      await prisma.user.create({
        data: {name, email, id, provider: Provider.GOOGLE},
      });
      console.log('Google user created!');
    }
    req.session.userId = id;
    return res.redirect(process.env.CLIENT_URL);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
}