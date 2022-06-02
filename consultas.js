const { Pool } = require("pg")
//const { Client} = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const getUsuarios = async () => {
  await pool.connect(async (_errorConexion, client, release) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios")
    return result.rows
  } catch (error) {
    console.log(error.code)
  }
  release()
  pool.end()
})
}

const eliminarUsuario = async (id) => {
  try {
    const consulta = {
      text: `DELETE FROM usuarios WHERE id = $1`,
      values: [id],
    }
    const result = await pool.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

const guardarUsuario = async (datos) => {
  const values = Object.values(datos)
  const consulta = {
    text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
    values,
  }
  try {
    const result = await pool.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
    return error
  }
}

const editUsuario = async (datos, id) => {
  const consulta = {
    text: `UPDATE usuarios SET
      nombre = $1,
      balance = $2
      WHERE id = $3 RETURNING *`,
    values: [...datos, id],
  }
  try {
    const result = await pool.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = {
  getUsuarios,
  eliminarUsuario,
  guardarUsuario,
  editUsuario,
}

/* const consultarUsuario = async (pool) => {
  try {
    await pool.connect(async (_errorConexion, client, release) => {
      const SQLQuery = {
        name: "consultar",
        text: "SELECT * FROM usuarios",
        values,
      }
      const res = await client.query(SQLQuery, (error_consulta, res) => {
        if (error_consulta)
          return console.error(
            "error en la consulta, código:",
            error_consulta.code
          )
        else {
          console.log(res.rows)
        }
        release()
        pool.end()
      })
    })
  } catch (error) {
    console.log(error)
  }
}*/
