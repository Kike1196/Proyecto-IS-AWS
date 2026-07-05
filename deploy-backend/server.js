// backend/server.js
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const bcrypt = require("bcrypt")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const app = express()
const PORT = process.env.PORT || 4000

// ============================
// Configuración PostgreSQL
// ============================
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ProyectoIs",
  password: process.env.DB_PASSWORD || "270704",
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : false,
})

// ============================
// Middlewares
// ============================
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../")))

// ============================
// Rutas base
// ============================
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend Proyecto IS funcionando correctamente",
    endpoints: ["/ping", "/categorias", "/materiales", "/usuarios"]
  })
})

app.get("/ping", (req, res) => res.send("Servidor funcionando correctamente 🚀"))

// ============================
// 🧍 Registro de usuario
// ============================
app.post("/register", async (req, res) => {
  try {
    const { id_usuario, nombres, apellidos, carreras_id_carreras, correo, semestre, contrasena } = req.body;

    if (!id_usuario || !nombres || !apellidos || !carreras_id_carreras || !correo || !semestre || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // ✅ Validar correo con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: "Correo electrónico no válido" });
    }

    // ✅ Validar longitud mínima de contraseña
    if (contrasena.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    // ✅ Verificar si ya existe usuario/correo
    const userExist = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1 OR correo = $2",
      [id_usuario, correo]
    );
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "El usuario o correo ya están registrados" });
    }

    // ✅ Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO usuarios (ID_USUARIO, CARRERAS_ID_CARRERAS, NOMBRES, APELLIDOS, CORREO, SEMESTRE, CONTRASENA, ROLES_ID_ROL)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 3)`,
      [id_usuario, carreras_id_carreras, nombres, apellidos, correo, semestre, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ============================
// 🔐 Login
// ============================
app.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body
    if (!correo || !contrasena) return res.status(400).json({ error: "Faltan datos" })

    const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo])
    if (result.rows.length === 0) return res.status(401).json({ error: "Correo no registrado" })

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena)
    if (!passwordMatch) return res.status(401).json({ error: "Contraseña incorrecta" })

    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id_usuario: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        roles_id_rol: user.roles_id_rol,
        semestre: user.semestre,
      },
    })
  } catch (error) {
    console.error("❌ Error en /login:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// ============================
// 📘 CRUD: CREAR_ASESORIA
// ============================
app.get("/asesorias", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*, 
        COUNT(i.id_inscripcion) AS cuposocupados
      FROM crear_asesoria c
      LEFT JOIN inscripciones i 
        ON c.id_crear_asesoria = i.id_crear_asesoria
      GROUP BY c.id_crear_asesoria
      ORDER BY c.fecha ASC
    `

    const result = await pool.query(query)
    res.json(result.rows)

  } catch (error) {
    console.error("Error al obtener asesorías:", error)
    res.status(500).json({ error: "Error al obtener asesorías" })
  }
})


app.post("/asesorias", async (req, res) => {
  try {
    const { id_crear_asesoria, usuarios_id_usuario, titulo, descripcion, fecha, horario, cupo } = req.body
    await pool.query(
      `INSERT INTO crear_asesoria (id_crear_asesoria, usuarios_id_usuario, titulo, descripcion, fecha, horario, cupo, cuposocupados)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0)`,
      [id_crear_asesoria, usuarios_id_usuario, titulo, descripcion, fecha, horario, cupo],
    )
    res.status(201).json({ message: "Asesoría creada correctamente" })
  } catch (error) {
    console.error("Error al crear asesoría:", error)
    res.status(500).json({ error: "Error al crear asesoría" })
  }
})

app.put("/asesorias/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, descripcion, fecha, horario, cupo } = req.body
    await pool.query(
      `UPDATE crear_asesoria 
       SET titulo=$1, descripcion=$2, fecha=$3, horario=$4, cupo=$5 
       WHERE id_crear_asesoria=$6`,
      [titulo, descripcion, fecha, horario, cupo, id],
    )
    res.json({ message: "Asesoría actualizada correctamente" })
  } catch (error) {
    console.error("Error al editar asesoría:", error)
    res.status(500).json({ error: "Error al editar asesoría" })
  }
})

app.delete("/asesorias/:id", async (req, res) => {
  try {
    const { id } = req.params
    await pool.query("DELETE FROM crear_asesoria WHERE id_crear_asesoria = $1", [id])
    res.json({ message: "Asesoría cancelada correctamente" })
  } catch (error) {
    console.error("Error al cancelar asesoría:", error)
    res.status(500).json({ error: "Error al cancelar asesoría" })
  }
})

app.get("/asesorias/:id/inscritos", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT 
         u.id_usuario, 
         u.nombres, 
         u.apellidos, 
         u.correo, 
         i.fecha_inscripcion
       FROM inscripciones i
       INNER JOIN usuarios u ON u.id_usuario = i.id_usuario
       WHERE i.id_crear_asesoria = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      console.log("No se encontraron inscritos para la asesoría:", id)
    }

    res.json(result.rows)
  } catch (error) {
    console.error("Error al obtener inscritos:", error)
    res.status(500).json({ error: "Error al obtener inscritos" })
  }
})

// ============================
// 👩‍🎓 Asesorías visibles para alumnos
// ============================
app.get("/alumno/asesorias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM crear_asesoria ORDER BY fecha ASC")
    res.json(result.rows)
  } catch (error) {
    console.error("Error al obtener asesorías para alumno:", error)
    res.status(500).json({ error: "Error al obtener asesorías" })
  }
})

// ============================
// 🧾 Tabla INSCRIPCIONES
// ============================

app.get("/inscripciones/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params
    const result = await pool.query(
      `SELECT i.id_inscripcion, i.fecha_inscripcion, c.titulo, c.descripcion, c.fecha, c.horario 
       FROM inscripciones i
       JOIN crear_asesoria c ON i.id_crear_asesoria = c.id_crear_asesoria
       WHERE i.id_usuario = $1`,
      [id_usuario],
    )
    res.json(result.rows)
  } catch (error) {
    console.error("Error al obtener inscripciones:", error)
    res.status(500).json({ error: "Error al obtener inscripciones" })
  }
})

app.post("/inscribir", async (req, res) => {
  const { id_usuario, id_crear_asesoria } = req.body;

  try {
    const asesoriaResult = await pool.query(
      "SELECT cupo, cuposocupados FROM crear_asesoria WHERE id_crear_asesoria = $1",
      [id_crear_asesoria]
    );

    if (asesoriaResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Asesoría no encontrada" });
    }

    // Convertir NUMERIC a Number
    const cupo = Number(asesoriaResult.rows[0].cupo);
    const ocupados = Number(asesoriaResult.rows[0].cuposocupados);

    console.log("→ CUPOS:", ocupados, "/", cupo);

    const existe = await pool.query(
      "SELECT * FROM inscripciones WHERE id_usuario = $1 AND id_crear_asesoria = $2",
      [id_usuario, id_crear_asesoria]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ success: false, error: "Ya estás inscrito en esta asesoría" });
    }

    if (ocupados >= cupo) {
      return res.status(400).json({ success: false, error: "cupo lleno" });
    }

    await pool.query(
      "INSERT INTO inscripciones (id_usuario, id_crear_asesoria, fecha_inscripcion) VALUES ($1, $2, NOW())",
      [id_usuario, id_crear_asesoria]
    );

    await pool.query(
      "UPDATE crear_asesoria SET cuposocupados = cuposocupados + 1 WHERE id_crear_asesoria = $1",
      [id_crear_asesoria]
    );

    res.json({ success: true, message: "Inscripción realizada correctamente" });
  } catch (error) {
    console.error("❌ Error en /inscribir:", error);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

app.delete("/inscripciones/:id_usuario/:id_crear_asesoria", async (req, res) => {
  try {
    const { id_usuario, id_crear_asesoria } = req.params;

    // Obtener la inscripción
    const inscripcion = await pool.query(
      "SELECT * FROM inscripciones WHERE id_usuario = $1 AND id_crear_asesoria = $2",
      [id_usuario, id_crear_asesoria]
    );

    if (inscripcion.rows.length === 0) {
      return res.status(404).json({ error: "Inscripción no encontrada" });
    }

    // Eliminar inscripción
    await pool.query(
      "DELETE FROM inscripciones WHERE id_usuario = $1 AND id_crear_asesoria = $2",
      [id_usuario, id_crear_asesoria]
    );

    // Decrementar cupos ocupados
    await pool.query(
      "UPDATE crear_asesoria SET cuposocupados = cuposocupados - 1 WHERE id_crear_asesoria = $1",
      [id_crear_asesoria]
    );

    res.json({ message: "Estudiante removido correctamente" });
  } catch (error) {
    console.error("Error al remover estudiante:", error);
    res.status(500).json({ error: "Error al remover estudiante" });
  }
});

// ============================
// 📋 USUARIOS CON ROLES
// ============================
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS nombre,
        r.descripcion AS tipo,
        u.correo AS email,
        u.id_usuario AS numeroControl,
        u.roles_id_rol
      FROM usuarios u
      JOIN roles r ON u.roles_id_rol = r.id_rol
      ORDER BY u.nombres ASC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error)
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
})

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, numeroControl } = req.body

    const nombreParts = nombre.trim().split(" ")
    const nombres = nombreParts.slice(0, Math.ceil(nombreParts.length / 2)).join(" ")
    const apellidos = nombreParts.slice(Math.ceil(nombreParts.length / 2)).join(" ")

    await pool.query(
      `UPDATE usuarios 
       SET nombres = $1, apellidos = $2, correo = $3
       WHERE id_usuario = $4`,
      [nombres, apellidos, email, id],
    )

    res.json({ message: "Usuario actualizado correctamente" })
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error)
    res.status(500).json({ error: "Error al actualizar usuario" })
  }
})

app.put("/usuarios/:id/rol", async (req, res) => {
  try {
    const { id } = req.params
    const { rol } = req.body

    await pool.query(
      `UPDATE usuarios 
       SET roles_id_rol = $1
       WHERE id_usuario = $2`,
      [rol, id],
    )

    res.json({ message: "Rol actualizado correctamente" })
  } catch (error) {
    console.error("❌ Error al actualizar rol:", error)
    res.status(500).json({ error: "Error al actualizar rol" })
  }
})

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params
    
    await pool.query(
      `DELETE FROM usuarios WHERE id_usuario = $1`,
      [id]
    )

    res.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error)
    res.status(500).json({ error: "Error al eliminar usuario" })
  }
})

// ============================
// 📦 CRUD: CATEGORÍAS Y MATERIALES
// ============================

app.get("/categorias", async (req, res) => {
  try {
    console.log("[v0 Server] GET /categorias - Consultando BD...");
    const result = await pool.query("SELECT id_categoria, descripcion FROM categoria ORDER BY descripcion ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("[v0 Server] Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías: " + error.message });
  }
});

//inventario (cambiar desc por nombre)
app.get("/materiales", async (req, res) => {
  try {
    console.log("[v0 Server] GET /materiales - Consultando base de datos...")
    const result = await pool.query(`
  SELECT 
    m.id_materiales,
    m.nombre,
    c.descripcion AS categoria,
    m.cantidad_disponible,
    m.cantidad_daniados
  FROM materiales m
  JOIN categoria c ON m.categoria_id_categoria = c.id_categoria
  ORDER BY m.nombre ASC
`);


    console.log("[v0 Server] Materiales encontrados:", result.rows.length)
    res.json(result.rows)
  } catch (error) {
    console.error("[v0 Server] Error al obtener materiales:", error)
    res.status(500).json({ error: "Error al obtener materiales: " + error.message })
  }
})

app.get("/materiales", async (req, res) => {
  const { categoria, nombre } = req.query;

  let sql = "SELECT * FROM materiales WHERE 1=1";
  const params = [];

  if (categoria) {
    sql += " AND categoria_id_categoria = ?";
    params.push(categoria);
  }

  if (nombre) {
    sql += " AND LOWER(nombre) LIKE ?";
    params.push(`%${nombre.toLowerCase()}%`);
  }

  const [rows] = await db.query(sql, params);
  res.json(rows);
});


app.post("/materiales", async (req, res) => {
  try {
    console.log("[v0 Server] POST /materiales - Datos recibidos:", req.body)
    const { id_materiales, nombre, categoria_id_categoria } = req.body

    if (!id_materiales || !nombre || !categoria_id_categoria) {
      return res.status(400).json({ error: "Faltan datos obligatorios" })
    }

    const materialExist = await pool.query("SELECT * FROM materiales WHERE id_materiales = $1", [id_materiales])

    if (materialExist.rows.length > 0) {
      return res.status(400).json({ error: "El código de material ya existe" })
    }

    await pool.query(
      `INSERT INTO materiales (id_materiales, nombre, categoria_id_categoria, cantidad_disponible, cantidad_daniados)
       VALUES ($1, $2, $3, 0, 0)`,
      [id_materiales, nombre, categoria_id_categoria],
    )

    console.log("[v0 Server] Material agregado exitosamente")
    res.status(201).json({ message: "Material agregado correctamente" })
  } catch (error) {
    console.error("[v0 Server] Error al crear material:", error)
    res.status(500).json({ error: "Error al crear material: " + error.message })
  }
})

app.put("/materiales/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const result = await pool.query(
      `UPDATE materiales 
       SET cantidad_disponible = cantidad_disponible + $1
       WHERE id_materiales = $2
       RETURNING *`,
      [cantidad, id],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Material no encontrado" })
    }

    res.json({ message: "Cantidad actualizada correctamente", material: result.rows[0] })
  } catch (error) {
    console.error("Error al actualizar material:", error)
    res.status(500).json({ error: "Error al actualizar el material" })
  }
})

app.put("/materiales/editar/:id_materiales", async (req, res) => {
  try {
    const { id_materiales } = req.params
    const { nuevoNombre, categoria_id, cantidad_daniados, cantidad_disponible } = req.body

    console.log("[v0 Server] PUT /materiales/editar/:id_materiales", {
      id_materiales,
      nuevoNombre,
      categoria_id,
      cantidad_daniados,
      cantidad_disponible,
    })

    const result = await pool.query(
      `UPDATE materiales 
       SET nombre = $1, 
           categoria_id_categoria = $2, 
           cantidad_daniados = $3, 
           cantidad_disponible = $4
       WHERE id_materiales = $5
       RETURNING *`,
      [nuevoNombre, categoria_id, cantidad_daniados, cantidad_disponible, id_materiales],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Material no encontrado" })
    }

    console.log("[v0 Server] Material actualizado exitosamente:", result.rows[0])
    res.json({ message: "Material actualizado exitosamente", material: result.rows[0] })
  } catch (error) {
    console.error("[v0 Server] Error al actualizar material:", error)
    res.status(500).json({ error: "Error al actualizar material: " + error.message })
  }
})

app.post("/materiales/multiples", async (req, res) => {
  try {
    const materiales = req.body.materiales

    if (!materiales || materiales.length === 0) {
      return res.status(400).json({ error: "No se recibieron materiales" })
    }

    for (const mat of materiales) {
      const { id_materiales, nombre, categoria_id_categoria } = mat

      if (!id_materiales || !nombre || !categoria_id_categoria) {
        return res.status(400).json({ error: "Faltan datos obligatorios" })
      }

      const materialExist = await pool.query("SELECT * FROM materiales WHERE id_materiales = $1", [id_materiales])

      if (materialExist.rows.length > 0) {
        continue
      }

      await pool.query(
        `INSERT INTO materiales 
          (id_materiales, nombre, categoria_id_categoria, cantidad_disponible, cantidad_daniados)
         VALUES ($1, $2, $3, 0, 0)`,
        [id_materiales, nombre, categoria_id_categoria],
      )
    }

    res.json({ success: true, message: "Materiales guardados correctamente" })
  } catch (error) {
    console.error("Error al guardar múltiples materiales:", error)
    res.status(500).json({ error: error.message })
  }
})


//BOTONES DEL CRUD DE CATEGORIAS
// GET todas las categorías
app.get("/categorias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categoria ORDER BY id_categoria");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// POST nueva categoría
app.post("/categorias", async (req, res) => {
  const { descripcion } = req.body;

  try {
    // Generar ID autoincremental manual (último ID + 1)
    const resultId = await pool.query("SELECT COALESCE(MAX(CAST(id_categoria AS INTEGER)), 0) + 1 AS nuevo_id FROM categoria");
    const id_categoria = resultId.rows[0].nuevo_id.toString();

    // Guardar en la BD
    const result = await pool.query(
      "INSERT INTO categoria (id_categoria, descripcion) VALUES ($1, $2) RETURNING *",
      [id_categoria, descripcion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    res.status(500).json({ error: "Error al agregar categoría" });
  }
});

// EDITAR categoría
// EDITAR categoría
app.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;

  if (!descripcion || descripcion.trim() === "") {
    return res.status(400).json({ error: "La descripción no puede estar vacía" });
  }

  try {
    const query = `
      UPDATE categoria
      SET descripcion = $1
      WHERE id_categoria = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [descripcion.trim(), id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});


// DELETE categoría
app.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categoria WHERE id_categoria = $1", [id]);
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

//app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
//creo hasta aqui y luego aqui ya empiezan los vales

// ============================
// 📋 VALES DE PRÉSTAMO
// ============================

app.post("/vales-prestamo", async (req, res) => {
  try {
const { id_usuario, materiales, hora_entrega, motivo, docente } = req.body;

    if (!id_usuario || !materiales || materiales.length === 0) {
      return res.status(400).json({ error: "Datos incompletos para crear el vale" });
    }

    // 🔢 Obtener último número de vale registrado
    const resultado = await pool.query(`
  SELECT id_vales
FROM vales_prestamos
WHERE id_vales ~ '^VALE[0-9]+$'
ORDER BY CAST(SUBSTRING(id_vales FROM 5) AS INTEGER) DESC
LIMIT 1
    `);

    let nuevoNumero = 1;

    if (resultado.rows.length > 0) {
      // Extraer número (por ejemplo, de "VALE007" → 7)
      const ultimoVale = resultado.rows[0].id_vales;
      const numero = parseInt(ultimoVale.replace("VALE", ""), 10);
      nuevoNumero = numero + 1;
    }

    // Crear nuevo ID con formato VALE###
    const idVale = `VALE${nuevoNumero.toString().padStart(3, "0")}`;
    const estadoId = "E01";
    const horaEntrega = new Date().toLocaleTimeString("en-GB");

    // Insertar vale en la base de datos
    await pool.query(
      `
      INSERT INTO vales_prestamos 
  (id_vales, usuarios_id_usuario, estado_id_estado, hora_entrega, motivo, docente)
VALUES ($1, $2, $3, $4::time, COALESCE($5::varchar, ''), COALESCE($6::varchar, ''))

      `,
      [
  idVale,
  id_usuario,
  estadoId,
  horaEntrega,
  motivo?.toString() || "",
  docente?.toString() || ""
]
    );

    // Insertar materiales asociados al vale
    for (const material of materiales) {
      const cantidad = Number.parseFloat(material.cantidad) || 0;

      if (!material.id_materiales) {
        console.warn("Material sin id_materiales:", material);
        continue;
      }

      await pool.query(
        `
        INSERT INTO vales_has_materiales 
          (vales_prestamos_id_vales, materiales_id_materiales, cantidad)
        VALUES ($1, $2, $3)
        `,
        [idVale, material.id_materiales, cantidad]
      );
    }

    res.json({ success: true, message: "Vale registrado correctamente", id_vales: idVale });
  } catch (err) {
    console.error("Error al registrar vale:", err);
    res.status(500).json({ error: "Error al registrar el vale: " + err.message });
  }
});

//para que se seleccione el docente en el vale
// 📚 Obtener todos los docentes (usuarios con rol 2)
app.get("/docentes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_usuario, (nombres || ' ' || apellidos) AS nombre_completo
      FROM usuarios
      WHERE roles_id_rol = '2'
      ORDER BY nombres
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener docentes:", err);
    res.status(500).json({ error: "Error al obtener docentes" });
  }
});

