const { pool } = require('../config/db');
(async ()=>{
  try{
    console.log('Running ALTER TABLE cliente: MODIFY telefone to VARCHAR(20)');
    await pool.query("ALTER TABLE cliente MODIFY telefone VARCHAR(20) NOT NULL;");
    console.log('Modified telefone');
    console.log('Adding column senha');
    await pool.query("ALTER TABLE cliente ADD COLUMN senha VARCHAR(255) NULL AFTER telefone;");
    console.log('Added senha column');
  }catch(e){
    console.error('ERROR:', e.message);
  }finally{
    pool.end();
  }
})();
