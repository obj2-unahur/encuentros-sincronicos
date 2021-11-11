<div style='position: relative; padding-bottom: 56.25%; padding-top: 35px; height: 0; overflow: hidden;'><iframe sandbox='allow-scripts allow-same-origin allow-presentation' allowfullscreen='true' allowtransparency='true' frameborder='0' height='315' src='https://www.mentimeter.com/embed/511455abe4b10088ba19766e9e8e79e9/1555c366c89c' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' width='420'></iframe></div>

<small>☝️ No cierren la página, que hay dos preguntas.</small>

===

## Clase 7

## El último ejercicio 🥲

![Logo](img/logo.png)

===

## Avisos parroquiales 🔔

Tienen hasta el **Viernes 26 de Noviembre** para hacer las correcciones de los ejercicios de la segunda etapa.

Para el último ejercicio, extendemos ese plazo hasta el **1 de Diciembre** (sin excepción porque nos corre Guaraní).

--

Cierre presencial de la materia el **Martes 23 de Noviembre**.

Luego hago encuesta para ver si prefieren hacerlo a las 18:00 o a las 20:00.

===

## Servidor web

--

### Observer

Por lo que vi, muy bien. 👏

Básicamente, no era más que un `forEach` avisándole a cada analizador que había una respuesta nueva.

--

### ¿Atributos compartidos entre subclases?

**Solo** si todas las subclases lo usan. Si no, que cada cual decida.

--

## Map

Algunos grupos se animaron a usarlo, muy bien.

Básicamente es una colección **asociativa**, donde cada elemento es una asociación entre una _clave_ y un _valor_.

```kotlin
mutableMapOf("Fede" to 11223344, "Juana" to 88776655)
```

--

Tanto la clave como el valor pueden ser de cualquier tipo, aunque para la clave tiene sentido usar algo que pueda ser **único**.

En el TP, tenía sentido hacer un mapa de clave `Modulo` con valores `List<RespuestaHttp>`.

--

En principio, soporta las mismas operaciones de **orden superior** que las demás colecciones.

La diferencia es que para los mapas vienen por triplicado:

```kotlin
val items = mapOf("A" to 90, "B" to 80, /* etc... */)

// Si solo quiero mirar las claves
items.filterKeys { it == "A" || it == "C" }

// Si solo quiero mirar los valores
items.filterValues { it >= 70 }

// Si me interesan ambas cosas
items.filter { it.key == "A" || it.value == 50 }
```

<small>En este caso todas devuelven un `Map`, pero no para todos los métodos es así.</small>
<small>¡A leer documentación! 👀</small>

--

✍️ Pronto un apunte más completo.

--

### Estado de un objeto entre tests

Hay que reiniciarlo **a mano**, porque Kotest no lleva un registro de esas modificaciones. Con las clases no pasa porque se crea un objeto nuevo para cada `it`.

Lo más práctico es hacerle un método `reiniciar()` y llamarlo en el `describe` más general.

--

```kotlin
describe("Servidor web") {
  // Antes que nada, reiniciamos.
  ServidorWeb.reiniciar()

  // De acá en adelante, le podemos agregar lo que querramos.
  // Para cada test se va a volver a correr el `reiniciar`,
  // así que siempre arrancaría "como nuevo".

  describe("Analizador IPs sospechosas") {
    val analizadorIPsSospechosas = /* ... */
    ServidorWeb.agregarAnalizador(analizadorIPsSospechosas)

    it("envía un correo electrónico") {
      // acá el test
    }
  }
}
```

<!-- .element: class="fullscreen" -->

--

### Mocks

También salió por lo que vi.

Van algunos consejos a modo de resumen...

👇

--

1. Poder **inyectar** de alguna manera a la dependencia externa, sea en el constructor o cambiando un atributo.
1. **Encapsular** al comportamiento externo en otro objeto o clase, para poder reemplazarlo en los tests.
1. En Kotest no es obligatorio, pero es una buena práctica crear una **interfaz** donde quede claro qué métodos expone esta dependencia externa.

--

### Null object

Algunos grupos lo intentaron, bien.

En su forma más "pura", es una clase u objeto que comparte interfaz pero no hace nada:

```kotlin
open class Modulo(
  val extensiones: List<String>,
  val respuesta: String,
  val tiempoRespuesta: Int)
{
  open fun puedeManejar(pedido: PedidoHttp) =
    extensiones.contains(pedido.extension)
}

object NoModulo : Modulo(emptyList(), "", 10) {
  override fun puedeManejar(pedido: PedidoHttp) = false
}
```

===

## Último trabajo: países impostores 🌎

Similar al de **Tareas**, está planteado en 3 etapas:

1. Dominio.
1. Conectar con APIs externas.
1. Hacer un CLI.

--

La novedad es que en este caso van a necesitar consultar a dos APIs distintas para construir los objetos. 🤯

- [🗺️ REST Countries API](https://restcountries.com/): info del país.
- [🤑 Currency Converter API](https://free.currencyconverterapi.com/): cotización del dólar.

--

El flujo sería algo así:

```plantuml
!$BGCOLOR = "transparent"
!theme plain
Cliente -> Transformador: obtenerPais("Colombia")
Transformador -> RestCountriesAPI: buscarPaisesConNombre("Colombia")
RestCountriesAPI --> Transformador: [Country("Colombia", 50882884, [Currency("COP")], ...))]
Transformador -> CurrencyConverterAPI: convertirDolarA("COP")
CurrencyConverterAPI --> Transformador: 3866.99
Transformador -> Transformador: transformarLimitrofes(country.borders)
Transformador --> Cliente: Pais("Colombia", ...)
```

<small>(el `Cliente` sería el objeto que necesite usar el país, eso lo definirán en su diseño... 😏)</small>

--

🤔

Veamos el [enunciado](https://github.com/surprograma/disenio-kt-paises-impostores) en detalle.

===

## Actividades de la semana

### Ejercicio Países impostores

Van a armar un CLI que trae información de países de dos APIs y las muestra a nuestros usuarios.

===

# ¿Preguntas?

<img width="200px" src="img/logo.png">