// 👤 Obtener usuario con su carrera
app.get("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        u.id_usuario, 
        (u.nombres || ' ' || u.apellidos) AS nombre_completo,
        c.descripcion as carrera
      FROM usuarios u
      JOIN carreras c ON u.carreras_id_carreras = c.id_carreras
      WHERE u.id_usuario = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

//vales en la pantalla del alumno
app.get("/vales-prestamo/usuario/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params
    const result = await pool.query(
      `SELECT v.id_vales, v.hora_entrega, v.hora_devolucion, e.descripcion AS estado, v.motivo,
              STRING_AGG(m.nombre, ', ') AS materiales
       FROM vales_prestamos v
       LEFT JOIN vales_has_materiales vh ON v.id_vales = vh.vales_prestamos_id_vales
       LEFT JOIN materiales m ON vh.materiales_id_materiales = m.id_materiales
       LEFT JOIN estado e ON v.estado_id_estado = e.id_estado
       WHERE v.usuarios_id_usuario = $1
       GROUP BY v.id_vales, e.descripcion
       ORDER BY v.hora_entrega DESC`,
      [id_usuario],
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error al obtener vales de préstamo:", error)
    res.status(500).json({ error: "Error al obtener vales de préstamo: " + error.message })
  }
})

//devolver vale del alumno
// Endpoint para marcar material como devuelto
app.put("/vales-prestamo/:id_vales/devolver", async (req, res) => {
  try {
    const { id_vales } = req.params
    
    // Verificar que el vale existe y está en estado Aceptado (E02)
    const checkResult = await pool.query(
      `SELECT estado_id_estado FROM vales_prestamos WHERE id_vales = $1`,
      [id_vales]
    )
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Vale no encontrado" })
    }
    
    if (checkResult.rows[0].estado_id_estado !== 'E02') {
      return res.status(400).json({ error: "Solo se pueden devolver materiales aceptados" })
    }
    
    // Actualizar el estado a Devuelto (asumiendo que E03 o similar es el estado Devuelto)
    // Ajusta 'E03' según tu base de datos
    const result = await pool.query(
      `UPDATE vales_prestamos 
       SET estado_id_estado = 'E04', hora_devolucion = NOW()
       WHERE id_vales = $1
       RETURNING *`,
      [id_vales]
    )
    
    res.json({ success: true, vale: result.rows[0] })
  } catch (error) {
    console.error("Error al devolver material:", error)
    res.status(500).json({ error: "Error al devolver material: " + error.message })
  }
})

