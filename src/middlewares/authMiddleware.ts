// // Middleware pour vérifier l'authentification de l'utilisateur
// import {Request, Response, NextFunction} from "express";
//
// const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
//   if (req.isAuthenticated()) {
//     // L'utilisateur est authentifié
//     return next();
//   } else {
//     // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
//     return res.redirect('/login');
//   }
// };
//
// // Middleware pour vérifier l'autorisation de l'utilisateur
// const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.role === 'admin') {
//     // L'utilisateur a les autorisations pour accéder à la ressource
//     return next();
//   } else {
//     // L'utilisateur n'a pas les autorisations nécessaires
//     return res.status(403).json({ error: 'Accès refusé' });
//   }
// };
//
// module.exports = { checkAuthentication, checkAuthorization };