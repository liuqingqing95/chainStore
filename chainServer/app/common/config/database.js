const mysql = require("think-model-mysql");

module.exports = {
  handle: mysql,
  database: "chainstoredb",
  prefix: "chain_",
  encoding: "utf8mb4",
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "123456",
  dateStrings: true
};
//# sourceMappingURL=database.js.map