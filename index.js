const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require('path');
const app = express();
const port = 5500;
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Адреса сервера
  user: "root",      // Ім'я користувача
  password: "root", // Пароль користувача
  database: "mydatabase4", // Назва бази даних
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// ВАЖЛИВО: Статичні файли ПЕРЕД іншими маршрутами
app.use(express.static(path.join(__dirname, 'web'))); 

// Middleware для парсингу
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Налаштування сесії
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Основні маршрути
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'home.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'login.html'));
});

// Логаут
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Помилка при виході");
        }
        res.redirect("/"); 
    });
});
app.get('/property-details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'property-details.html'));
});
// app.get('/auth-status', (req, res) => {
//   res.json({ 
//       isLoggedIn: !!req.session.user,
//       user: req.session.user ? {
//           id: req.session.user.id,
//           email: req.session.user.email,
//           firstname: req.session.user.firstname,
//           lastname: req.session.user.lastname,
//           role: req.session.user.role || 'user' // Додайте роль користувача
//       } : null
//   });
// });
// app.get('/auth-status', (req, res) => {
//   console.log('Повна інформація про сесію:', req.session.user);
//   res.json({ 
//     isLoggedIn: !!req.session.user,
//     user: req.session.user ? {
//       id: req.session.user.id,
//       email: req.session.user.email,
//       name: req.session.user.name,
//       surname: req.session.user.surname,
//       // role: req.session.user.role || 'guest'
//     } : null
//   });
// });
app.get('/auth-status', (req, res) => {
  console.log('Сесія користувача:', req.session.user);
  res.json({ 
      isLoggedIn: !!req.session.user,
      user: req.session.user ? {
          id: req.session.user.id,
          email: req.session.user.email,
          name: req.session.user.name,
          surname: req.session.user.surname,
          role: req.session.user.role || 'user'
      } : null
  });
});

app.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'faq.html')); // Шлях до файлу login.html
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'admin.html')); // Шлях до файлу login.html
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'home.html')); // Шлях до файлу login.html
});
app.get("/properties", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'properties.html')); // Шлях до файлу login.html
});

app.get('/edit-property/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'edit-property.html'));
});

app.get('/deals', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'deals.html'));
});

app.get('/viewings', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'viewings.html'));
});

app.get("/clients", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'clients.html')); // 
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'register.html'));
});
// app.get("/property-details", (req, res) => {
//   res.sendFile(path.join(__dirname, 'web', 'property-details.html'));
// });

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'profile.html'));
});

app.get("/catalog", (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'catalog.html'));
});

app.get('/с', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM properties');
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку нерухомостей:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
  }
});

const properties = require("./web/properties");
properties(app); // app передається, щоб використовувати маршрути з цього модуля



// // Отримання списку всіх нерухомостей
// app.get('/properties', async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.json(properties);
//   } catch (err) {
//     console.error('Помилка при отриманні списку нерухомостей:', err);
//     res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
//   }
// });
// app.get('/properties', async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM properties');
//     res.json(rows);  // Повертаємо масив нерухомостей у форматі JSON
//   } catch (err) {
//     console.error('Помилка при отриманні списку нерухомостей:', err);
//     res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
//   }
// });
app.get('/properties', async (req, res) => {
  try {
    // Використовуйте pool.promise() для асинхронних запитів
    const [rows] = await pool.promise().query('SELECT * FROM Properties');
    console.log('Отримані властивості:', rows); // Додайте логування
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку нерухомостей:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
  }
});
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Properties');
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку нерухомостей:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
  }
});

