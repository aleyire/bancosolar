const cliente = require('./cliente')

const getUsuarios = async () => {
  const client = await cliente()
  try {
    const consulta = {
      text: `SELECT * FROM usuarios`,
    }

    const result = await client.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = getUsuarios
