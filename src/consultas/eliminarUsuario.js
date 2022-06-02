const cliente = require("./cliente")

const eliminarUsuario = async (id) => {
  try {
    const consulta = {
      text: `DELETE FROM usuarios WHERE id = $1`,
      values: [id],
    }
    const client = await cliente()
    const result = await client.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = eliminarUsuario
