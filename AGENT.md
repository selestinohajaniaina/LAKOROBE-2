# Guide des agents — Lakorobe 2

## 1. Présentation du projet

Lakorobe 2 est un projet de jeu vidéo basé sur les cultures malagasy.

Le projet est actuellement au stade de prototype visuel. Le développement réel du jeu n'a pas encore commencé.

Le concept détaillé du jeu, son gameplay, ses personnages, son univers, ses niveaux, ses mécaniques, ses contrôles et sa progression seront définis progressivement.

### Principe important

Ne pas inventer les éléments de game design qui n'ont pas encore été définis.

Lorsqu'une décision importante concernant le jeu est nécessaire, demander une précision ou proposer plusieurs options avant de l'implémenter.

Le projet doit conserver une identité fortement liée à Madagascar et à ses cultures.

Les éléments culturels malagasy doivent être traités avec cohérence et respect. Ne pas inventer de traditions, de significations culturelles ou de références présentées comme authentiques sans indication claire.

---

## 2. État actuel du projet

Le dépôt contient actuellement un prototype visuel.

Il ne faut pas considérer que le jeu final est déjà conçu.

À ce stade, les éléments suivants ne sont pas encore définis :

- genre exact du jeu ;
- gameplay principal ;
- boucle de jeu ;
- objectif du joueur ;
- conditions de victoire et de défaite ;
- personnages jouables ;
- personnages secondaires ;
- ennemis ;
- contrôles ;
- plateformes cibles ;
- niveaux ;
- progression ;
- système de récompenses ;
- inventaire ;
- système de sauvegarde ;
- scénario détaillé ;
- dialogues ;
- système de combat éventuel ;
- système de quêtes éventuel ;
- direction sonore complète ;
- localisation.

Le prototype actuel contient principalement une scène d'introduction visuelle avec un fond, un logo et plusieurs animations.

---

## 3. Identité du projet

Lakorobe 2 doit progressivement développer une identité visuelle et ludique inspirée de Madagascar.

Les futurs éléments du jeu pourront notamment s'inspirer de :

- paysages malagasy ;
- faune et flore de Madagascar ;
- architecture ;
- artisanat ;
- vêtements ;
- musiques et instruments ;
- légendes et récits ;
- traditions ;
- langues malagasy ;
- différentes régions de Madagascar ;
- patrimoine culturel.

Cependant, aucune de ces catégories ne doit être transformée automatiquement en mécanique de jeu.

Une référence culturelle doit être utilisée uniquement lorsque son rôle dans le jeu a été défini.

---

## 4. Stack technique

Le projet utilise actuellement :

- JavaScript avec modules ES ;
- Phaser 4 ;
- Vite 8 ;
- HTML/CSS sans framework d'interface ;
- npm ;
- `package-lock.json`.

Ne pas migrer vers :

- TypeScript ;
- un framework UI ;
- un autre moteur de jeu ;

sans demande explicite.

Conserver la stack existante.

---

## 5. Structure actuelle

```text
index.html

src/
├── main.js
├── style.css
├── scenes/
│   └── startup.js
└── assets/
    ├── lakorobe/
    ├── song/
    └── fonts/

public/