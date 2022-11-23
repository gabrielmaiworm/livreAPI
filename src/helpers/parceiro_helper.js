const knex = require('../database')


function cleanPicturePath (path) {
  if (path.includes('\\"url"\\')) {
    const withoutBars = path.replaceAll('\\', '')
    const object = JSON.parse(withoutBars)
    return object.url
  }
}

function queryParceiros (nomeFantasia, razaoSocial) {
  const query = knex('Parceiro')

  return query
}

module.exports = {
  cleanPicturePath,
  queryParceiros
}
