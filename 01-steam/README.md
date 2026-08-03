# Dataset Steam para ReLaX

Dataset para practicar álgebra relacional con
[ReLaX](https://github.com/dbis-uibk/relax). Incluye juegos, desarrolladores,
publishers, géneros, usuarios, bibliotecas, compras y reseñas.

El catálogo está basado en datos públicos de Steam. Los usuarios y su actividad
son datos sintéticos creados exclusivamente para uso académico.

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
