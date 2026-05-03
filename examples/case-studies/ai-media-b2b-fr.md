# AI media B2B FR — newsletter cardiologie quotidienne

**Industrie** : AI media B2B FR — édition spécialisée santé
**Taille équipe** : 2-5 contributeurs (fondateur + rédacteurs)
**Phase Cordée.IA** : Pilot
**Durée** : 4 semaines

## Le défi

Un éditeur indépendant voulait lancer une newsletter quotidienne destinée aux cardiologues, agrégeant les publications scientifiques (PubMed) et les sources réglementaires françaises et européennes (HAS, ANSM, SFC, ESC). Contraintes : budget infrastructure proche de zéro, souveraineté des fournisseurs IA (pas d'OpenAI/Anthropic pour l'usage final), envoi quotidien à 6h heure Paris sans intervention humaine, et synthèse cliniquement utile (pas un résumé générique).

## Ce qu'on a fait

- Conception d'un pipeline de bout en bout : ingestion sources (PubMed API + scraping HAS/ANSM/SFC/ESC) → embeddings Voyage AI → index vectoriel → synthèse Mistral → templating HTML → envoi Brevo.
- Déploiement sur Scaleway Serverless Jobs pour rester dans le free tier (~9 000 vCPU-secondes / mois utilisés) au lieu de payer un serveur 24/7.
- Cron quotidien à 06:00 UTC déclenché côté Scaleway, avec retry automatique et alerte mail si une étape échoue.
- Sélection éditoriale automatisée par scoring (récence + autorité de la source + pertinence sémantique vs centres d'intérêt cardio) pour ne garder que 3-5 publications par jour.
- Prompt de synthèse calibré pour produire un format constant : pourquoi c'est important, ce que ça change pour la pratique, lien source.
- Stack 100% européenne (Scaleway France, Mistral France, Voyage UK, Brevo France) pour répondre à la promesse de souveraineté affichée auprès des abonnés.

## Résultats

- Coût d'infra mensuel : de 47€ (estimation serveur 24/7 initial) à 0€ (free tier Scaleway tenu sur 4 mois).
- Temps de production d'une édition : de 2h30 (rédaction manuelle équivalente) à 3 min de génération automatique.
- Taux d'ouverture sur les 90 premiers jours : 42% (médian B2B santé : 22%).
- Taux d'envois échoués / cron raté : 0 sur 120+ éditions consécutives.

## Stack

- Python 3.12 (pipeline ingestion + synthèse)
- Mistral Large (synthèse)
- Voyage AI (embeddings)
- Scaleway Serverless Jobs (exécution cron)
- Brevo (envoi transactionnel + tracking ouvertures)
- PostgreSQL managé (déduplication articles + historique)

## Verbatim client

> "Ce qui m'a convaincu, c'est qu'on a tenu le free tier Scaleway pendant 4 mois sans bidouiller. Le pipeline tourne tout seul, je ne le touche que quand je veux ajouter une source."
> — Fondateur, AI media B2B FR
