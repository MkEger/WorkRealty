const multer = require("multer");
const bcrypt = require("bcryptjs");
const db = require("./db"); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

module.exports = (app) => {
  app.post("/register", upload.single("document"), async (req, res) => {
    try {
      const { email, password, surname, name, patronymic, birthdate, group } = req.body;

      
      const [existingUsers] = await db.query(
        "SELECT * FROM Clients WHERE email = ?", 
        [email]
      );

      
      if (existingUsers.length > 0) {
        return res.status(400).redirect(`/register?error=${encodeURIComponent('Ця електронна пошта вже зайнята')}`);
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const [result] = await db.query(
        "INSERT INTO Clients (email, password, surname, name, patronymic, birthdate, `group`, document) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          surname,
          name,
          patronymic,
          birthdate,
          group,
          req.file ? req.file.filename : null,
        ]
      );

      console.log("Додано користувача з ID:", result.insertId);
      res.redirect("/login?message=registration-successful");
    } catch (error) {
      console.error("Помилка під час реєстрації:", error);
      res.status(500).send("Помилка сервера. Спробуйте пізніше.");
    }
  });
};