app.get('/user-properties', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Properties WHERE owner_id = ?', [req.session.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку нерухомостей:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку нерухомостей' });
  }
});
app.delete('/properties/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM Properties WHERE id = ? AND owner_id = ?', 
      [req.params.id, req.session.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена або ви не маєте прав на її видалення' });
    }

    res.json({ message: 'Нерухомість успішно видалена' });
  } catch (err) {
    console.error('Помилка при видаленні нерухомості:', err);
    res.status(500).json({ message: 'Помилка при видаленні нерухомості' });
  }
});
//////////////
app.get('/properties/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Properties WHERE id = ? AND owner_id = ?', 
      [req.params.id, req.session.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Помилка при отриманні деталей нерухомості:', err);
    res.status(500).json({ message: 'Помилка при отриманні деталей нерухомості' });
  }
});
app.get('/property-details/:id', async (req, res) => {
  console.log('Received request for property ID:', req.params.id);

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Properties WHERE id = ?', 
      [req.params.id]
    );

    console.log('Query results:', rows);

    if (rows.length === 0) {
      console.log('No property found with ID:', req.params.id);
      return res.status(404).json({ message: 'Нерухомість не знайдена' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Detailed error при отриманні деталей нерухомості:', err);
    res.status(500).json({ 
      message: 'Помилка при отриманні деталей нерухомості',
      error: err.message 
    });
  }
});

app.get('/api/property-details/:id', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT p.*, 
             u.name, 
             u.surname, 
             u.email 
      FROM Properties p
      JOIN Clients u ON p.owner_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Помилка при отриманні деталей нерухомості:', err);
    res.status(500).json({ message: 'Помилка при отриманні деталей нерухомості' });
  }
});

app.put('/properties/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { title, type, address, price, area, rooms, status, description } = req.body;
    
    const [result] = await pool.promise().query(
      'UPDATE Properties SET title = ?, type = ?, address = ?, price = ?, area = ?, rooms = ?, status = ?, description = ? WHERE id = ? AND owner_id = ?',
      [title, type, address, price, area, rooms, status, description, req.params.id, req.session.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена або ви не маєте прав на редагування' });
    }

    res.json({ message: 'Нерухомість успішно оновлена' });
  } catch (err) {
    console.error('Помилка при оновленні нерухомості:', err);
    res.status(500).json({ message: 'Помилка при оновленні нерухомості' });
  }
});

