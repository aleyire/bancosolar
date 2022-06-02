const http = require("http")
const fs = require("fs")
const url = require("url")
const { getUsuarios, eliminarUsuario, guardarUsuario, editUsuario, } = require("./consultas")
const { regTransferencias, getTransferencias } = require("./transferencias")

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html")
      fs.readFile("index.html", "utf8", (error, data) => {
        if (error) {
          res.statusCode = 500, 
          res.end()
        } else {
          res.setHeader("Content-Type", "text/html")
          res.write(data)
        }
      })
    }

    if (req.url == "/usuarios" && req.method === "GET") {
      try {
        const usuarios = await getUsuarios()
        res.end(JSON.stringify(usuarios))
      } catch (error) {
        res.statusCode = 500
        res.end("ocurrió un problema en el servidor..." + error)
      }
    }

    if (req.url.startsWith("/usuario?id") && req.method === "DELETE") {
      try {
        const { id } = url.parse(req.url, true).query
        await eliminarUsuario(id)
        res.end("usuario eliminado")
      } catch (error) {
        res.statusCode = 500
        res.end("ocurrió un problema en el servidor..." + error)
      }
    }

    if (req.url == "/usuario" && req.method === "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const datos = JSON.parse(body)
        try {
          const respuesta = await guardarUsuario(datos)
          res.writeHead(201, { "Content-Type": "application/json" })
          res.end(JSON.stringify(respuesta))
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(
            JSON.stringify("ocurrió un problema en le servidor..." + error)
          )
        }
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
        try {
          const respuesta = await editUsuario(datos, id)
          res.statusCode = 200
          res.end(JSON.stringify(respuesta))
        } catch (error) {
          res.statusCode = 500
          res.end("ocurrió un problema en le servidor..." + error)
        }
      })
    }

    if (req.url == "/transferencia" && req.method === "POST") { // ruta para registrar transferencias
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        try {
          const transacciones = JSON.parse(body)
          const result = await regTransferencias(transacciones)
          res.statusCode = 201
          res.end(JSON.stringify(result))
        } catch (error) {
          res.statusCode = 500
          res.end("ocurrió un problema en el servidor..." + error)
        }
      })
    }

    if (req.url == "/transferencia" && req.method === "GET") { // ruta para mostrar los votos
      try {
        const consulta = await getTransferencias()
        res.end(JSON.stringify(consulta))
      } catch (error) {
        res.statusCode = 500
        res.end("ocurrió un problema en el servidor..." + error)
      }
    }
  })
  .listen(3000, console.log("server on"))
