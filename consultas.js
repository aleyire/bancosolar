const { Client } = require("pg")

const pool = new Client({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const consultarUsuario = async () => {
  try {
      await pool.connect()
    const result = await pool.query("SELECT * FROM usuarios") 
    pool.end()
    return result
  } catch (error) {
    console.log(error)
  }
}

const eliminarUsuario = async (id) => {
  try {
    const consulta = {
        text: `DELETE FROM usuarios WHERE id = $1`,
        values: [id],
      }
    const result = await pool.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
    return error
  }
}

const insertarUsuario = async (datos) => {
  const consulta = {
    text: "INSERT INTO usuarios (nombre, balance) values($1, $2)",
    values: datos,
  }
  try {
    const result = await pool.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

const editarUsuario = async (datos, id) => {
  const consulta = {
    text: `UPDATE usuarios SET
      nombre = $1,
      balance = $2
      WHERE id = $3 RETURNING *`,
    values: [...datos, id],
  }
  try {
    const result = await pool.query(consulta)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  consultarUsuario,
  eliminarUsuario,
  insertarUsuario,
  editarUsuario,
}
