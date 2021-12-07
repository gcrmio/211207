const {Pool, Client} = require('pg');

const pool = new Pool({
    host: process.env.PG_host,
    user: process.env.PG_user,
    password: process.env.PG_password,
    database: process.env.PG_database,
    port: process.env.PG_port,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports.viewStatus = function(req, res){
    let query = `SELECT 
	                test_gsal01mt.PRTNRID PARTNER_ID,
	                test_gprt01mt.PRTNRNM PARTNER_NAME,
	                COUNT(CSTMSEQ) "TTL",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.CSTMGRADECD='TWL0004'), 0) "TTL_SnowDiamond",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.regdate='2021-11-07' AND test_gsal01mt.CSTMGRADECD='TWL0004'), 0) "20_SnowDiamond",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.CSTMGRADECD='TWL0003'), 0) "TTL_SnowCrystal",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.regdate='2021-11-07' AND test_gsal01mt.CSTMGRADECD='TWL0003'), 0) "20_SnowCrystal",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.CSTMGRADECD='TWL0002'), 0) "TTL_SnowWater",
	                COALESCE( COUNT(CSTMSEQ) FILTER(WHERE test_gsal01mt.regdate='2021-11-07' AND test_gsal01mt.CSTMGRADECD='TWL0002'), 0) "20_SnowWater"
                FROM test_gsal01mt 
                LEFT JOIN test_gprt01mt ON test_gsal01mt.PRTNRID = test_gprt01mt.PRTNRID 
                WHERE test_gsal01mt.SALORGCD = 'TW10' AND test_gsal01mt.SALOFFCD = 'TW10'
                GROUP BY PARTNER_ID, PARTNER_NAME
                ORDER BY COUNT(CSTMSEQ) DESC`;

    pool.query(query, (err, result) => {
        if(err){
            console.log('query error: '+err);
            res.status(404);
        }
        console.log(result.rows);
        return res.status(200).json(JSON.stringify(result.rows))
    })
    res.status(200);
}