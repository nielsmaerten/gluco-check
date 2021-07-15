# Preguntas frecuentes

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [¿Cómo puedo preguntar a Gluco Check por... ?](#%C2%BFc%C3%B3mo-puedo-preguntar-a-gluco-check-por-)
  - [una métrica específica](#una-m%C3%A9trica-espec%C3%ADfica)
  - [mi selección personal](#mi-selecci%C3%B3n-personal)
  - [múltiples métricas](#m%C3%BAltiples-m%C3%A9tricas)
- [Otras preguntas que puedes probar (experimental)](#otras-preguntas-que-puedes-probar-experimental)
- [¿Puedo usar una invocación personalizada?](#%C2%BFpuedo-usar-una-invocaci%C3%B3n-personalizada)
- [¿Por qué Nightscout no acepta mi API secret / token?](#%C2%BFpor-qu%C3%A9-nightscout-no-acepta-mi-api-secret--token)
- [¡Tengo una pregunta diferente!](#%C2%A1tengo-una-pregunta-diferente)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## ¿Cómo puedo preguntar a Gluco Check por... ?

### una métrica específica

Diga: **Hola Google, pida a Gluco Check que lea mi [blank]**.  
Sustituya **[blank]** con el nombre de cualquier métrica, O un sinónimo:

| Métrica                       | Sinónimos                                     |
| ----------------------------- | --------------------------------------------- |
| Azúcar en sangre              | glucosa, azúcar, BG                           |
| Hidratos de carbono activos   | hidratos de carbono, COB, hidratos de carbono |
| Insulina activa               | insulina, IOB                                 |
| Tiempo del sensor             | sensor                                        |
| Tiempo del equipo de infusión | equipo de infusión, cánula, catéter, pod      |
| Batería de la Bomba           | batería                                       |
| Reservorio de la Bomba        | insulina restante, reservorio                 |
| _Todo_                        | _todos los valores, todo_                     |

### mi selección personal

Diga: **Hola Google, hable con Gluco Check** sin especificar una métrica.  
Asistente ahora leerá los valores que seleccionó en https://glucocheck.app.

### múltiples métricas

Diga: **Ok Google, pida a Gluco Check que lea mi _[azúcar en sangre]_ y _[tiempo del sensor]_**

## Otras preguntas que puedes probar (experimental)

- ¿Qué tiempo tiene mi sensor? ¿Qué tiempo tiene mi pod?
- Cuantos hidratos de carbono tengo?
- ¿Cuánta insulina me queda?

## ¿Puedo usar una invocación personalizada?

¡Sí!  
Si el Asistente de Google admite [rutinas](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) para su idioma,  
siga [estas instrucciones](https://glucocheck.app/assets/routines-setup.mp4) para crear sus propias invocaciones. Por ejemplo:

| En vez de...                                                         | decir:                           |
| -------------------------------------------------------------------- | -------------------------------- |
| Ok Google, pídele a Gluco Check que lea mi nivel de azúcar en sangre | Hola Google, comprueba mi azúcar |

## ¿Por qué Nightscout no acepta mi API secret / token?

_API Secrets_ y _Tokens_ no son lo mismo.  
Para usar Gluco Check, necesitará un _token_. Un token tiene este aspecto: `glucocheck-1d2a6bc59`.  
Necesita ayuda? Visite https://glucocheck.app, haga clic en '_No está seguro de cómo crear un token? ¡Sigue leyendo!_'

## ¡Tengo una pregunta diferente!

¿No pudo encontrar una respuesta aquí? Publique su pregunta en [Discusiones](https://github.com/nielsmaerten/gluco-check/discussions). ¡Estaremos encantados de ayudarte!
