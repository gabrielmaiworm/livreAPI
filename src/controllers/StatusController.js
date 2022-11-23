const knex = require('../database')
const schemaName = "public"

module.exports = {
  async index(req, res, next) {
    try{      
      const query = knex('Status').withSchema(schemaName) 
      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  }
}