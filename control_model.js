const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'pinoespino',
  port: 5432,
});

const getFiguritasJugador = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM "Jugadores" ORDER BY "IDpais" ASC',
      (error, results) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(results.rows);
        }
      });
  })
}

const getFiguritasExtras = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM "FiguritasExtras" ORDER BY "IDfig" ASC',
      (error, results) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(results.rows);
        }
      })
  })
}

const getEsaEstaRegistrada = (body) => {
  return new Promise(function (resolve, reject) {
    const { idPais } = body
    console.log("paso este parametro", idPais);
    pool.query(' SELECT "Numero_fig" FROM ( SELECT "Numero" FROM "Jugadores" where "IDpais" = $1 ) AS "b" RIGHT JOIN "NumerosContr" ON "NumerosContr"."Numero_fig" = "b"."Numero" WHERE "b"."Numero" IS NULL ',
      [idPais],
      (error, results) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(results.rows);
        }
      })
  })
}

const createJugador = (body) => {
  return new Promise(function (resolve, reject) {
    const { IDpais, Numero, Nombre, Posicion, FechaNacimiento, Debut, Peso, Altura, Club, Cantijuga } = body
    console.log(body);
    pool.query('INSERT INTO "Jugadores" ("IDpais", "Numero", "Nombre", "Posicion", "FechaNacimiento", "Debut", "Peso", "Altura", "Club", "Cantijuga" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [IDpais, Numero, Nombre, Posicion, FechaNacimiento, Debut, Peso, Altura, Club, Cantijuga],
      (error, results) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(`Un nuevo jugador a sido ingresado: ${results.rows[0]}`)

        }
      })
  })
}

const createFigExtras = (body) => {
  return new Promise(function (resolve, reject) {
    const { IDfig, NumEX, Tipo, Descri, cantiextra } = body
    console.log(body);
    pool.query('INSERT INTO "FiguritasExtras" ("IDfig", "NumEX", "Tipo", "Descri", "cantiextra") VALUES ($1, $2, $3, $4, $6) RETURNING *',
      [IDfig, NumEX, Tipo, Descri, cantiextra], (error, results) => {
        if (error) {
          reject(error.message)
        }
        else
          resolve(`Una figurita extra a sido ingresada: ${results.rows[0]}`)
      })
  })
}

/*const CantJugadoresPais = (body) => {
  return new Promise(function (resolve, reject) {
    const { noVacio } = body
    pool.query(' SELECT COUNT (Numero) "IDpais" FROM "Jugadores" HAVING COUNT (Numero) > 0', 
      [noVacio], (error, results) => {
      if (error) {
        reject(error.message)
      }
      else
        resolve(`Una figurita extra a sido ingresada: ${results.rows[0]}`)
    })
  })
}*/


module.exports = { getFiguritasJugador, getFiguritasExtras, getEsaEstaRegistrada, createJugador, createFigExtras, CantJugadoresPais }