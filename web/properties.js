const multer = require("multer");
const db = require("./db");

module.exports = (app) => {
    app.post('/properties', async (req, res) => {
      try {
        const { title, type, address, price, area, rooms, status, description } = req.body;
  
        
        if (!title || !type || !address || !price || !area || !rooms || !status || !description) {
          return res.status(400).json({ message: 'Усі поля повинні бути заповнені' });
        }
  
        
        const owner_id = req.session.user?.id; 
  
        if (!owner_id) {
          return res.status(400).json({ message: 'Не знайдений ID власника. Ви повинні бути авторизовані.' });
        }
  
        
        const [result] = await db.query(
          'INSERT INTO properties (title, type, address, price, area, rooms, status, description, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [title, type, address, price, area, rooms, status, description, owner_id]
        );
  
        res.status(201).send('Нерухомість успішно додана');
      } catch (err) {
        res.status(500).send('Помилка при додаванні нерухомості');
        // res.status(500).json({ message: 'Помилка при додаванні нерухомості', error: err.message });
      }
    });
    
    
  };
