# Detallado de Requerimientos para el Sistema de Gestión de Salas de Ensayo UDP (Actualizado)

## 1. Registro de Usuarios y Bandas

### 1.1. Tipos de Usuarios

- **Usuarios UDP**: Estudiantes de la Universidad Diego Portales.
- **Usuarios Externos**: Personas que no son estudiantes de la UDP.

### 1.2. Registro de Usuarios

- **Usuarios UDP**:
  - **Proceso de Registro**:
    - Pueden registrarse utilizando sus credenciales institucionales o mediante un formulario de registro.
    - Deben proporcionar:
      - Nombre completo.
      - RUT (Rol Único Tributario).
      - Correo electrónico institucional.
    - **Verificación**:
      - Requieren aprobación del administrador para confirmar su estatus como estudiantes activos de la UDP.
- **Usuarios Externos**:
  - **Proceso de Registro**:
    - Pueden registrarse mediante un formulario de registro.
    - Deben proporcionar:
      - Nombre completo.
      - RUT.
      - Correo electrónico.
    - **Verificación**:
      - No requieren aprobación del administrador.
  - **Limitaciones**:
    - No pueden crear bandas ni realizar reservas.
    - No tienen permisos especiales dentro del sistema.

### 1.3. Creación de Bandas

- **Usuarios Autorizados**:
  - Solo los usuarios UDP pueden crear bandas.
- **Composición de la Banda**:
  - Puede incluir tanto usuarios UDP como usuarios externos.
- **Proceso de Creación**:
  - El usuario UDP inicia sesión en el sistema.
  - Completa un formulario que incluye:
    - **Nombre de la banda**: Debe ser único.
    - **Integrantes**:
      - Listado de miembros iniciales (usuarios UDP y/o externos).
      - Para cada integrante:
        - Nombre completo.
        - RUT.
        - Correo electrónico.
- **Aprobación**:
  - Las bandas creadas por usuarios UDP son activadas inmediatamente sin necesidad de aprobación adicional.

### 1.4. Gestión de Integrantes

- **Modificación de la Banda**:
  - **Usuarios Autorizados**:
    - Solo usuarios UDP pertenecientes a la banda pueden modificarla.
  - **Acciones Disponibles**:
    - Agregar o remover integrantes (usuarios UDP o externos).
    - Modificar información de la banda.
  - **Proceso**:
    - Los cambios son realizados directamente por el usuario UDP.
    - **Efectividad**:
      - Los cambios son efectivos inmediatamente sin necesidad de aprobación del administrador.

### 1.5. Limitaciones de Pertenencia

- **Usuarios UDP**:
  - Solo pueden ser miembros permanentes de **una** banda a la vez.
- **Usuarios Externos**:
  - Pueden ser miembros de múltiples bandas sin restricciones.
- **Invitados**:
  - Usuarios UDP y externos pueden ser añadidos como invitados a sesiones específicas de otras bandas.
  - La condición de invitado es temporal y no afecta la pertenencia a otras bandas.

## 2. Reserva de Salas y Gestión de Invitados

### 2.1. Configuración Global de Reservas

- **Parámetros Definidos por el Administrador**:
  - **Número Máximo de Reservas por Banda por Semana**:
    - Valor configurable entre 0 y 7.
    - Aplica globalmente a todas las bandas.
  - **Horarios Disponibles**:
    - Rango de horas en que las salas están disponibles (por ejemplo, de 8:00 am a 10:00 pm).
  - **Duración Máxima de Cada Reserva**:
    - Establece la duración máxima permitida por reserva.

### 2.2. Proceso de Reserva

- **Acceso al Calendario**:
  - Las bandas pueden visualizar el calendario con la disponibilidad actualizada.
- **Realización de Reservas**:
  - Las bandas pueden reservar salas hasta el número máximo de veces permitido por semana.
  - Las reservas se realizan en bloques de tiempo definidos (por ejemplo, intervalos de 1 hora).
- **Confirmación**:
  - Al seleccionar un horario, se presenta un resumen de la reserva.
  - La reserva se confirma al aceptar el resumen y se registra en el sistema.

### 2.3. Gestión de Invitados

- **Agregar Invitados durante la Reserva**:
  - **Usuarios Registrados**:
    - Al ingresar el nombre o RUT, el sistema autocompleta la información.
    - Se añaden como invitados para esa sesión específica.
  - **Nuevos Invitados**:
    - Se requiere ingresar:
      - Nombre completo.
      - RUT.
      - Correo electrónico.
    - Se registran en el sistema como usuarios externos.
- **Limitaciones**:
  - No hay límite en el número de invitados por sesión, pero se recomienda considerar la capacidad de la sala.
  - Los invitados solo tienen permiso para asistir a la sesión especificada.

### 2.4. Información sobre Equipamiento

- **Detalles de la Sala**:
  - Cada sala muestra el equipamiento disponible.
- **Selección de Sala**:
  - Las bandas pueden elegir la sala que mejor se adapte a sus necesidades.

## 3. Roles y Permisos de Usuarios

### 3.1. Usuarios UDP

- **Permisos**:
  - **Crear Bandas**: Sí.
  - **Editar Bandas**: Sí (solo las que pertenecen).
  - **Realizar Reservas**: Sí.
  - **Agregar Invitados**: Sí.
  - **Visualizar Calendario Completo**: Sí.
