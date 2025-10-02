//TambakData.mjs
import pool from '../config/db.mjs';

class TambakData {
  static async getAll() {
    const query = 'SELECT * FROM tambak_dipasena ORDER BY time DESC LIMIT 100';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getLatest() {
    const query = 'SELECT * FROM tambak_dipasena ORDER BY time DESC LIMIT 1';
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async getNotifications() {
    const query = `
      SELECT * FROM tambak_dipasena 
      WHERE 
        suhu_air_permukaan > 32 OR suhu_air_permukaan < 28 OR
        suhu_air_dasar > 32 OR suhu_air_dasar < 28 OR
        suhu_ruang > 30 OR suhu_ruang < 25 OR
        salinitas > 25 OR salinitas < 15 OR
        oxygen < 4 OR oxygen > 8 OR
        ph < 7.5 OR ph > 8.5 OR
        amonia > 0.5
      ORDER BY time DESC 
      LIMIT 10
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async insert(data) {
    const query = `
      INSERT INTO tambak_dipasena (
        time, 
        suhu_air_permukaan, 
        suhu_air_dasar, 
        suhu_ruang, 
        salinitas, 
        oxygen, 
        ph, 
        amonia
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.time,
      data.suhu_air_permukaan,
      data.suhu_air_dasar,
      data.suhu_ruang,
      data.salinitas,
      data.oxygen,
      data.ph,
      data.amonia
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

export default TambakData;