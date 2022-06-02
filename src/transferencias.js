const { Pool } = require("pg")
//const { Client} = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bancosolar",
  password: "alejandra",
  port: 5432,
})

const regTransferencias = async (pool, id, balance, id2, balance2, emisor, receptor, monto, fecha) => {
  await pool.connect(async (_errorConexion, client, release) => {
    try {
      await client.query("BEGIN")
      const descontar = {
        name: "descontar",
        text: "UPDATE usuarios SET balance = balance - $2 WHERE id = $1 RETURNING *",
        values: [id, balance],
      }
      const descuento = await client.query(descontar)

      const acreditar = {
        name: "acreditar",
        text: "UPDATE usuarios SET balance = balance + $2 WHERE id = $1 RETURNING *",
        values: [id2, balance2],
      }
      const acreditacion = await client.query(acreditar)
      const transacciones = {
        name: "transacciones",
        text: "INSERT INTO tranferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING *",
        values: [emisor, receptor, monto, fecha],
      }
      const transaccion = await client.query(transacciones)

      console.log("Descuento realizado con éxito: ", descuento.rows[0])
      console.log("Acreditación realizada con éxito: ", acreditacion.rows[0])
      console.log("Transacción ingresada con éxito: ", transaccion.rows[0])

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      console.log("Error: ", error)
    }
    release()
    pool.end()
  })
}

const getTransferencias = async () => {
  // imprimir las transferencias
  const consulta = {
    text: "SELECT * FROM transferencias",
    rowMode: "array",
    values,
  }
  try {
    const result = await pool.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = { regTransferencias, getTransferencias }

/*const regTransferencias = async (transferencia) => {
    const values = Object.values(transferencia)
    const registrarTransf = {
      text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4)",
      values: '',
    }
    const actualizarBalance = {
      text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
      values: [Number(values[1]), values[2]],
    }
    try {
      // transacciones
      await pool.query("BEGIN") // inicia la transaccion
      await pool.query(registrarTransf) // registra la transferencia en la tabla transferencias
      await pool.query(actualizarBalance) // modificar el balance
      await pool.query("COMMIT")
      return true
    } catch {
      await pool.query("ROLLBACK")
      console.log(error.code)
      throw error
    }
  }*/
