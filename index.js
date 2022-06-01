const http = require("http")
const fs = require("fs")
const {
  consultarUsuario,
  eliminarUsuario,
  insertarUsuario,
  editarUsuario,
} = require("./consultas")
const url = require("url")

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html")
      const html = fs.readFileSync("index.html", "utf8")
      res.end(html)
    }

    if (req.url == "/usuarios" && req.method === "GET") {
      const usuario = await consultarUsuario()
      res.end(JSON.stringify(usuario.rows))
    }

    if (req.url.startsWith("/usuario?") && req.method === "DELETE") {
      const { id } = url.parse(req.url, true).query
      const respuesta = await eliminarUsuario({ id })
      res.end(JSON.stringify(respuesta))
    }

    if (req.url == "/usuario" && req.method === "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body = chunk
      })
      req.on("end", async () => {
        // usuarios:id,nombre,balance
        const bodyObject = JSON.parse(body)
        const datos = [bodyObject.nombre, bodyObject.balance]
        const respuesta = await insertarUsuario(datos)
        if (respuesta) {
          res.writeHead(201, { "Content-Type": "application/json" })
          res.end(JSON.stringify(respuesta))
        } else {
          res.writeHead(400, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Error al insertar usuario" }))
        }
      })
    }
    // transferencias:id,emisor,receptor,monto,fecha
    if (req.url.startsWith("/usuario?") && req.method === "PUT") {
      const { id } = url.parse(req.url, true).query
      let body = ""
      req.on("data", (chunk) => {
        body += chunk
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await editarUsuario(datos, id)
        res.end(JSON.stringify(respuesta))
      })
    }
  })
  .listen(3000, console.log("server on"))
