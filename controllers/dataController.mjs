//dataController.mjs
import TambakData from '../models/TambakData.mjs';

const dataController = {
  getLatestData: async (req, res) => {
    try {
      const data = await TambakData.getLatest();
      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  getAllData: async (req, res) => {
    try {
      const data = await TambakData.getAll();
      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const notifications = await TambakData.getNotifications();
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

export default dataController;