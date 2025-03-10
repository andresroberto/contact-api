const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a SQLite (crea la base de datos si no existe)
const db = new sqlite3.Database("./contacts.db", (err) => {
    if (err) {
        console.error("Error al conectar con SQLite", err.message);
    } else {
        console.log("Conectado a SQLite");
    }
});

// Obtener todos los contactos
app.get("/contacts", (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

// Obtener todas los ciudades
app.get("/cities", (req, res) => {
  db.all("SELECT * FROM cities", [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

// Agregar un nuevo contacto
app.post("/contacts", (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
      return res.status(400).json({ error: "Nombre y teléfono requeridos" });
  }
  const stmt = db.prepare("INSERT INTO contacts (name, phone) VALUES (?, ?)");
  stmt.run(name, phone, function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, phone });
  });
  stmt.finalize();
});

// Agregar una nueva ciudad
app.post("/cities", (req, res) => {
  const { name } = req.body;
  if (!name) {
      return res.status(400).json({ error: "Nombre requerido" });
  }
  const stmt = db.prepare("INSERT INTO cities (name) VALUES (?)");
  stmt.run(name, function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name });
  });
  stmt.finalize();
});

// Actualizar un contacto por ID
app.put("/contacts/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  db.run(
      "UPDATE contacts SET name = ?, phone = ? WHERE id = ?",
      [name, phone, id],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Contacto actualizado" });
      }
  );
});

// Eliminar un contacto por ID
app.delete("/contacts/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM contacts WHERE id = ?", id, function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Contacto eliminado" });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
