# Fórmula 1: Jolpica

Datos históricos de Fórmula 1 para practicar AR. La fuente es el dump CSV público de [Jolpica F1](https://github.com/jolpica/jolpica-f1), disponible públicamente y actualizado cada 14 días

## Levantar la aplicacion

Desde este directorio, ejecutar:

```bash
docker compose up --build -d
```

Abrir `http://localhost:8090`.

Para detenerlo:

```bash
docker compose down
```

## Créditos

Los datos provienen de [Jolpica F1](https://github.com/jolpica/jolpica-f1). Consultá sus [condiciones de dumps](https://github.com/jolpica/jolpica-f1/blob/main/docs/database_dumps.md): los datos gratuitos son para uso no comercial.
