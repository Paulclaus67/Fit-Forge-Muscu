# 📚 Documentation de l'API

Documentation complète de l'API REST du backend Fit Forge Muscu.

## 🌐 Base URL

```
http://localhost:4000
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Le token doit être inclus dans le header `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

---

## 📋 Endpoints

### 🔑 Authentification

#### POST `/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-10T10:00:00.000Z"
  }
}
```

#### POST `/auth/login`
Se connecter à un compte existant.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET `/auth/me`
Obtenir les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "profilePicture": "data:image/jpeg;base64,...",
  "createdAt": "2025-12-10T10:00:00.000Z"
}
```

---

### 💪 Exercices

#### GET `/exercises`
Obtenir la liste de tous les exercices.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Développé couché",
    "description": "Exercice de poussée pour les pectoraux",
    "muscleGroup": "CHEST",
    "equipment": "Barre",
    "difficulty": "INTERMEDIATE",
    "instructions": "1. Allongez-vous sur le banc...",
    "videoUrl": "https://example.com/video.mp4",
    "imageUrl": "https://example.com/image.jpg"
  }
]
```

#### GET `/exercises/:id`
Obtenir les détails d'un exercice spécifique.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Développé couché",
  "description": "Exercice de poussée pour les pectoraux",
  "muscleGroup": "CHEST",
  "equipment": "Barre",
  "difficulty": "INTERMEDIATE",
  "instructions": "1. Allongez-vous sur le banc...",
  "videoUrl": "https://example.com/video.mp4",
  "imageUrl": "https://example.com/image.jpg"
}
```

---

### 🏋️ Workouts (Séances)

#### GET `/workouts`
Obtenir toutes les séances de l'utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Push Day",
    "description": "Séance de poussée",
    "exercises": [
      {
        "id": 1,
        "exerciseId": 1,
        "sets": 4,
        "reps": 10,
        "weight": 80,
        "restTime": 120,
        "exercise": {
          "id": 1,
          "name": "Développé couché",
          "muscleGroup": "CHEST"
        }
      }
    ],
    "createdAt": "2025-12-10T10:00:00.000Z"
  }
]
```

#### GET `/workouts/:id`
Obtenir les détails d'une séance spécifique.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Push Day",
  "description": "Séance de poussée",
  "exercises": [...],
  "userId": 1,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z"
}
```

#### POST `/workouts`
Créer une nouvelle séance.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Push Day",
  "description": "Séance de poussée",
  "exercises": [
    {
      "exerciseId": 1,
      "sets": 4,
      "reps": 10,
      "weight": 80,
      "restTime": 120
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Push Day",
  "description": "Séance de poussée",
  "exercises": [...],
  "createdAt": "2025-12-10T10:00:00.000Z"
}
```

#### PUT `/workouts/:id`
Modifier une séance existante.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Push Day Updated",
  "description": "Nouvelle description",
  "exercises": [...]
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Push Day Updated",
  "description": "Nouvelle description",
  "exercises": [...],
  "updatedAt": "2025-12-10T11:00:00.000Z"
}
```

#### DELETE `/workouts/:id`
Supprimer une séance.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Workout deleted successfully"
}
```

---

### 📅 Weekly Plan (Plan hebdomadaire)

#### GET `/weekly-plan`
Obtenir le plan hebdomadaire de l'utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "monday": { "id": 1, "name": "Push Day", "exercises": [...] },
  "tuesday": { "id": 2, "name": "Pull Day", "exercises": [...] },
  "wednesday": null,
  "thursday": { "id": 3, "name": "Legs Day", "exercises": [...] },
  "friday": null,
  "saturday": { "id": 4, "name": "Upper Body", "exercises": [...] },
  "sunday": null
}
```

#### PUT `/weekly-plan`
Mettre à jour le plan hebdomadaire.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "monday": 1,
  "tuesday": 2,
  "wednesday": null,
  "thursday": 3,
  "friday": null,
  "saturday": 4,
  "sunday": null
}
```

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "monday": { "id": 1, "name": "Push Day" },
  "tuesday": { "id": 2, "name": "Pull Day" },
  "updatedAt": "2025-12-10T11:00:00.000Z"
}
```

---

## 🎨 Status Codes

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Requête invalide |
| 401  | Non authentifié |
| 403  | Non autorisé |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |

## 🚨 Gestion des erreurs

Les erreurs retournent un objet JSON standardisé :

```json
{
  "error": "Message d'erreur descriptif"
}
```

## 🔍 Exemples avec cURL

### Se connecter
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Obtenir les exercices
```bash
curl -X GET http://localhost:4000/exercises \
  -H "Authorization: Bearer <votre_token>"
```

### Créer une séance
```bash
curl -X POST http://localhost:4000/workouts \
  -H "Authorization: Bearer <votre_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Push Day",
    "description": "Séance de poussée",
    "exercises": [
      {
        "exerciseId": 1,
        "sets": 4,
        "reps": 10,
        "weight": 80,
        "restTime": 120
      }
    ]
  }'
```

## 📝 Notes

- Tous les endpoints (sauf `/auth/register` et `/auth/login`) nécessitent une authentification
- Les timestamps sont au format ISO 8601
- Les poids sont en kilogrammes
- Les temps de repos sont en secondes
- La limite de taille pour les photos de profil est de 10MB

---

**Pour plus d'informations, consultez le [README.md](../README.md) principal.**
