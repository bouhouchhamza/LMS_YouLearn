# Contributions et reviews GitHub

Relevé du 11 novembre 2026. Dépôt : [bouhouchhamza/LMS_YouLearn](https://github.com/bouhouchhamza/LMS_YouLearn).

Sources : API REST GitHub `/pulls?state=all&per_page=100`, puis `/pulls/{n}/files`, `/pulls/{n}/reviews` et `/pulls/{n}/comments` pour chacune des 37 PR. Chaque collection contient moins de 100 éléments. Les diffs effectivement intégrés sont aussi relevés par `git diff --numstat <fusion>^1 <fusion>` dans le champ `local_integrated_changes`. Les données structurées et les URL des reviews sont conservées dans [github-contributions-evidence.json](github-contributions-evidence.json). Les dates ci-dessous sont en UTC.

Une fusion, un auteur de PR ou un commentaire ne constitue pas une approbation de review. Les résultats décrivent les événements actuellement accessibles via GitHub, sans inventer de validation passée.

## Pull Requests par auteur

### bouhouchhamza

| PR | Différences de fichiers déclarées par GitHub | État / fusion UTC | Preuve dans origin/main |
|---|---|---|---|
| [#1 — feat: add course modules endpoint](https://github.com/bouhouchhamza/LMS_YouLearn/pull/1) | `src/models/Course.js`, `src/routes/courseRoutes.js` ; +7/−2 | Fusionnée 2026-10-01T11:53:40Z | `8d644cc` |
| [#2 — feat: add Resource model](https://github.com/bouhouchhamza/LMS_YouLearn/pull/2) | `src/controllers/resourceController.js`, `src/models/Resource.js` ; +78/−0 | Fusionnée 2026-10-01T14:22:45Z | Aucune fusion correspondante |
| [#3 — Feature/lms 224 232 239 494 auth](https://github.com/bouhouchhamza/LMS_YouLearn/pull/3) | `.env.example`, `package-lock.json`, `package.json`, `server.js` (+17 autres, voir JSON) ; +434/−69 | Fusionnée 2026-10-08T17:17:10Z | `5b501c7` |
| [#5 — Feature/lms enrollment](https://github.com/bouhouchhamza/LMS_YouLearn/pull/5) | `src/app.js`, `src/controllers/enrollmentController.js`, `src/models/Enrollment.js`, `src/routes/enrollmentRoutes.js` ; +129/−0 | Fusionnée 2026-10-12T11:04:35Z | `ce85597` |
| [#6 — feat(auth): enforce role-based access control on courses and enrollments](https://github.com/bouhouchhamza/LMS_YouLearn/pull/6) | `src/middlewares/authorize.js`, `src/routes/courseRoutes.js`, `src/routes/enrollmentRoutes.js` ; +34/−13 | Fusionnée 2026-10-12T15:15:01Z | `540c357` |
| [#7 — feat(progress): add resource completion and sequential locking](https://github.com/bouhouchhamza/LMS_YouLearn/pull/7) | `src/app.js`, `src/controllers/progressController.js`, `src/models/ResourceProgress.js`, `src/routes/progressRoutes.js` ; +122/−2 | Fusionnée 2026-10-12T17:24:22Z | `3c5903e` |
| [#9 — merge: resolve PR #8 conflicts with main and preserve RBAC](https://github.com/bouhouchhamza/LMS_YouLearn/pull/9) | `src/controllers/courseController.js`, `src/controllers/moduleController.js`, `src/routes/courseRoutes.js`, `src/routes/moduleRoutes.js` ; +277/−34 | Ouverte, non fusionnée | Aucune fusion correspondante |
| [#10 — fix(routes): restore course and module routes after merge](https://github.com/bouhouchhamza/LMS_YouLearn/pull/10) | `src/routes/courseRoutes.js`, `src/routes/moduleRoutes.js` ; +43/−19 | Fusionnée 2026-10-12T22:02:04Z | `7be63d6` |
| [#13 — feat(progress): calculate and persist enrollment percentage](https://github.com/bouhouchhamza/LMS_YouLearn/pull/13) | `src/controllers/progressController.js` ; +68/−52 | Fusionnée 2026-10-13T12:28:58Z | `f58fea4` |
| [#14 — feat(progress): add resume learning endpoint](https://github.com/bouhouchhamza/LMS_YouLearn/pull/14) | `src/controllers/progressController.js`, `src/routes/enrollmentRoutes.js` ; +64/−1 | Fusionnée 2026-10-13T15:15:28Z | `1f34f25` |
| [#17 — refactor(routes): separate enrollment and progress routes](https://github.com/bouhouchhamza/LMS_YouLearn/pull/17) | `src/app.js`, `src/routes/enrollmentRoutes.js`, `src/routes/progressRoutes.js` ; +11/−9 | Fusionnée 2026-10-14T16:22:50Z | `3a3a39b` |
| [#18 — feat(security): protect learner resource content access](https://github.com/bouhouchhamza/LMS_YouLearn/pull/18) | `src/controllers/resourceController.js`, `src/routes/progressRoutes.js` ; +98/−4 | Fusionnée 2026-10-14T17:22:20Z | `6f3ebba` |
| [#19 — feat(trainer): add course learners and progress endpoints](https://github.com/bouhouchhamza/LMS_YouLearn/pull/19) | `src/app.js`, `src/controllers/trainerController.js`, `src/routes/trainerRoutes.js` ; +158/−0 | Fusionnée 2026-10-15T19:43:24Z | `bea26f5` |
| [#20 — feat(resource): secure file downloads and upload directory creation](https://github.com/bouhouchhamza/LMS_YouLearn/pull/20) | `src/controllers/resourceController.js`, `src/middlewares/checkResourceAccess.js`, `src/middlewares/uploadMiddleware.js`, `src/routes/progressRoutes.js` ; +200/−19 | Fusionnée 2026-10-15T22:52:15Z | `fed9d3c` |
| [#21 — test(auth): add Jest Supertest tests and auth security fixes](https://github.com/bouhouchhamza/LMS_YouLearn/pull/21) | `jest.config.js`, `package-lock.json`, `package.json`, `src/controllers/authController.js` (+2 autres, voir JSON) ; +5423/−556 | Fusionnée 2026-10-16T14:58:28Z | `fb25c27` |
| [#22 — build(docker): containerize LMS API with MongoDB Compose](https://github.com/bouhouchhamza/LMS_YouLearn/pull/22) | `.dockerignore`, `Dockerfile`, `docker-compose.yml` ; +36/−0 | Fusionnée 2026-10-16T15:24:13Z | `7e2068e` |
| [#23 — docs: update LMS API documentation for brief 2](https://github.com/bouhouchhamza/LMS_YouLearn/pull/23) | `.env.example`, `README.md`, `docs/openapi.yaml` ; +1615/−645 | Fusionnée 2026-10-16T16:19:47Z | `699c822` |
| [#24 — fix(seed): make demo seeding safe and idempotent](https://github.com/bouhouchhamza/LMS_YouLearn/pull/24) | `src/models/Course.js`, `src/seed/seed.js` ; +209/−91 | Fusionnée 2026-10-20T16:21:37Z | `6d58471` |
| [#30 — Feature/email service](https://github.com/bouhouchhamza/LMS_YouLearn/pull/30) | `jest.config.js`, `package-lock.json`, `package.json`, `src/controllers/QuizController.js` (+25 autres, voir JSON) ; +730/−13 | Fusionnée 2026-10-27T11:53:38Z | `d39ad84` |
| [#37 — fix(brief3): security hardening and LMS API finalization](https://github.com/bouhouchhamza/LMS_YouLearn/pull/37) | `.gitignore`, `.vscode/settings.json`, `.vscode/tasks.json`, `README.md` (+16 autres, voir JSON) ; +740/−224 | Ouverte, non fusionnée | Aucune fusion correspondante |

### ferd-aboubakr

| PR | Différences de fichiers déclarées par GitHub | État / fusion UTC | Preuve dans origin/main |
|---|---|---|---|
| [#25 — fix :  add learner password seed from env](https://github.com/bouhouchhamza/LMS_YouLearn/pull/25) | `.DS_Store`, `src/seed/seed.js` ; +17/−0 | Fusionnée 2026-10-22T20:25:31Z | `6b9a621` |
| [#34 — Br3/learner password seed](https://github.com/bouhouchhamza/LMS_YouLearn/pull/34) | `.env.example`, `src/seed/seed.js` ; +198/−5 | Fusionnée 2026-10-28T16:31:41Z | `b05fea9` |
| [#35 — feat(seed & docs): update env placeholders, document replay procedure…](https://github.com/bouhouchhamza/LMS_YouLearn/pull/35) | `.env.example`, `package-lock.json`, `src/seed/seed.js` ; +7/−53 | Fusionnée 2026-10-30T15:08:13Z | `71ab368` |
| [#36 — fix : add readme to tracked files to reflect seed update](https://github.com/bouhouchhamza/LMS_YouLearn/pull/36) | `README.md` ; +31/−4 | Fusionnée 2026-10-30T16:52:18Z | `7471238` |

### meskiabdelilah

| PR | Différences de fichiers déclarées par GitHub | État / fusion UTC | Preuve dans origin/main |
|---|---|---|---|
| [#4 — Feature/course update](https://github.com/bouhouchhamza/LMS_YouLearn/pull/4) | `docker-compose.yml`, `src/controllers/courseController.js`, `src/models/Course.js`, `src/routes/courseRoutes.js` ; +110/−15 | Fusionnée 2026-10-12T09:10:21Z | `02ae3af` |
| [#8 — Feature/course update](https://github.com/bouhouchhamza/LMS_YouLearn/pull/8) | `src/controllers/courseController.js`, `src/controllers/moduleController.js`, `src/routes/courseRoutes.js`, `src/routes/moduleRoutes.js` ; +247/−28 | Fusionnée 2026-10-12T21:57:05Z | `4a21af3` |
| [#11 — feat: update course and module management](https://github.com/bouhouchhamza/LMS_YouLearn/pull/11) | `src/controllers/moduleController.js`, `src/controllers/resourceController.js`, `src/middlewares/authMiddleware.js`, `src/middlewares/authorize.js` (+5 autres, voir JSON) ; +57/−54 | Fusionnée 2026-10-13T10:48:14Z | `689df32` |
| [#12 — feat(resources): add resource creation endpoint](https://github.com/bouhouchhamza/LMS_YouLearn/pull/12) | `src/controllers/resourceController.js`, `src/models/Resource.js`, `src/routes/moduleRoutes.js` ; +95/−42 | Fusionnée 2026-10-13T12:22:59Z | `5381a9a` |
| [#15 — Feature/resource upload](https://github.com/bouhouchhamza/LMS_YouLearn/pull/15) | `.gitignore`, `package-lock.json`, `package.json`, `src/controllers/resourceController.js` (+4 autres, voir JSON) ; +299/−40 | Fusionnée 2026-10-14T09:24:44Z | `645fad2` |
| [#16 — fix(errors): handle multer errors with proper HTTP status codes](https://github.com/bouhouchhamza/LMS_YouLearn/pull/16) | `.gitignore`, `src/middlewares/errorHandler.js` ; +14/−8 | Fusionnée 2026-10-14T16:22:23Z | `fc35b19` |

### mouncifbenhar

| PR | Différences de fichiers déclarées par GitHub | État / fusion UTC | Preuve dans origin/main |
|---|---|---|---|
| [#26 — feat: add questionSchema quizSchema](https://github.com/bouhouchhamza/LMS_YouLearn/pull/26) | `src/models/Quiz.js` ; +46/−0 | Fusionnée 2026-10-23T15:05:37Z | `fe632f5` |
| [#27 — Project quiz](https://github.com/bouhouchhamza/LMS_YouLearn/pull/27) | `src/app.js`, `src/controllers/QuizController.js`, `src/routes/quizzesRoutes.js` ; +110/−0 | Fusionnée 2026-10-26T12:13:01Z | `6fd03c1` |
| [#28 — Project quiz](https://github.com/bouhouchhamza/LMS_YouLearn/pull/28) | `src/controllers/QuizController.js`, `src/routes/quizzesRoutes.js` ; +59/−4 | Fermée sans fusion | Aucune fusion correspondante |
| [#29 — Project quiz](https://github.com/bouhouchhamza/LMS_YouLearn/pull/29) | `src/controllers/QuizController.js`, `src/models/QuizAttempt.js`, `src/routes/quizzesRoutes.js` ; +208/−6 | Fusionnée 2026-10-27T09:11:55Z | `afe7fa2` |
| [#31 — Project feedback](https://github.com/bouhouchhamza/LMS_YouLearn/pull/31) | `src/app.js`, `src/controllers/FeedbackCntroller.js`, `src/models/Feedback.js`, `src/routes/feedbackRoutes.js` ; +128/−0 | Fusionnée 2026-10-27T17:27:31Z | `81213ec` |
| [#32 — Project feedback](https://github.com/bouhouchhamza/LMS_YouLearn/pull/32) | `src/controllers/FeedbackCntroller.js`, `src/routes/feedbackRoutes.js` ; +80/−1 | Fusionnée 2026-10-28T12:05:28Z | `323cfde` |
| [#33 — Project feedback](https://github.com/bouhouchhamza/LMS_YouLearn/pull/33) | `src/controllers/FeedbackCntroller.js`, `src/routes/feedbackRoutes.js` ; +37/−1 | Fusionnée 2026-10-28T12:15:31Z | `c55d26a` |

## Cohérence des preuves de fusion

Les 34 PR indiquées fusionnées par GitHub ont toutes un commit de fusion correspondant dans la première parenté de `origin/main`. Les commits locaux sont des ancêtres de `origin/main` au relevé. Les PR #9 et #37 restent ouvertes ; #28 est fermée sans fusion.

Les SHA de fusion renvoyés par GitHub divergent de l’historique local pour les PR suivantes. Le relevé conserve les deux valeurs ; aucune explication de cette divergence n’est affirmée.

| PR | SHA de fusion renvoyé par GitHub | Fusion correspondante dans origin/main |
|---|---|---|
| #36 | `984370fc0cc03aaf8d78ca19fd72417e41974d43` | `747123850ded35da87d0e8fed5abde2e47652f63` |
| #34 | `05a0e51a9107c75b7ca8905be1e2b14d12344cf5` | `b05fea9f1074d8719a46ea0cc352745d1d64fa1f` |

## Reviews effectivement enregistrées

| PR / auteur | Reviewer | Événement | Date UTC | Preuve |
|---|---|---|---|---|
| #4 / meskiabdelilah | bouhouchhamza | APPROVED | 2026-10-12T09:10:02Z | [Review 5488593852](https://github.com/bouhouchhamza/LMS_YouLearn/pull/4#pullrequestreview-5488593852) |
| #15 / meskiabdelilah | bouhouchhamza | APPROVED | 2026-10-14T09:24:33Z | [Review 5515768349](https://github.com/bouhouchhamza/LMS_YouLearn/pull/15#pullrequestreview-5515768349) |

Deux soumissions de review APPROVED sont présentes : PR #4 et #15, toutes deux par bouhouchhamza sur le travail de meskiabdelilah. Les 35 autres PR n’ont aucune soumission de review enregistrée dans le relevé. Aucun commentaire de review inline n’a été retourné pour les 37 PR. La PR #37 reste sans review enregistrée. Les demandes de reviewers et les échanges hors GitHub ne sont pas des reviews soumises et ne sont pas attestés ici.

## Rattachement du Closing Board

La référence « Closing Board » provient uniquement de la demande dans le chat. Aucun lien ni ticket vérifiable n’a été fourni. La recherche exacte de `Closing Board`, `trainerSummary`, `PREFS` et `DOCKER-RUN` ne retourne aucun résultat dans les sources/docs/tests des 24 références distantes, ni dans les messages de commits. Les références issues/PR consultées ne fournissent aucun cahier des charges CONFIG/PREFS. Le rattachement de ces deux tickets à ce dépôt ne peut donc pas être confirmé ; aucun autre projet n’a été identifié comme source.
