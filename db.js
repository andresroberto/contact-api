const sqlite3 = require("sqlite3").verbose();

// Conectar a la base de datos SQLite
const db = new sqlite3.Database("./contacts.db");

// Crear la tabla de contactos si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

console.log("Tabla de contactos verificada/creada");

// Crear la tabla de contactos si no existe
db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS cities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
      )
  `);
});

console.log("Tabla de ciudades verificada/creada");

// Cerrar la conexión
db.close();
