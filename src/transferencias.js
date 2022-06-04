const cliente = require("./consultas/cliente")

const registrarTransferencias = async (t) => {

  const client = await cliente()
  try {
    await client.query("BEGIN")
    const descontar = {
      name: "descontar",
      text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
      values: [t.monto, t.emisor],
    }
    const descuento = await client.query(descontar)
    const acreditar = {
      name: "acreditar",
      text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
      values: [t.monto, t.receptor],
    }
    
 
    const acreditacion = await client.query(acreditar)
    const transacciones = {
      name: "transacciones", // el emisor y receptor hay que referenciarlos con el id
      text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, now()) RETURNING *",
      values: [t.emisor, t.receptor, t.monto],
    }
    const transaccion = await client.query(transacciones)
    console.log("Descuento realizado con éxito: ", descuento.rows[0])
    console.log("Acreditación realizada con éxito: ", acreditacion.rows[0])
    console.log("Transacción ingresada con éxito: ", transaccion.rows[0])

    await client.query("COMMIT")
    return transaccion.rows[0]
  } catch (error) {
    await client.query("ROLLBACK") 
    console.log("Error: ", error)
    throw error
  }
}

const getTransferencias = async () => {
  // imprimir las transferencias
  const client = await cliente()
  try {
    const consulta = {
      text: "SELECT t.fecha, u.nombre AS emisor, u_2.nombre AS receptor, t.monto FROM transferencias t INNER JOIN usuarios u ON t.emisor = u.id INNER JOIN usuarios AS u_2 ON t.receptor = u_2.id",
      rowMode: "array",
      values: [],
    }
    
    const result = await client.query(consulta)
    console.log(result.rows)
    return result.rows
  } catch (error) {
    console.log(error.code)
    return error
  }
}

module.exports = { registrarTransferencias, getTransferencias }
