module.exports = {
  development: {
    client:'pg',
    connection: {
      user : 'postgres',
      password : '040702',
      database : 'livrebd'
    },
    migrations:{
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    seeds:{
      directory: `${__dirname}/src/database/seeds`
    }
  }
};

// npx knex migrate:latest
// npx knex seed:run