- **Restricciones**:
  - Solo pueden pertenecer formalmente a una banda.
  - No pueden editar bandas ajenas.

### 3.2. Usuarios Externos

- **Permisos**:
  - **Crear Bandas**: No.
  - **Editar Bandas**: No.
  - **Realizar Reservas**: No.
  - **Participar en Bandas**: Sí (como miembros o invitados).
  - **Visualizar Calendario de su Banda**: Sí.
- **Limitaciones**:
  - No tienen acceso a funcionalidades administrativas.
  - No requieren aprobación al registrarse.

### 3.3. Invitados

- **Definición**:
  - Usuarios (UDP o externos) añadidos para una sesión específica.
- **Permisos**:
  - **Acceso a la Sesión Específica**: Sí.
- **Limitaciones**:
  - No pueden realizar acciones en el sistema.
  - No afectan la composición permanente de la banda.

## 4. Gestión Administrativa de Reservas y Usuarios

### 4.1. Funciones del Administrador

- **Configuración del Sistema**:
  - Establece parámetros globales de reserva (número máximo de reservas por semana, horarios disponibles, etc.).
- **Verificación de Usuarios UDP**:
  - Confirma que los usuarios UDP sean estudiantes activos.
- **Gestión de Usuarios**:
  - Puede actualizar información de usuarios y bandas si es necesario.
- **Monitoreo y Control**:
  - Supervisa el uso del sistema y detecta abusos.
  - Puede aplicar sanciones según las políticas establecidas.

### 4.2. Comunicación y Soporte

- **Notificaciones**:
  - Envía alertas sobre cambios en las políticas o configuraciones.
- **Atención al Usuario**:
  - Resuelve consultas y problemas reportados por los usuarios.

## 5. Impresión y Calendarización

### 5.1. Generación del Calendario Semanal

- **Contenido**:
  - Reservas confirmadas con:
    - **Nombre de la Banda**.
    - **Integrantes Permanentes**: Nombres y RUT.
    - **Invitados**: Nombres y RUT.
    - **Sala**.
    - **Horario**.
- **Formato**:
  - Diseño claro para uso por el personal de seguridad.
  - Incluye identificadores únicos si es necesario.

### 5.2. Uso por el Personal de Seguridad

- **Control de Acceso**:
  - Verificación de asistentes según el calendario.
  - Requiere presentación de identificación coincidente.
- **Actualizaciones**:
  - El sistema permite imprimir calendarios actualizados en caso de cambios.

## 6. Beneficios del Sistema

### 6.1. Optimización y Transparencia

- **Eficiencia**:
  - Automatiza el proceso de reservas.
- **Transparencia**:
  - Disponibilidad de información en tiempo real.

### 6.2. Flexibilidad

- **Colaboración**:
  - Facilita la inclusión de invitados.
- **Organización**:
  - Centraliza la gestión de ensayos.

### 6.3. Experiencia del Usuario

- **Facilidad de Uso**:
  - Interfaz intuitiva.
- **Autonomía**:
  - Gestión independiente por parte de los estudiantes.

## 7. Requerimientos Técnicos y de Seguridad

### 7.1. Autenticación y Autorización

- **Seguridad**:
  - Uso de HTTPS.
  - Autenticación de usuarios UDP mediante credenciales institucionales.
- **Roles Definidos**:
  - Administrador, Usuario UDP, Usuario Externo, Invitado.

### 7.2. Protección de Datos

- **Cumplimiento Legal**:
  - Alineación con leyes de protección de datos.
- **Seguridad de Información**:
  - Encriptación de datos sensibles.
- **Respaldo**:
  - Copias de seguridad periódicas.

### 7.3. Disponibilidad

- **Accesibilidad**:
  - Sistema disponible 24/7, salvo mantenimientos programados.
- **Escalabilidad**:
  - Capacidad para soportar incremento de usuarios.

## 8. Políticas de Uso y Normativas

### 8.1. Términos y Condiciones

- **Aceptación**:
  - Obligatoria al registrarse.
- **Normas de Conducta**:
  - Uso adecuado de salas y equipamiento.

### 8.2. Sanciones

- **Incumplimientos**:
  - Definición de faltas (ausencia sin aviso, daños, etc.).
- **Consecuencias**:
  - Suspensiones temporales o permanentes.
  - Notificación a autoridades pertinentes.

### 8.3. Responsabilidades

- **Usuarios**:
  - Cuidado del equipamiento.
  - Respeto de horarios.

---

Al integrar las correcciones proporcionadas, hemos ajustado los requerimientos para asegurar claridad y evitar ambigüedades:

- **Número de Reservas**:
  - El administrador define el número máximo de reservas por banda por semana (0 a 7), aplicable globalmente.
- **Usuarios Externos**:
  - Pueden registrarse sin aprobación, pero no pueden crear bandas ni realizar reservas.
  - Pueden ser miembros de bandas y participar en sesiones.
- **Gestión de Bandas**:
  - Los usuarios UDP pueden modificar la composición de sus bandas directamente, sin necesidad de aprobación administrativa.
  - Los cambios son efectivos inmediatamente.

Este detallado de requerimientos garantiza que todas las funcionalidades y políticas del sistema estén claramente definidas, facilitando su implementación y uso efectivo por parte de todos los involucrados.