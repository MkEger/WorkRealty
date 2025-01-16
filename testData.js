// const bcrypt = require("bcryptjs");
// const db = require("./db");

// const testData = [
//   {
//     name: "Іван",
//     surname: "Коваленко",
//     phone: "380671234567",
//     email: "ivan.kovalenko@example.com",
//     commission: 10,
//     password: "password123",  // Пароль, який буде захешований
//     role: "agent"
//   },
//   {
//     name: "Олена",
//     surname: "Шевченко",
//     phone: "380681234567",
//     email: "olena.shevchenko@example.com",
//     commission: 12,
//     password: "securepass",  // Пароль, який буде захешований
//     role: "agent"
//   },
//   {
//     name: "Петро",
//     surname: "Іванов",
//     phone: "380631234567",
//     email: "petro.ivanov@example.com",
//     commission: 15,
//     password: "agent2024",  // Пароль, який буде захешований
//     role: "agent"
//   }
// ];

// // Функція для додавання тестових даних у базу даних
// const insertTestData = async () => {
//   for (let data of testData) {
//     try {
//       const hashedPassword = await bcrypt.hash(data.password, 10);
      
//       const query = `
//         INSERT INTO ${data.role === 'agent' ? 'Agents' : 'Clients'} 
//         (name, surname, phone, email, commission, password)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;
      
//       await db.query(query, [
//         data.name,
//         data.surname,
//         data.phone,
//         data.email,
//         data.commission,
//         hashedPassword
//       ]);
      
//       console.log(`Тестовий користувач ${data.email} доданий до бази даних.`);
//     } catch (error) {
//       console.error("Помилка при додаванні тестових даних:", error);
//     }
//   }
// };

// module.exports = insertTestData;
