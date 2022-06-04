const cliente = require("./cliente")


const eliminarUsuario = async (id) => {
  const client = await cliente()
  try {
    const consulta = {
      text: `DELETE FROM usuarios WHERE id = $1`,
      values: id,
    }
    
    const result = await client.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = eliminarUsuario
