# 💰 MoneyUp Mobile

**MoneyUp Mobile** es la aplicación móvil del proyecto MoneyUp, diseñada para la **gestión de finanzas personales**. Permite a familias e individuos **definir, registrar y alcanzar metas de ahorro** de manera práctica e intuitiva.

---

## 📖 Información General

**Autores de la aplicación móvil:**

* Santiago Torres Morocho
* Juan David Chaves Muños
* Jesús David León Chito
* Gabriela Orozco Vásquez
* Juan Sebastián Astudillo Ordóñez

---

## 🗺️ Estructura del Proyecto (App Móvil)

```bash
app/                # Código de React Native con Expo Router
│── auth/           # Pantallas de autenticación
│── (home)/tabs/    # Layout de tabs: Inicio, Presupuesto, Perfil
│── (money-up-app)/ # Layout de navegación principal y Stack
core/               # Funciones y servicios (API, store, Haptics)
components/         # Componentes reutilizables (Inputs, Buttons, Cards)
assets/             # Imágenes, iconos y fuentes
presentation/       # presentacion al usuario: Components, context, etc..
```

> ⚠️ Nota: El resto de la documentación y archivos del proyecto general se encuentran en la raíz del repositorio.

---

## 🗺️ Uso de Expo Router

Expo Router permite una navegación basada en **archivos y carpetas**:

* Cada **archivo dentro de `app/`** representa una pantalla o ruta.
* Las **carpetas entre paréntesis `(home)`** se usan para layouts o stacks compartidos.
* La carpeta **`(tabs)`** genera automáticamente una barra de tabs inferior.
* La navegación entre pantallas y tabs se maneja mediante el componente `<Stack />` o `<Tabs />`.

### Ejemplo de Tabs

```tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: "Inicio" }} />
  <Tabs.Screen name="budgets" options={{ title: "Presupuesto" }} />
  <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
</Tabs>
```

---

## 🔗 Referencias

* [Documentación oficial Expo Router](https://expo.github.io/router/docs)
* [React Native](https://reactnative.dev/)
* [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
* [NativeWind](https://www.nativewind.dev/)

---

## 🧪 Usuario de prueba

Existe una cuenta de prueba de InsForge para validar el inicio de sesión:

| Campo | Valor |
|---|---|
| Correo | `jdavidleonch@gmail.com` |
| Contraseña | No se publica en el repositorio; solicitarla por un canal seguro |

La cuenta debe tener el correo verificado en InsForge antes de iniciar sesión. No agregues contraseñas reales al README, al código fuente ni a archivos versionados.

---

## 📝 Licencia

Proyecto académico desarrollado como parte de la asignatura de desarrollo de software. No comercial.
