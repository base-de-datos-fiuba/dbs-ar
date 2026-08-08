# Dataset Pokemon para ReLaX

Dataset adaptado al esquema del diagrama provisto para practicar algebra
relacional con [ReLaX](https://github.com/dbis-uibk/relax).

## Esquema

```mermaid
erDiagram
    POKEMON ||--o{ POKEABILITY : posee
    ABILITIES ||--o{ POKEABILITY : asignada
    POKEMON ||--o{ POKETYPE : tiene
    TYPE ||--o{ POKETYPE : clasifica
    POKEMON ||--o{ POKEMOVE : aprende
    MOVES ||--o{ POKEMOVE : incluye
    TYPE ||--o{ MOVES : clasifica

    POKEMON {
        smallint idpoke PK
        string pokename
        smallint hp
        smallint attack
        smallint defense
        smallint spattack
        smallint spdefense
        smallint speed
        boolean dualtype
    }

    ABILITIES {
        smallint idability PK
        string abilityname
        string abilitydescrip
    }

    TYPE {
        smallint idtype PK
        string typename
    }

    MOVES {
        smallint idmove PK
        string movename
        smallint idtype FK
        string category
        smallint power
        smallint accuracy
        smallint pp
        string effect
    }

    POKEABILITY {
        smallint idpoke PK, FK
        smallint idability PK, FK
        string slot
    }

    POKETYPE {
        smallint idpoke PK, FK
        smallint idtype PK, FK
    }

    POKEMOVE {
        smallint idpoke PK, FK
        smallint idmove PK, FK
        smallint slot
    }
```
## Levantar la aplicacion

Desde este directorio, ejecutar:

```bash
docker compose up --build -d
```

Abrir `http://localhost:8089`. El puerto difiere del dataset de Steam para que
ambos contenedores puedan ejecutarse simultaneamente.

Para detenerlo:

```bash
docker compose down
```
