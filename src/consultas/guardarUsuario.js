const cliente = require("./cliente")


const guardarUsuario = async (datos) => {
  const client = await cliente()
  console.log('guardarUsuario')
  try {
    const values = Object.values(datos)
    const consulta = {
      text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
      values,
    }
    
    const result = await client.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = guardarUsuario
