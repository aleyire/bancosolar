const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const getUsuarios = async () => {
  pool.connect(async (_errorConexion, client, release) => {
  try {
    const result = await client.query("SELECT * FROM usuarios")
    return result.rows
  } catch (error) {
    console.log(error.code)
  }
  release()
  pool.end()
})
}

module.exports = getUsuarios
