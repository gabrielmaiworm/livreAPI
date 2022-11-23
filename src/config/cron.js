const cron = require("node-cron");
const { verificarEquipamentosAtrasados } = require("../controllers/EstoqueController");

function verificarValidadeDeEquipamentosReservados() {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running the task");
    const equipamentosAtrasados = await verificarEquipamentosAtrasados();
    console.log(equipamentosAtrasados);
  });
}

module.exports = {
  verificarValidadeDeEquipamentosReservados,
};
