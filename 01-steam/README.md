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
    GAME ||--o{ GAME_FEATURE : ofrece
    FEATURE ||--o{ GAME_FEATURE : incluye
    GAME ||--o{ GAME_DEVELOPER : desarrolla
    DEVELOPER ||--o{ GAME_DEVELOPER : participa
    GAME ||--o{ GAME_PUBLISHER : publica
    PUBLISHER ||--o{ GAME_PUBLISHER : participa
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
    }

    FEATURE {
        int feature_id PK
        string name
    }

    GAME {
        int app_id PK
        string title
        date release_date
        decimal price_usd
        boolean windows
        boolean mac
        boolean linux
        boolean free_to_play
    }

    GAME_GENRE {
        int app_id PK, FK
        int genre_id PK, FK
    }

    GAME_FEATURE {
        int app_id PK, FK
        int feature_id PK, FK
    }

    GAME_DEVELOPER {
        int app_id PK, FK
        int developer_id PK, FK
    }

    GAME_PUBLISHER {
        int app_id PK, FK
        int publisher_id PK, FK
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
        date review_date
        boolean recommended
        int helpful_votes
    }
```

Las relaciones puente y `Library` tienen claves primarias compuestas. Juegos,
desarrolladores y publishers se relacionan N:M.

## Regeneración y validación

`source/steam_catalog.json` es el snapshot versionado del catálogo obtenido de
los endpoints públicos de Steam Store. `generate_dataset.py` lo combina con
actividad sintética usando seed 42 y snapshot `2026-08-02`. No se debe editar
`datasets/local_groups` manualmente.

```bash
cd 01-steam
python3 generate_dataset.py
python3 generate_dataset.py --check
python3 validate_dataset.py
```

Para renovar deliberadamente el catálogo (requiere Internet):

```bash
python3 scrape_steam_catalog.py --games 200
```

El scraper usa el buscador y `appdetails` de Steam con región US e idioma inglés;
excluye DLC, próximos lanzamientos, precios desconocidos y fechas posteriores al
snapshot. La generación normal no realiza solicitudes de red.

El último comando valida PK, FK, duplicados, fechas, precios y los casos docentes
descritos en [teaching_cases.md](teaching_cases.md).

## Levantar la aplicación

Desde este directorio, ejecutar:

```bash
docker compose pull
docker compose up -d
```

La imagen de ReLaX es independiente del dataset. Docker Compose monta
`datasets/local_groups` en modo de solo lectura al iniciar el contenedor.

Para probar una imagen publicada en otra ubicación:

```bash
RELAX_IMAGE=ghcr.io/<owner>/<repository>:latest docker compose up -d
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
