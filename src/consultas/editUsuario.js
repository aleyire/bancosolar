const cliente = require("./cliente")

const editUsuario = async (datos, id) => {
  const client = await cliente()
  try {
    const consulta = {
      text: `UPDATE usuarios SET
        nombre = $1,
        balance = $2
        WHERE id = $3 RETURNING *`,
      values: [...datos, id],
    }    
    const result = await client.query(consulta)
    console.log(result)
    return result
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = editUsuario
