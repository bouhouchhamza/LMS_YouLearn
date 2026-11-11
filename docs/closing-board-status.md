# Closing Board — état vérifiable

Branche locale : `codex/closing-board-delivery`, créée depuis `fad5f85` (PR #37).
Aucun merge de l’ancien main : les correctifs de sécurité de #37 sont conservés.
La référence au Closing Board provient du chat, sans ticket ou contrat vérifiable.

| Ticket | État | Preuve / limite |
|---|---|---|
| EMAIL | Implémenté ; tests existants réutilisés | `src/services/email/`, huit templates, transport log/SMTP, suites Email |
| CONFIG | BLOCKED — SPECIFICATION MISSING | Aucun ticket ou schéma admin de notifications/jobs retrouvé ; aucun job inventé |
| PREFS | BLOCKED — SPECIFICATION MISSING | Aucun `trainerSummary`, contrat, route ou modèle de préférences retrouvé |
| ENV | Corrigé | `.env.example` documente EMAIL_DRIVER et SMTP ; base seed dédiée ; `.env` reste ignoré |
| DOCKER | Corrigé | Services existants conservés ; healthchecks, attente MongoDB, ports paramétrables, volume uploads et exclusion des fichiers locaux |
| DOCKER-RUN | Validé en environnement isolé | `node scripts/verify-docker.mjs` exécute un projet Compose isolé et vérifie la persistance après recréation |
| PR | Preuves collectées | 37 PR, auteurs et fichiers intégrés ; 34 fusions déclarées avec commits correspondants dans origin/main |
| REVUES | Preuves collectées, limite explicite | Deux APPROVED observées sur #4 et #15 ; aucune review enregistrée pour les autres PR consultées |

## EMAIL : réutilisation des contributions

Le service et les templates de Hamza ne sont pas réimplémentés. Le choix existant
est `EMAIL_DRIVER=smtp` pour SMTP, sinon log (dont variable absente/inconnue).
Les sujets/textes/HTML utilisent les variables métier ; Handlebars échappe les
valeurs HTML. Le transport SMTP est créé uniquement à sa première utilisation.

| Événement métier | Appel existant | Protection vérifiée par les tests existants |
|---|---|---|
| Inscription utilisateur sauvegardée | `authController` / welcome | Rôle learner imposé ; une panne Email n’annule pas la sauvegarde |
| Inscription cours sauvegardée | `enrollmentController` / enrollment | Pas de notification sur échec métier |
| Annulation active persistée | `enrollmentController` / enrollmentCancelled | Une panne Email n’annule pas l’annulation |
| Premier passage à 100 % | `progressController` / courseCompleted | Transition atomique ; pas de renvoi sur répétition |
| Tentative quiz sauvegardée | `QuizController` / quizPassed ou quizFailed | Résultat persisté utilisé ; une notification par tentative |

`passwordReset` et `courseReminder` sont des templates/fonctions disponibles,
mais ne sont pas raccordés à des workflows ou jobs. Aucun `trainerSummary`
n’existe. Aucune fréquence, planification, option admin ou préférence utilisateur
n’est déduite de ces noms. L’envoi SMTP réel n’est pas validé dans cette tâche :
les tests utilisent log ou des mocks Nodemailer.

## CONFIG / PREFS : recherche et blocage

La recherche exacte des identifiants Closing Board, trainerSummary, PREFS et
DOCKER-RUN couvre les sources/docs/tests des 24 références distantes et les
messages de commits. Les fichiers locaux, issues et descriptions des PR
consultées ne fournissent aucun contrat CONFIG/PREFS. Les usages du mot
« config » concernent la configuration technique existante, sans ticket admin.

Le rattachement de ces tickets au dépôt YouLearn ne peut pas être confirmé.
Aucun projet alternatif n’est identifié : il s’agit d’un rattachement inconnu,
pas d’une preuve qu’ils appartiennent à un autre projet. Le demandeur confirme
ne pas pouvoir fournir les spécifications et demande de conserver ce blocage.
Aucun endpoint, modèle, scheduler ni test portant sur un contrat inventé n’est ajouté.

Pour débloquer : fournir les tickets d’origine, champs et validations attendus,
permissions, valeurs par défaut et contrat `trainerSummary`, ainsi que les jobs
précis auxquels CONFIG doit s’appliquer. Aucun commit CONFIG/PREFS artificiel.

## ENV et Docker

`.env` n’est ni modifié ni ajouté. `.env.example` contient des placeholders et
le driver log par défaut. Pour un seed, définir temporairement MONGO_URI sur la
base locale dédiée nommée par SEED_DB_NAME ; la configuration dev lms_db ne doit
pas servir aux tests ou à la validation Docker.

Compose conserve les services api/mongodb et le Dockerfile de l’équipe.
Les volumes sont préfixés par le projet Compose ; le nom global lms-mongodb
est retiré pour permettre une validation isolée. Le driver et les paramètres
SMTP sont transmis explicitement au service API, sans valeur secrète committée.
La base MongoDB et les uploads disposent de volumes distincts persistants.

Depuis la branche sécurisée, avec Docker et Node disponibles :

```sh
node scripts/verify-docker.mjs
```

Ce test crée un nom de projet unique, deux ports locaux libres, une configuration
temporaire hors dépôt avec un secret factice et EMAIL_DRIVER=log. Il ne lit pas
le .env habituel pour Compose. Il construit l’image, attend les deux services,
vérifie HTTP 200, la base lms_closing_test et l’absence de .env, déclencheurs
suspects et fichiers locaux dans l’image. Il écrit deux marqueurs de test dans
la base et le volume uploads, recrée les conteneurs et vérifie leur conservation.
Enfin, il supprime uniquement les conteneurs/volumes de son projet temporaire.
Ce script est une validation locale, pas un déploiement.

## Preuves GitHub

Voir [contributions-and-reviews.md](contributions-and-reviews.md) et les données
[github-contributions-evidence.json](github-contributions-evidence.json).
Les dates GitHub sont conservées en UTC. Deux divergences entre SHA de fusion
API et historique local sont exposées, sans leur attribuer une cause inconnue.
Une fusion n’est jamais présentée comme une review. Aucune review n’est créée
pour compléter rétrospectivement les preuves.


## Résultats de validation du 11 novembre 2026

- Jest : **107 tests réussis, 13 suites, aucun échec lors de la relance complète**.
- EMAIL : les 81 tests Email existants sont inclus dans ce total ; aucun SMTP réel.
- Script `node scripts/verify-docker.mjs` : sortie 0 après construction de l’image,
  deux démarrages sains (dont recréation), HTTP 200, connexion à lms_closing_test,
  vérification du driver log et contrôle des fichiers exclus de l’image.
- Les marqueurs MongoDB et uploads subsistent après recréation des conteneurs.
- Le script supprime ses propres conteneurs, volumes, réseau et configuration
  temporaire à la fin. Aucun volume réel n’est monté ou supprimé.
- `docker compose config --quiet`, vérification de syntaxe du script et
  `git diff --check` réussis. Le Dockerfile, les modèles, routes, contrôleurs,
  services Email et tests métier existants sont inchangés.
- Empreinte .env vérifiée identique à celle précédant les travaux ; .env reste
  ignoré et non suivi. Aucun secret réel n’est écrit dans les exemples/commits.
- Aucun push, déploiement ou merge n’est effectué. La PR #37 reste la base
  sécurisée de cette branche ; l’ancien main suspect n’est pas réintégré.
