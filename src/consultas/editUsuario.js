const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const editUsuario = async (datos, id) => {
  pool.connect(async (_errorConexion, client, release) => {
    const consulta = {
      text: `UPDATE usuarios SET
        nombre = $1,
        balance = $2
        WHERE id = $3 RETURNING *`,
      values: [...datos, id],
    }
    try {
      const result = await client.query(consulta)
      return result
    } catch (error) {
      console.log(error.code)
    }
    release()
    pool.end()
  })
}

module.exports = editUsuario
