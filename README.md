# Lenovo Tech One NodeJS Backend

## Scripts

En el directorio del proyecto, se puede ejecutar:
### `npm i` (Para instalar/actualizar las dependencias)

### `npm run dev`(Para ejecutar el API en modo desarrollo)

### `npm run start`(Para ejecutar el API en modo producción)

Para realizar peticiones al API.\
Utilizar [http://localhost:3000/](http://localhost:3000/) y los sufijos correspondientes.

El servidor se recargará cada que se edite algún archivo\
Tambien es posible ver errores en consola

## Directorios 

### `config`
Contiene archivos de configuración.
### `controllers`
Contiene archivos de controladores donde se realiza el procesamiento de los datos.
### `migrations`
Contiene archivos relacionados con la definición y creación de la base de datos.
### `middlewares`
Contiene scripts útiles que pueden ser reutilizados en distintos módulos del proyecto.
### `models`
Contiene archivos donde se mappean entidades que corresponden a tablas de una base de datos relacional.
### `request`
Contiene archivos útiles para hacer peticiones HTTP al API
### `routes`
Contiene archivos donde se definen las rutas y el tipo de petición que se utilizará en el proyecto.
### `seeders`
Contiene archivos útiles para poblar la base de datos.


## Cambios en el proyecto/ nuevas implementaciones

Se recomienda al realizar una nueva funcionalidad seguir el siguiente flujo:

Nuevas funcionalidades

Hacer una rama:

### `git branch feature/nombre-funcionalidad`

Cambiar a la rama para trabajar sobre ella 

### `git checkout feature/nombre-funcionalidad`


Corrección de algún bug/error

Hacer una rama:

### `git branch fix/nombre-bug/error`

Cambiar a la rama para trabajar sobre ella 

### `git checkout fix/nombre-bug/error`

De cualquier forma funcionalidad/fix bug se recomienda hacer el merge a la rama 'develop' , ya que se tenga una versión estable y aprobada hacer merge a 'master'

# lenovo-tech-one-backend
