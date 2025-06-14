const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,


//   port: process.env.DB_PORT,
// });

const pool = new Pool({
  user: "carlamissiona",
  host: "ep-round-moon-a1obo7oq-pooler.ap-southeast-1.aws.neon.tech",
  database: "hvneon",
  password: "yhxjpBia4MA6",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

//postgresql://carlamissiona:yhxjpBia4MA6@ep-round-moon-a1obo7oq-pooler.ap-southeast-1.aws.neon.tech/hvneon?sslmode=require

// User CRUD Operations
const createUserDB = async (userData) => {
  const { name, email, hpassword, role = "user" } = userData;
  const query = `
    INSERT INTO nc_users (nc_details_user, nc_email,  nc_password, created_at) 
    VALUES ($1, $2, $3, NOW())
    RETURNING id,  created_at
  `;

  const details = `Name: ${name}, Role: ${role} `;
  const values = [details, email, hpassword];

  try {
    const result = await pool.query(query, values);
    console.log("DB results ");
    console.log(result);

    return result.rows[0];
  } catch (error) {
    console.log("error");
    console.log(error);
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const postArticle = async (postData) => {
  const { content, userid, draft_status, details } = postData;
  console.log("post micro user @@ postArticle");
  console.log(content);
  console.log(userid);
  const query = `
    INSERT INTO nc_articles(nc_subswriter, nc_content, nc_isdraft, nc_details_article,  nc_date_created) 
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;

  const values = [userid, content, draft_status, details];

  try {
    const result = await pool.query(query, values);
    console.log(" DB results postArticle");
    console.log(result);
    return result.rows[0];
  } catch (error) {
    console.log("error postArticle");
    console.log(error);
    throw new Error(`Error creating microblog: ${error.message}`);
  }
};

const postMicro = async (postData) => {
  const { message, user } = postData;
  console.log("post micro user");
  console.log(message);
  console.log(user);
  const query = `
    INSERT INTO nc_textbased(nc_user, nc_blog, nc_date_created) 
    VALUES ($1, $2, NOW())
    RETURNING *
  `;

  const values = [user, message];

  try {
    const result = await pool.query(query, values);
    // console.log(" DB results ");
    // console.log(result);
    return result.rows[0];
  } catch (error) {
    console.log("error");
    console.log(error);
    throw new Error(`Error creating microblog: ${error.message}`);
  }
};

const postUsersubs = async (post_data) => {
  const { email, val } = post_data;
  const query =
    "UPDATE nc_users SET nc_subs = COALESCE(nc_subs, '') || ',' || $1 WHERE nc_email = $2 RETURNING *;";
  const values = [val, email];

  try {
    const result2 = await pool.query(query, values);
  } catch (error) {
    console.log("Error @subs db", error);
    throw new Error(`Error creating subs: ${error.message}`);
  }

  console.log("id");

  // try {  const result2 = await pool.query(query, values);
  // const update = `
  //   UPDATE nc_user
  //   SET nc_subs = COALESCE(nc_subs, '') || ', ' || $2
  //   WHERE nc_email = $1
  //   RETURNING *;

  // `;
};

const postUserfriends = async (post_data) => {
  const { fremail, val } = post_data;
  const query =
    "UPDATE nc_users SET nc_friends = COALESCE(nc_friends, '') || ',' || $1 WHERE nc_email = $2 RETURNING *;";
  const values = [val, fremail];

  try {
    const result = await pool.query(query, values);
    console.log("result");
    console.log(result);
  } catch (error) {
    console.log("Error @subs db", error);
    throw new Error(`Error creating subs: ${error.message}`);
  }

  console.log("id");

  // try {  const result2 = await pool.query(query, values);
  // const update = `
  //   UPDATE nc_user
  //   SET nc_subs = COALESCE(nc_subs, '') || ', ' || $2
  //   WHERE nc_email = $1
  //   RETURNING *;

  // `;
};

const getUserByEmailDB = async (email) => {
  // console.log("@ getUserByEmailDB");
  const query = "SELECT * FROM nc_users WHERE nc_email = $1";

  try {
    const result = await pool.query(query, [email]);
    console.log("getUserByEmailDB");
    // console.log(result);
    return result.rows[0];
  } catch (error) {
    // console.log("error");
    console.log(error);
    throw new Error(`Error getting user by email: ${error.message}`);
  }
};

const getUserSubsByEmail = async (email) => {
  console.log("@ get articles articles");
  const query =
    "SELECT      a.*,      u.nc_email  FROM      nc_articles a JOIN (     SELECT          (unnest(string_to_array(nc_subs, ',')))::bigint AS subwriter_id     FROM          nc_users     WHERE          nc_email = $1 ) AS sub_ids      ON a.nc_subswriter = sub_ids.subwriter_id JOIN nc_users u      ON a.nc_subswriter = u.id; ";

  try {
    const result = await pool.query(query, [email]);

    console.log("result.rows[0]");
    console.log(result.rows.length);
    return result.rows;
  } catch (error) {
    console.log("error");
    console.log(error);
    throw new Error(`Error getting user  subs by email: ${error.message}`);
  }
};

const gefriendsById = async (id) => {
  const query =
    "SELECT nc_email as user_email, nc_friends as user_friends FROM nc_users WHERE id = $1";

  try {
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting friends by id: ${error.message}`);
  }
};

const getUserByIdDB = async (id) => {
  const query = "SELECT * FROM nc_users WHERE id = $1";

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting user by id: ${error.message}`);
  }
};

const updateUserDB = async (id, userData) => {
  const { name, email, password, role } = userData;
  const updates = [];
  const values = [];
  let valueCount = 1;

  if (name) {
    updates.push(`name = $${valueCount}`);
    values.push(name);
    valueCount++;
  }
  if (email) {
    updates.push(`email = $${valueCount}`);
    values.push(email);
    valueCount++;
  }
  if (password) {
    updates.push(`password = $${valueCount}`);
    values.push(password);
    valueCount++;
  }
  if (role) {
    updates.push(`role = $${valueCount}`);
    values.push(role);
    valueCount++;
  }

  values.push(id);
  const query = `
    UPDATE nc_users 
    SET ${updates.join(", ")}, updated_at = NOW()
    WHERE id = $${valueCount}
    RETURNING id, name, email, role, created_at, updated_at
  `;

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const deleteUserDB = async (id) => {
  const query = "DELETE FROM nc_users WHERE id = $1 RETURNING *";

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

const getSearchedchannels = async (data) => {
  const { searched } = data;
  let search = `'%Channel%:%${searched}%'`;

  const query = "SELECT * FROM nc_users WHERE nc_details_user ilike " + search;

  try {
    const result = await pool.query(query, []);

    return result.rows;
  } catch (error) {
    console.log("error");
    console.log(error);
    throw new Error(`Error getting search results: ${error.message}`);
  }
};

const getDrafts = async () => {

  const query = "select nc.*, pl.*  from  nc_processed_content nc , nc_process_logs pl  where pl.id in (select id from nc_process_logs where processor ='process-a') and pl.status = 'ongoing' and nc.plid in (select id from nc_process_logs where processor ='process-a') limit 1" ;
 
  try {
    const result = await pool.query(query);

    console.log(" @get drafts SELECT * FROM nc_process_log' ");
    console.log(result.rows);
    
    return result.rows;

  } catch (error) {
    console.log("error get drafts");
    console.log(error);
  }

};

const getSearchedfriends = async (data) => {
  const { searched } = data;
  let search = `'%"Name"%:%${searched}%'`;

  // todo add another search for last name and firstname separately searched
  const query = "SELECT * FROM nc_users WHERE nc_details_user ilike " + search;

  try {
    const result = await pool.query(query, []);

    return result.rows;
  } catch (error) {
    console.log("error");
    console.log(error);
    throw new Error(`Error getting search results: ${error.message}`);
  }
};

module.exports = {
  pool,
  createUserDB,
  getUserByEmailDB,
  getUserByIdDB,
  gefriendsById,
  updateUserDB,
  deleteUserDB,
  postMicro,
  postUsersubs,
  postUserfriends,
  getUserSubsByEmail,
  getSearchedchannels,
  getSearchedfriends,
  postArticle,
  getDrafts,
};
