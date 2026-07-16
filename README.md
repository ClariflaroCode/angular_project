------------------------------------------------------------------------------------------
Datos personales:
  Julieta Watts
  jwatts@alumnos.exa.unicen.edu.ar
  
----------------------------------------------------------------------------------------
Scheduler OS Simulator: 
El proyecto busca ser un simulador visual y pedagógico del funcionamiento de un scheduler 
de la cpu. 
El usuario elige un algoritmo de planificación 
(por ahora sólo está implementado el algoritmo First Come First Serve (FCFS)), 
crea los procesos que quiera probar estableciendo: tiempos de llegada (arrival time) y cantidad de ciclos de 
ejecución que necesita dicho proceso (burst time). Luego tiene la posibilidad de ejecutar la simulación completa 
que calcula automaticamente las estadísticas ó seguir la simulación paso a paso que permite
consultar donde están los procesos en cada ciclo de reloj y luego ver las estadísticas. 
El objetivo del proyecto es facilitar la comprensión del comportamiento de los procesos dentro de la cpu, 
las diferencias entre los distintos algoritmos de planificación y ser una herramienta de apoyo y verificación de resultados. 

----------------------------------------------------------------------------------------

Notas: Este proyecto es de alta complejidad, por eso todavía no tiene implementados 
todos los algoritmos de planificación y tiene algunos problemas relacionados con entiendo yo
el lag, el listar estadisticas a veces necesita un refresco para ver la ultima consulta pese
a que redirige sólo cuando se hizo el post de la ultima simulacion y algo parecido ocurre a 
veces con el reloj aunq este no consulta a api, pero a veces por lag tarda en renderizar.

-----------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------
# Entregable

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