// Codigos para la parte de solicitudes en la pantalla del administrador

// 1. GET - Obtener todas las solicitudes pendientes con los datos de la consulta
app.get("/solicitudes-prestamo", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")

  try {
    const estado = req.query.estado || "E01"

    const query = `
      SELECT 
        (u.nombres || ' ' || u.apellidos) as nombre,
        u.id_usuario,
        COALESCE(m.nombre, 'Sin especificar') as nombre_material,
        vp.hora_entrega,
        vp.hora_devolucion,
        vp.motivo,
        vp.docente,
        vm.cantidad,
        e.descripcion,
        vp.id_vales
      FROM usuarios u
      JOIN vales_prestamos vp ON vp.usuarios_id_usuario = u.id_usuario
      JOIN vales_has_materiales vm ON vm.vales_prestamos_id_vales = vp.id_vales
      LEFT JOIN materiales m ON vm.materiales_id_materiales = m.id_materiales
      JOIN estado e ON e.id_estado = vp.estado_id_estado
      WHERE vp.estado_id_estado = $1
    `

    const result = await pool.query(query, [estado])
    console.log("[v0 Server] Datos retornados (estado: " + estado + "):", result.rows)
    res.json(result.rows)
  } catch (error) {
    console.error("[Error al obtener solicitudes:", error)
    res.status(500).json({ error: error.message })
  }
})

