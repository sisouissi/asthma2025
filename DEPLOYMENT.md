# Guide de Déploiement (Vercel)

Cette application utilise **Vite** pour le frontend et des **Vercel Edge Functions** pour l'API de chat (dossier `api/`). La plateforme recommandée pour le déploiement est **Vercel**, car elle gère automatiquement cette architecture.

## Prérequis

1.  Un compte [Vercel](https://vercel.com/).
2.  Le code source de l'application (sur GitHub, GitLab, Bitbucket ou via Vercel CLI).
3.  Une clé API Gemini (Google AI Studio).

## Méthode 1 : Déploiement via GitHub (Recommandé)

1.  **Poussez votre code** sur un dépôt GitHub (si ce n'est pas déjà fait).
2.  Connectez-vous à **Vercel**.
3.  Cliquez sur **"Add New..."** > **"Project"**.
4.  Importez votre dépôt GitHub.
5.  **Configuration du Framework Preset** : Vercel devrait détecter automatiquement **Vite**.
6.  **Variables d'Environnement** :
    *   Dans la section "Environment Variables", ajoutez les variables suivantes :
        *   **Nom** : `API_KEY`
        *   **Valeur** : Votre clé API Gemini (commençant par `AIza...`)
        *   *(Optionnel)* **Nom** : `GEMINI_API_KEY`
        *   **Valeur** : La même clé (pour compatibilité avec la configuration locale/vite).
7.  Cliquez sur **"Deploy"**.

## Méthode 2 : Déploiement via Vercel CLI

Si vous préférez utiliser la ligne de commande :

1.  Installez Vercel CLI :
    ```bash
    npm i -g vercel
    ```
2.  À la racine du projet, lancez :
    ```bash
    vercel
    ```
3.  Suivez les instructions à l'écran (connectez-vous, confirmez les paramètres par défaut).
4.  Pour les variables d'environnement en production :
    *   Allez sur votre dashboard Vercel > Settings > Environment Variables.
    *   Ajoutez `API_KEY`.
    *   Redéployez avec `vercel --prod`.

## Note sur l'API Chat

L'application utilise une fonction serverless (`api/chat.ts`) pour communiquer avec Google Gemini de manière sécurisée (votre clé API ne sera jamais exposée au navigateur du client). Cette fonction nécessite obligatoirement la variable d'environnement `API_KEY` configurée sur Vercel.

## Vérification

Une fois déployé :
1.  Ouvrez l'URL fournie par Vercel (ex: `https://votre-projet.vercel.app`).
2.  Testez l'application.
3.  Ouvrez le chat "Ask the Expert" et posez une question pour vérifier que l'API fonctionne.
