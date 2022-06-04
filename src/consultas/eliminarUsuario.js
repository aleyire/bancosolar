const cliente = require("./cliente")

const eliminarUsuario = async (id) => {
  const client = await cliente()
  try {
    await client.query("BEGIN")
    const emisor = {
      name: "emisor",
      text: `DELETE FROM transferencias WHERE emisor = $1 RETURNING *`,
      values: [id],
    }
    const receptor = {
      name: "receptor",
      text: `DELETE FROM transferencias WHERE receptor = $1 RETURNING *`,
      values: [id],
    }
    const consulta = {
      name: "consulta",
      text: `DELETE FROM usuarios WHERE id = $1 RETURNING *`,
      values: [id],
    }
    await client.query("COMMIT")
    const result = await client.query(consulta)
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.log(error.code)
    return error
  }
}

module.exports = eliminarUsuario
