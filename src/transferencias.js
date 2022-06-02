const cliente = require("./consultas/cliente")

const regTransferencias = async (id, balance, id2, balance2, emisor, receptor, monto, fecha) => {
  try {
    await client.query("BEGIN")
    const descontar = {
      name: "descontar",
      text: "UPDATE usuarios SET balance = balance - $2 WHERE id = $1 RETURNING *",
      values: [id, balance],
    }
    const client = await cliente()
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
}

const getTransferencias = async () => {
  // imprimir las transferencias
  try {
    const consulta = {
      text: "SELECT * FROM transferencias",
      rowMode: "array",
      values,
    }
    const client = await cliente()
    const result = await client.query(consulta)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = { regTransferencias, getTransferencias }
