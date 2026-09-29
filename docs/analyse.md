# 🎓 Analyse du projet LMS

> **Projet :** LMS Backend API  
> **Technologies :** Node.js • Express.js • MongoDB • Mongoose  
> **Période :** 28/09/2026 → 02/10/2026  
> **Type :** Projet individuel

---

## 📌 1. Reformulation du besoin

Le projet consiste à préparer les **fondations backend d'une plateforme LMS**  
(*Learning Management System*).

La plateforme permettra à plusieurs types d'utilisateurs de consulter, créer et suivre des formations en ligne.

> ⚠️ **Périmètre du brief**  
> L'objectif n'est pas de développer toute la plateforme LMS dans ce premier brief.

### 🎯 Travail attendu

- analyser le besoin ;
- identifier les rôles et les règles métier ;
- préparer la conception UML globale ;
- organiser le travail dans Jira ;
- créer une API avec Express ;
- connecter l'application à MongoDB ;
- gérer le catalogue des cours ;
- gérer les modules ;
- gérer les ressources ;
- documenter l'API ;
- préparer l'environnement Docker.

---

## 👥 2. Rôles du système

| Rôle | Responsabilités principales |
|---|---|
| 👀 **Visiteur** | Consulter, rechercher et filtrer les cours publiés |
| 🎓 **Apprenant** | S'inscrire, suivre les cours, passer les quiz et consulter sa progression |
| 👨‍🏫 **Formateur** | Créer et gérer les cours, modules, ressources et quiz |
| 🛡️ **Administrateur** | Gérer les utilisateurs, rôles, cours et contenus de la plateforme |

### 👀 Visiteur

Le visiteur peut :

- consulter les cours publiés ;
- rechercher un cours ;
- filtrer les cours ;
- consulter le détail d'un cours.

### 🎓 Apprenant

L'apprenant pourra :

- s'inscrire à un cours ;
- consulter les modules ;
- consulter les ressources ;
- suivre sa progression ;
- passer des quiz ;
- laisser un feedback.

### 👨‍🏫 Formateur

Le formateur pourra :

- créer un cours ;
- modifier ses cours ;
- gérer les modules ;
- gérer les ressources ;
- créer des quiz ;
- suivre les inscriptions à ses cours.

### 🛡️ Administrateur

L'administrateur pourra :

- gérer les utilisateurs ;
- gérer les rôles ;
- gérer les cours ;
- modérer les contenus ;
- administrer la plateforme.

---

## 🧩 3. Entités principales

Les principales entités identifiées sont :

| Entité | Description |
|---|---|
| `User` | Utilisateur de la plateforme |
| `Course` | Formation proposée dans le LMS |
| `Module` | Partie d'un cours |
| `Resource` | Contenu pédagogique d'un module |
| `Enrollment` | Inscription d'un apprenant à un cours |
| `Progress` | Progression d'un apprenant |
| `Quiz` | Questionnaire associé à un cours ou module |
| `QuizAttempt` | Tentative d'un apprenant à un quiz |
| `Feedback` | Avis laissé sur un cours |

### 🚀 Entités développées dans ce brief

Dans ce premier brief, l'implémentation backend concerne principalement :

- `Course`
- `Module`
- `Resource`

> Les autres entités seront prises en compte dans la **conception UML globale**, mais ne seront pas encore entièrement développées.
---

## ⚙️ 4. Règles métier principales

Les règles métier principales identifiées sont :

- seuls les cours avec le statut `published` sont visibles dans le catalogue public ;
- un cours peut contenir plusieurs modules ;
- un module appartient à un seul cours ;
- un module peut contenir plusieurs ressources ;
- une ressource appartient à un seul module ;
- les modules doivent avoir un ordre dans un cours ;
- les ressources doivent également avoir un ordre dans un module ;
- un apprenant ne doit pas pouvoir s'inscrire plusieurs fois au même cours ;
- la progression d'un apprenant est liée à son inscription à un cours ;
- un quiz peut être associé à un cours ou à un module ;
- une tentative de quiz appartient à un apprenant et à un quiz ;
- un feedback appartient à un utilisateur et concerne un cours ;
- la création et la modification des cours seront réservées aux formateurs et aux administrateurs ;
- l'administration des utilisateurs et des rôles sera réservée à l'administrateur.

> 🔐 L'authentification et la gestion réelle des autorisations ne sont pas encore implémentées dans ce brief.  
> Ces règles sont néanmoins prévues dès la conception pour préparer les prochains développements.