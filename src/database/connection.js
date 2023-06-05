const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

async function fetchAll(query, ...params) {
    let client = await pool.connect()
    let {rows} = await client.query(query, params.length? params:null)
    return rows
}

async function fetch (query, ...params){
    let client = await pool.connect()
    let {rows:[value]} = await client.query(query, params.length? params:null)
    return value;
}

module.exports = {fetch,fetchAll}