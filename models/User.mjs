//User.mjs
import pool from '../config/db.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class User {
  static async create(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO usersiot (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, created_at
    `;
    
    const values = [name, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usersiot WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM usersiot WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
  }
}

export default User;