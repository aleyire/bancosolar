const http = require("http")
const fs = require("fs")
const url = require("url")
const getUsuarios = require("./consultas/getUsuarios")
const eliminarUsuario = require("./consultas/getUsuarios")
const guardarUsuario = require("./consultas/getUsuarios")
const editUsuario = require("./consultas/getUsuarios")
const { registrarTransferencias, getTransferencias } = require("./transferencias")

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
      const usuarios = await getUsuarios()
      res.writeHead(201, { "Content-Type": "application/json" })
      res.end(JSON.stringify(usuarios))
    }

    if (req.url.startsWith("/usuario?") && req.method === "DELETE") {
      console.log('(req.url.startsWith("/usuario?") && req.method === "DELETE")')
      const { id } = url.parse(req.url, true).query
      const response = await eliminarUsuario(id)
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(response))
    }


    if (req.url == "/usuario" && req.method === "POST") {
      console.log('(req.url == "/usuario" && req.method === "POST")')
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await guardarUsuario(datos)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url.startsWith("/usuario?") && req.method === "PUT") {
      console.log('req.url.startsWith("/usuario?") && req.method === "PUT")')
      const { id } = url.parse(req.url, true).query
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const datos = JSON.parse(body)
        const respuesta = await editUsuario(datos, id)
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url == "/transferencia" && req.method === "POST") {
      console.log('(req.url == "/transferencia" && req.method === "POST")')
      // ruta para registrar transferencias
      let body = ""
      req.on("data", (chunk) => {
        body = chunk.toString()
      })
      req.on("end", async () => {
        const transacciones = JSON.parse(body)
        const result = await registrarTransferencias(transacciones)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(result))
      })
    }

    if (req.url == "/transferencias" && req.method === "GET") {
      console.log('(req.url == "/transferencias" && req.method === "GET")')
      // ruta para mostrar las transferencias
      const consulta = await getTransferencias()
      res.writeHead(201, { "Content-Type": "application/json" })
      res.end(JSON.stringify(consulta))
    }
  })
  .listen(3000, console.log("server on"))
