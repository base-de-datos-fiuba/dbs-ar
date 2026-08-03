# ReLaX Steam — modo cátedra

Esta imagen compila ReLaX y agrega un modo de uso simplificado:

- carga `SteamCollege` desde la propia imagen;
- selecciona el dataset automáticamente;
- abre directamente la calculadora con ese dataset;
- oculta la barra de navegación y el selector de datasets;
- oculta el Group Editor y acciones de carga de datasets;
- oculta la pestaña SQL;
- deja disponible la calculadora de álgebra relacional;
- abre el editor sin una consulta inicial.

## Ejecutar

```bash
docker compose up --build -d
```

Abrir:

```text
http://localhost:8088
```

## Detener

```bash
docker compose down
```

## Archivos importantes

```text
datasets/local_groups       Dataset Steam compilado dentro de ReLaX
college/college-mode.js     Bloqueo y simplificación de interfaz
college/college-mode.css    Estilos del modo cátedra
nginx.conf                  Inyección del modo cátedra
```

## Cambiar el dataset

Modificá `datasets/local_groups` y reconstruí:

```bash
docker compose up --build -d
```

El nombre definido después de `group:` debe coincidir con `TARGET_GROUP`
en `college/college-mode.js`. Al reconstruir la imagen, el archivo se registra
como el dataset local `steam` y queda primero en la carga inicial de ReLaX.

## Dataset contents

The bundled English dataset contains 176 games, 168 developers, 136 publishers,
81 Steam classifications, 120 synthetic users, 840 library entries, 720
purchases, and 420 reviews. `Genre` includes both Steam genres and Steam feature
categories, distinguished by `classification_type`. Catalog metadata is based on
public Steam responses; private user activity is synthetic.

## Consultas para verificar

### Games released after 2015

```text
sigma release_date > 2015-12-31 (Game)
```

### Users who own Portal 2

```text
pi username (
  UserAccount
  join UserAccount.user_id = Library.user_id
  (sigma app_id = 620 (Library))
)
```

### Games without purchases

```text
pi app_id, title (Game)
-
pi app_id, title (
  Game join Game.app_id = Purchase.app_id Purchase
)
```

### Users who own every Valve game

```text
pi user_id, app_id (Library)
div
pi app_id (
  Game join Game.developer_id = Developer.developer_id
  (sigma name = 'Valve' (Developer))
)
```

## Nota técnica

Esto no mantiene un fork permanente de los componentes internos de ReLaX.
El contenedor compila el proyecto upstream y Nginx inyecta una capa pequeña
de JavaScript y CSS. Es más fácil de actualizar, pero conviene fijar
`RELAX_REF` a un commit probado antes de usarlo en una cursada.