//aprobar, de e01 a e02
app.put("/solicitudes-prestamo/:id/aprobar", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")

  try {
    const { id } = req.params

    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "ID de solicitud inválido",
      })
    }

    console.log("[v0 Server] Aprobando solicitud:", id)

    // Actualizar cantidad_disponible de materiales al restar la cantidad prestada
    const updateMaterialesQuery = `
      UPDATE materiales m
      SET cantidad_disponible = cantidad_disponible - vm.cantidad
      FROM vales_has_materiales vm
      WHERE vm.materiales_id_materiales = m.id_materiales
      AND vm.vales_prestamos_id_vales = $1
    `
    await pool.query(updateMaterialesQuery, [id])

    // Actualizar estado del vale
    const query = `
      UPDATE vales_prestamos
      SET estado_id_estado = 'E02'
      WHERE id_vales = $1
      RETURNING id_vales
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Solicitud no encontrada",
      })
    }

    console.log("[v0 Server] Solicitud aprobada:", id)
    res.json({
      success: true,
      message: "Solicitud aprobada exitosamente",
      id: id,
    })
  } catch (error) {
    console.error("[Error al aprobar solicitud:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

//rechazar , de e01 a e03
app.put("/solicitudes-prestamo/:id/rechazar", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")

  try {
    const { id } = req.params

    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "ID de solicitud inválido",
      })
    }

    console.log("[v0 Server] Rechazando solicitud:", id)

    const query = `
      UPDATE vales_prestamos
      SET estado_id_estado = 'E03'
      WHERE id_vales = $1
      RETURNING id_vales
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Solicitud no encontrada",
      })
    }

    console.log("[v0 Server] Solicitud rechazada (devuelta):", id)
    res.json({
      success: true,
      message: "Solicitud devuelta exitosamente",
      id: id,
    })
  } catch (error) {
    console.error("[Error al rechazar solicitud:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

//finalizar, de e04 a e05
app.put("/solicitudes-prestamo/:id/finalizar", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")

  try {
    const { id } = req.params

    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "ID de solicitud inválido",
      })
    }

    console.log("[v0 Server] Finalizando solicitud:", id)

    const query = `
      UPDATE vales_prestamos 
      SET estado_id_estado = 'E05' 
      WHERE id_vales = $1
      RETURNING id_vales
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Solicitud no encontrada",
      })
    }

    console.log("[v0 Server] Solicitud finalizada:", id)
    res.json({
      success: true,
      message: "Solicitud finalizada exitosamente",
      id: id,
    })
  } catch (error) {
    console.error("[Error al finalizar solicitud:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})


//reportes

// 🔹 Reporte: Material Disponible
app.get('/reporte/material-disponible', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.nombre, 
        c.descripcion AS categoria, 
        m.cantidad_disponible AS cantidad
      FROM materiales m
      JOIN categoria c ON m.categoria_id_categoria = c.id_categoria
      WHERE COALESCE(m.cantidad_disponible, 0) > 0;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener materiales disponibles');
  }
});


app.get('/reporte/inventario', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.nombre, 
        c.descripcion AS categoria, 
        (COALESCE(m.cantidad_disponible, 0) + COALESCE(m.cantidad_daniados, 0)) AS cantidad
      FROM materiales m
      JOIN categoria c ON m.categoria_id_categoria = c.id_categoria;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener inventario completo');
  }
});



// 🔹 Reporte: Material Dañado
app.get('/reporte/material-danado', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.nombre, 
        c.descripcion AS categoria, 
        m.cantidad_daniados AS cantidad
      FROM materiales m
      JOIN categoria c ON m.categoria_id_categoria = c.id_categoria
      WHERE m.cantidad_daniados > 0 OR m.estado = 'Dañado';
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener materiales dañados');
  }
});

// ✅ Reporte: Carreras con Mayor Visita
app.get('/reporte/carreras-visitas', async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT 
    c.descripcion AS nombre,
    'Carrera' AS categoria,
    COUNT(u.id_usuario) AS cantidad
FROM carreras c
LEFT JOIN usuarios u ON u.carreras_id_carreras = c.id_carreras
GROUP BY c.descripcion
ORDER BY cantidad DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener reporte de visitas');
  }
});





// ============================
// 🚀 Iniciar servidor
// ============================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

