const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const guardarUsuario = async (datos) => {
  pool.connect(async (_errorConexion, client, release) => {
    const values = Object.values(datos)
    const consulta = {
      text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
      values,
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

module.exports = guardarUsuario
