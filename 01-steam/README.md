# Dataset Steam para ReLaX

Dataset para practicar álgebra relacional con
[ReLaX](https://github.com/dbis-uibk/relax). 

El catálogo está basado en datos públicos de Steam. Los usuarios y su actividad
son datos sintéticos creados exclusivamente para uso académico.

```mermaid
erDiagram
    DEVELOPER ||--o{ GAME : desarrolla
    PUBLISHER ||--o{ GAME : publica
    GAME ||--o{ GAME_GENRE : clasifica
    GENRE ||--o{ GAME_GENRE : incluye
    USER_ACCOUNT ||--o{ LIBRARY : posee
    GAME ||--o{ LIBRARY : pertenece
    USER_ACCOUNT ||--o{ PURCHASE : realiza
    GAME ||--o{ PURCHASE : corresponde
    USER_ACCOUNT ||--o{ REVIEW : escribe
    GAME ||--o{ REVIEW : recibe

    USER_ACCOUNT {
        int user_id PK
        string username
        string country
        date registration_date
    }

    DEVELOPER {
        int developer_id PK
        string name
    }

    PUBLISHER {
        int publisher_id PK
        string name
    }

    GENRE {
        int genre_id PK
        string name
        string classification_type
    }

    GAME {
        int app_id PK
        string title
        date release_date
        decimal price_usd
        int developer_id FK
        int publisher_id FK
        boolean windows
        boolean mac
        boolean linux
        boolean free_to_play
    }

    GAME_GENRE {
        int app_id PK, FK
        int genre_id PK, FK
    }

    LIBRARY {
        int user_id PK, FK
        int app_id PK, FK
        date added_date
        decimal hours_played
    }

    PURCHASE {
        int purchase_id PK
        int user_id FK
        int app_id FK
        date purchase_date
        decimal paid_usd
    }

    REVIEW {
        int review_id PK
        int user_id FK
        int app_id FK
        boolean recommended
        int score
        int helpful_votes
    }
```

Las claves primarias de `GameGenre` y `Library` son compuestas. Cada juego
referencia exactamente un desarrollador y un publisher; las demás entidades
principales pueden existir sin registros asociados.

## Levantar la aplicación

Desde este directorio, ejecutar:

```bash
docker compose up --build -d
```

Abrir en el navegador:

```text
http://localhost:8088
```

## Detener la aplicación

```bash
docker compose down
```

Para consultar los logs:

```bash
docker compose logs -f
```
