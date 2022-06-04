const cliente = require("./cliente")


const guardarUsuario = async (datos) => {
  const client = await cliente()
  const values = Object.values(datos)
  try {
    const consulta = {
      text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
      values
    }
    const result = await client.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = guardarUsuario
