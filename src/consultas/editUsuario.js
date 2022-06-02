const cliente = require("./cliente")

const editUsuario = async (datos, id) => {
  try {
    const consulta = {
      text: `UPDATE usuarios SET
        nombre = $1,
        balance = $2
        WHERE id = $3 RETURNING *`,
      values: [...datos, id],
    }
    const client = await cliente()
    const result = await client.query(consulta)
    return result
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = editUsuario
