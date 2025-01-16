const bcrypt = require("bcryptjs");
const db = require("./db"); 
const insertTestData = require("./testData"); 

const login = (app) => {
  
  // insertTestData();

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = null;
      let role = null;

      
      const [clientRows] = await db.query("SELECT * FROM Clients WHERE email = ?", [email]);
      if (clientRows.length > 0) {
        user = clientRows[0];
        role = "user";
      }

      
      if (!user) {
        const [agentRows] = await db.query("SELECT * FROM Agents WHERE email = ?", [email]);
        if (agentRows.length > 0) {
          user = agentRows[0];
          role = "agent";
        }
      }

      
      if (!user) {
        return res.status(400).send("Неправильний email або пароль");
      }

      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send("Неправильний email або пароль");
      }
      // req.session.user = {
      //           id: user.id,
      //           email: user.email,
      //           lastname: user.lastname,     
      //           firstname: user.firstname,   
      //           role: user.role || 'user'
      //         };

      // req.session.user = {
      //   id: user.id,
      //   email: user.email,
      //   lastname: user.lastname ||  ㅤ,
      //   firstname: user.firstname || user.name,
      //   surname: user.lastname || user.surname,
      //   role, 
      // };

      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.firstname || user.name,
        surname: user.lastname ||  user.surname,
        role, 
      };

      res.redirect("/home?message=authorization-successful");
    } catch (error) {
      console.error("Помилка під час авторизації:", error);
      res.status(500).send("Помилка сервера. Спробуйте пізніше.");
    }
  });
};

module.exports = login;
