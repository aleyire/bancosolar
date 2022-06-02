const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})
const eliminarUsuario = async (id) => {
  pool.connect(async (_errorConexion, client, release) => {
    try {
      const consulta = {
        text: `DELETE FROM usuarios WHERE id = $1`,
        values: [id],
      }
      const result = await client.query(consulta)
      return result.rows
    } catch (error) {
      console.log(error.code)
    }
    release()
    pool.end()
  })
}

module.exports = eliminarUsuario
