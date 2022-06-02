const cliente = require('./cliente')

const getUsuarios = async () => {
  try {
    const consulta = {
      text: `SELECT * FROM usuarios`,
    }
    const client = await cliente()
    const result = await client.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
  }
}

module.exports = getUsuarios
