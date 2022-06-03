const cliente = require("./cliente")


const eliminarUsuario = async (id) => {
  const client = await cliente()
  console.log('eliminar')
  try {
    const consulta = {
      text: `DELETE FROM usuarios WHERE id = $1`,
      values: [id],
    }
    
    const result = await client.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = eliminarUsuario
