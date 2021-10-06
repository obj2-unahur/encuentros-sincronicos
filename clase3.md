## Clase 3

## Cualidades de diseño

![Logo](img/logo.png)

===

<div style='position: relative; padding-bottom: 56.25%; padding-top: 35px; height: 0; overflow: hidden;'><iframe sandbox='allow-scripts allow-same-origin allow-presentation' allowfullscreen='true' allowtransparency='true' frameborder='0' height='315' src='https://www.mentimeter.com/embed/f546c4654b953f6710f5d3380a1dcfa7/7265346428ac' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' width='420'></iframe></div>

<small>☝️ No cierren la página, que hay dos preguntas.</small>

===

## Errores comunes

--

### Darle bola al CI

Al final de `Conversation`

![CI](/img/clases/3/checks-failed.png)

--

En `Files changed`

![](/img/clases/3/test-error.png)

--

### Si se puede calcular, mejor

¿Qué sentido tiene guardar dos veces lo mismo?

```kotlin
class Publicacion {
  val usuariosQueLesGusta = mutableSetOf<Usuario>()
  var cantidadMeGusta = 0

  fun darMeGusta(usuario: Usuario) {
    usuariosQueLesGusta.add(usuario)
    cantidadMeGusta += 1
  }
}
```

Asociado a la cualidad **redundancia mínima**.

--

### Getters y setters no son necesarios

```kotlin
// 👎 Hacer un método para cambiar un atributo
fun cambiarPrivacidad(nuevaPrivacidad: Privacidad) {
  this.privacidad = nuevaPrivacidad
}

// 👍 Cambiarlo directamente
videoBailando.privacidad = Publico
```

--

### Nombres de tests

<small>👀 Lean el apunte **¿Cómo elaborar casos de prueba?**</small>

¿Qué estoy testeando acá?

```kotlin
it("Andrea puede ver foto de la cena en Ramos") {
  andrea.puedeVer(fotoCenaRamos).shouldBeTrue()
}
```

¿Y acá? <!-- .element: class="fragment" -->

```kotlin
describe("Público con excluidos") {
  it("puede verla una usuaria no excluida") {
    andrea.puedeVer(fotoCenaRamos).shouldBeTrue()
  }
}
```

<!-- .element: class="fragment" -->

--

### Factor de compresión

El enunciado pedía poder modificar _para todas a la vez_. Eso se logra con un **objeto**:

```kotlin
class Foto(val alto: Int, val ancho: Int) : Publicacion {
  override fun espacioQueOcupa() =
    ceil(alto * ancho * FactorCompresion.valor).toInt()
}

object FactorCompresion {
  var valor = 0.7
}

FactorCompresion.valor = 0.3
```

--

También se puede hacer con un **companion object**:

```kotlin
class Foto(val alto: Int, val ancho: Int) : Publicacion {
  override fun espacioQueOcupa() =
    ceil(alto * ancho * factorCompresion).toInt()

  companion object {
    var factorCompresion = 0.7
  }
}

// Para cambiarlo
Foto.factorCompresion = 0.3
```

--

### Atributos que se inicializan más tarde

Kotlin va a chillar si un atributo puede ser nulo a la hora de usarlo.

Podemos pedirle explícitamente que no lo haga:

```kotlin
class Publicacion(var permiso: Permiso) {
  // El lateinit significa:
  // yo me hago cargo de que no sea nulo 😛
  lateinit var autor: Usuario
}
```

===

## Modelar estrategias

¿Qué problemas tiene esta solución?

```kotlin
abstract class Publicacion(var permiso: String) {
  fun puedeSerVistaPor(usuario: Usuario): Boolean {
    if (usuario == this.autor) {
      return true
    }

    return when (permiso) {
      "Publico" -> true
      "SoloAmigos" -> this.autor.amigos.contains(usuario)
      "PrivadaConPermitidos" ->
        this.listaDePermitidos.contains(usuario)
      "PublicaConExcluidos" ->
        !this.listaDeExcluidos.contains(usuario)
    }
  }
}
```

--

❌ Obliga a tener atributos que no se van a usar en todos los casos.

❌ Aún teniendo pocas estrategias, el código se vuelve rápidamente complejo de leer.

❌ Permite introducir un error donde típicamente no lo habría (pifiarle al tipo de permiso).

--

Ahora, modelamos al `Permiso` como una clase:

```kotlin
abstract class Publicacion(var permiso: Permiso) {
  fun puedeSerVistaPor(usuario: Usuario) =
    usuario == this.autor || permiso.puedeVer(this, usuario)
}

interface Permiso {
  puedeVer(publicacion: Publicacion, usuario: Usuario): Boolean
}
```

👀 **Ojo:** le pasamos a la `Publicacion` y al `Usuario`, para que no sea engorrosa la creación.

--

```kotlin
object Publico : Permiso {
  puedeVer(publicacion: Publicacion, usuario: Usuario) = true
}

object SoloAmigos : Permiso {
  puedeVer(publicacion: Publicacion, usuario: Usuario) =
    publicacion.autor.esAmigoDe(usuario)
}

// Acá sí o sí necesito clases porque cambia la configuración
class PublicoConExcluidos(val excluidos: List<Usuario>)
  : Permiso {
  // etc
}
```

Y así le damos la bienvenida al primer patrón: **Strategy**.

<!-- .element: class="fragment" -->

--

|                               | if                                | Strategy                |
| ----------------------------- | --------------------------------- | ----------------------- |
| _Agregar o quitar estrategia_ | Buscar todos los `if` y modificar | Crear una clase nueva   |
| _¿Opciones no existentes?_    | Validar (o caer en el `else`)     | No es posible           |
| _Configuraciones / atributos_ | Dispersos por varios lugares      | Concentrado en un lugar |

===

## Criterios de evaluación y aprobación

Hay objetivos que tienen que cumplirse para cada ejercicio.

**Fecha límite para recuperar la primera parte:** 12/10

Siempre va a ser pusheando al mismo repositorio. En la corrección les vamos a decir qué tienen que corregir.

===

## Cualidades de diseño

Una posible formalización de aspectos que _nos hacen ruido_.

--

Nos sirven para:

- evaluar nuestros propios diseños,
- comparar diseños,
- comunicarnos con otras personas,
- tomar decisiones,
- justificar las decisiones que tomamos.

--

### Tensiones entre las cualidades

![Tensiones](img/clases/3/soga.gif)

En muchos casos deberemos **priorizar** aquellas que nos interesan, aún cuando eso implique descuidar otras.

===

## Actividades de la semana

### Refactorizar Caralibro

Utilizar **Strategy** para los permisos y calidades de video. Lo suben al mismo repo que venían usando.

### Encontrar defectos Semillas

Detectar defectos de diseño, testear y refactorizar. En **ese** orden.

===

# ¿Preguntas?

<img width="200px" src="img/logo.png">