app.get('/property-details/:id', async (req, res) => {
  try {
    
    const [propertyRows] = await pool.promise().query(
      'SELECT * FROM Properties WHERE id = ?', 
      [req.params.id]
    );

    
    const [ownerRows] = await pool.promise().query(
      `SELECT u.name, u.surname, u.email  
       FROM Clients u
       JOIN Properties p ON u.id = p.owner_id
       WHERE p.id = ?`, 
      [req.params.id]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена' });
    }

    
    const propertyDetails = {
      ...propertyRows[0],
      owner: ownerRows.length > 0 ? ownerRows[0] : null
    };

    res.json(propertyDetails);

  } catch (err) {
    console.error('Помилка при отриманні деталей нерухомості:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


app.get('/api/property-details/:propertyId', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM Properties WHERE id = ?', 
      [req.params.propertyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Нерухомість не знайдена' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Помилка при отриманні деталей нерухомості:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

const db = require('./web/db.js');
app.get('/dashboard-data', async (req, res) => {
  try {
    const [activeObjects] = await db.query("SELECT COUNT(*) AS count FROM Properties WHERE status = 'доступно'");
    const [newClients] = await db.query("SELECT COUNT(*) AS count FROM Clients WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    const [deals] = await db.query("SELECT COUNT(*) AS count FROM Deals WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");

    res.json({
      activeObjects: activeObjects[0].count,
      newClients: newClients[0].count,
      deals: deals[0].count
    });
  } catch (error) {
    console.error("Помилка отримання даних для дашборду:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    
    const [rows] = await pool.promise().query('SELECT * FROM Clients');
    console.log('Отримані клієнти:', rows); 
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку клієнтів:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку клієнтів' });
  }
});


app.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
      
      await pool.promise().query('START TRANSACTION');
      
    
      await pool.promise().query('DELETE FROM Properties WHERE owner_id = ?', [clientId]);
      
      
      const [result] = await pool.promise().query('DELETE FROM Clients WHERE id = ?', [clientId]);

      if (result.affectedRows === 0) {
          
          await pool.promise().query('ROLLBACK');  
          return res.status(404).json({ message: 'Клієнта не знайдено' });
      }
      
      // Завершуємо транзакцію
      await pool.promise().query('COMMIT');

      res.status(200).json({ message: 'Клієнт та його нерухомість успішно видалені' });
  } catch (err) {
      console.error('Помилка при видаленні клієнта та його нерухомості:', err);
      await pool.promise().query('ROLLBACK');  // Відкочуємо транзакцію у разі помилки
      res.status(500).json({ message: 'Не вдалося видалити клієнта та його нерухомість' });
  }
});


app.post('/api/viewings', async (req, res) => {
  const { property_id } = req.body;
  const agent_id = req.session.agent_id; // Айді агента із сесії

  try {
      // Отримуємо власника нерухомості (owner_id)
      const [property] = await db.query(
          'SELECT owner_id FROM Properties WHERE id = ?', 
          [property_id]
      );

      if (!property.length) {
          return res.status(404).json({ error: 'Нерухомість не знайдена' });
      }

      const owner_id = property[0].owner_id;

      // Додаємо перегляд
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const [result] = await db.query(
          'INSERT INTO Viewings (property_id, client_id, agent_id, date) VALUES (?, ?, ?, ?)',
          [property_id, owner_id, agent_id, formattedDate]
      );

      res.status(201).json({
          message: 'Перегляд успішно створено',
          viewingId: result.insertId,
      });
  } catch (error) {
      console.error('Помилка при створенні перегляду:', error);
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});


app.get('/api/viewings', async (req, res) => {
  try {
    // Запит до бази даних для отримання всіх клієнтів
    const [rows] = await pool.promise().query('SELECT * FROM Viewings');
    
    console.log('Отримані перегляди:', rows); // Логування результату
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку клієнтів:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку клієнтів' });
  }
});

app.delete('/viewing/:id', async (req, res) => {
  const viewingId = req.params.id;
  try {
      await pool.promise().query('START TRANSACTION');
      
      const [result] = await pool.promise().query('DELETE FROM Viewings WHERE id = ?', [viewingId]);

      if (result.affectedRows === 0) {
          await pool.promise().query('ROLLBACK');
          return res.status(404).json({ message: 'Перегляд не знайдено' });
      }
      
      await pool.promise().query('COMMIT');
      res.status(200).json({ message: 'Перегляд успішно видалений' });
  } catch (err) {
      console.error('Помилка при видаленні перегляду:', err);
      await pool.promise().query('ROLLBACK');
      res.status(500).json({ message: 'Не вдалося видалити перегляд' });
  }
});

app.post('/api/deals', async (req, res) => {
  const { viewingId } = req.body;  // Отримуємо ID перегляду
  const agent_id = req.session.agent_id; // Айді агента із сесії

  try {
    // Отримуємо інформацію про перегляд за його ID
    const [viewing] = await db.query(
      'SELECT * FROM Viewings WHERE id = ?',
      [viewingId]
    );

    if (!viewing.length) {
      return res.status(404).json({ error: 'Перегляд не знайдено' });
    }

    // // Перевіряємо, чи агент має доступ до цього перегляду
    // if (viewing[0].agent_id !== agent_id) {
    //   return res.status(403).json({ error: 'У вас немає доступу до цього перегляду' });
    // }

    // Створення угоди
    const [result] = await db.query(
      'INSERT INTO Deals (property_id, client_id, agent_id, date) VALUES (?, ?, ?, ?)',
      [viewing[0].property_id, viewing[0].client_id, agent_id, new Date()]
    );

    res.status(201).json({
      message: 'Угода успішно укладена',
      dealId: result.insertId
    });
  } catch (error) {
    console.error('Помилка при укладанні угоди:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});
app.get('/api/deals', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Deals');
    console.log('Отримані угоди:', rows); // Логування результату
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні списку клієнтів:', err);
    res.status(500).json({ message: 'Помилка при отриманні списку клієнтів' });
  }
});

app.delete('/deal/:id', async (req, res) => {
  const dealId = req.params.id;
  try {
      await pool.promise().query('START TRANSACTION');
      
      // Видалення угоди з таблиці Deals
      const [result] = await pool.promise().query('DELETE FROM Deals WHERE id = ?', [dealId]);

      if (result.affectedRows === 0) {
          await pool.promise().query('ROLLBACK');
          return res.status(404).json({ message: 'Угоду не знайдено' });
      }
      
      await pool.promise().query('COMMIT');
      res.status(200).json({ message: 'Угода успішно видалена' });
  } catch (err) {
      console.error('Помилка при видаленні угоди:', err);
      await pool.promise().query('ROLLBACK');
      res.status(500).json({ message: 'Не вдалося видалити угоду' });
  }
});


// // Підключення маршрутів логіну та реєстрації
const login = require("./web/login");
const register = require("./web/register");
login(app);
register(app);

app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});
