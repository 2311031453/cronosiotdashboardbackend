//authController.mjs
import User from '../models/User.mjs';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email sudah terdaftar' 
      });
    }

    // Buat user baru
    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      data: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password harus diisi' 
      });
    }

    // Cari user berdasarkan email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Verifikasi password
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Generate token
    const token = User.generateToken(user);

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
};

export const logout = (req, res) => {
  // Untuk JWT, logout dilakukan di client dengan menghapus token
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
};

// Export sebagai named exports
export default {
  register,
  login,
  logout,
  getProfile
};