const db = require("../config/db");
const { v4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = function () {};

auth.login = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "select user_id, user_uuid, first_name, last_name, user_name, `password` from `user` where user_name=? and `status`='1' limit 1";
    
    console.log('🔍 Executing login query for user:', data.user);
    
    db.execute(sql, [data.user], (err, result) => {
      if (err) {
        console.error('💥 Database error during login:', err);
        return reject(err);
      }
      
      if (result.length === 1) {
        const user = result[0];
        console.log('🔍 User found, verifying password...');
        
        const isPasswordCorrect = bcryptjs.compareSync(
          data.password,
          user.password
        );
        
        if (isPasswordCorrect) {
          console.log('✅ Password correct, generating token...');
          const uuid = user.user_uuid;
          const name = user.first_name + " " + user.last_name;
          const jwt_key = process.env.JWT_SECRET_KEY;
          const token = jwt.sign(
            { id: user.user_id, uuid: uuid, user: name },
            jwt_key,
            {
              expiresIn: "15d",
            }
          );
          resolve({ token: token, data: { user: name } });
        } else {
          console.log('❌ Password incorrect');
          resolve(null);
        }
      } else {
        console.log('❌ User not found');
        resolve(null);
      }
    });
  });
};

auth.register = (data) => {
  return new Promise((resolve, reject) => {
    validate(data)
      .then(() => {
        const sql =
          "insert into `user` (user_uuid, first_name, last_name, gender, user_name, `password`) values (?,?,?,?,?,?)";
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(data.password, salt);
        const uuid = v4();
        
        console.log('🔍 Executing registration for user:', data.user_name);
        
        db.execute(
          sql,
          [
            uuid,
            data.first_name,
            data.last_name,
            data.gender,
            data.user_name,
            hash,
          ],
          (err, result) => {
            if (err) {
              console.error('💥 Database error during registration:', err);
              return reject(err);
            }
            console.log('✅ User registered successfully');
            resolve(data.user_name);
          }
        );
      })
      .catch((e) => {
        console.error('💥 Validation error during registration:', e);
        reject(e);
      });
  });
};

function validate(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "select user_id from `user` where user_name=? and `status`='1' limit 1";
    
    console.log('🔍 Validating username:', data.user_name);
    
    db.execute(sql, [data.user_name], (err, result) => {
      if (err) {
        console.error('💥 Database error during validation:', err);
        return reject(err);
      }
      
      if (result.length === 0) {
        console.log('✅ Username is available');
        resolve("Ok");
      } else {
        const errorMsg = "Username already exists. Please use a different one.";
        console.log('❌ Username already exists');
        reject(errorMsg);
      }
    });
  });
}

module.exports = auth;