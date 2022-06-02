const http = require("http")
const fs = require("fs")
const url = require("url")
const getUsuarios = require("./consultas/getUsuarios")
const eliminarUsuario = require("./consultas/getUsuarios")
const guardarUsuario = require("./consultas/getUsuarios")
const editUsuario = require("./consultas/getUsuarios")
const { regTransferencias, getTransferencias } = require("./transferencias")

const main = async () => {
  const server = http.createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html")
      fs.readFile("index.html", "utf8", (error, data) => {
        if (error) {
          ;(res.statusCode = 500), res.end()
        } else {
          res.setHeader("Content-Type", "text/html")
          res.write(data)
        }
      })
    }

    if (req.url == "/usuarios" && req.method === "GET") {
      const usuarios = await getUsuarios()
      res.end(JSON.stringify(usuarios))
    }

    if (req.url.startsWith("/usuario?id") && req.method === "DELETE") {
      const { id } = url.parse(req.url, true).query
      await eliminarUsuario(id)
      res.end("usuario eliminado")
    }

    if (req.url == "/usuario" && req.method === "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const datos = JSON.parse(body)
        const respuesta = await guardarUsuario(datos)
        res.writeHead(201, { "Content-Type": "application/json" })
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url.startsWith("/usuario?id") && req.method === "PUT") {
      const { id } = url.parse(req.url, true).query
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await editUsuario(datos, id)
        res.statusCode = 200
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url == "/transferencia" && req.method === "POST") {
      // ruta para registrar transferencias
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const transacciones = JSON.parse(body)
        const result = await regTransferencias(transacciones)
        res.statusCode = 201
        res.end(JSON.stringify(result))
      })
    }

    if (req.url == "/transferencia" && req.method === "GET") {
      // ruta para mostrar los votos
      const consulta = await getTransferencias()
      res.end(JSON.stringify(consulta))
    }
  })
  server.listen(3000, console.log("server on"))
}
main()
