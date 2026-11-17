import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../src/common/utils/createToken";

class Seeder {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async cleanDatabase() {
    console.log("🗑️  Cleaning database...");
    await this.prisma.expense.deleteMany();
    await this.prisma.budget.deleteMany();
    await this.prisma.user.deleteMany();
    console.log("✅ Database cleaned");
  }

  async seedUsers() {
    console.log("👥 Creating users...");

    // Password hasheada: "Password123!"
    const hashedPassword = await bcrypt.hash("Password123!", 12);

    const user1 = await this.prisma.user.create({
      data: {
        email: "john.doe@example.com",
        name: "John Doe",
        password: hashedPassword,
        token: generateToken(),
        confirmed: true, // Usuario confirmado
      },
    });

    const user2 = await this.prisma.user.create({
      data: {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        password: hashedPassword,
        token: generateToken(),
        confirmed: true,
      },
    });

    const user3 = await this.prisma.user.create({
      data: {
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        password: hashedPassword,
        token: generateToken(),
        confirmed: false, // Usuario sin confirmar
      },
    });

    console.log("✅ Users created (password: Password123!)");
    return { user1, user2, user3 };
  }

  async seedBudgets(users: { user1: any; user2: any; user3: any }) {
    console.log("💰 Creating budgets...");

    const budget1 = await this.prisma.budget.create({
      data: {
        name: "Vacaciones Familiares",
        amount: 5000,
        userId: users.user1.id,
      },
    });

    const budget2 = await this.prisma.budget.create({
      data: {
        name: "Laptop Nueva",
        amount: 2500,
        userId: users.user1.id,
      },
    });

    const budget3 = await this.prisma.budget.create({
      data: {
        name: "Fondo de Emergencia",
        amount: 10000,
        userId: users.user2.id,
      },
    });

    const budget4 = await this.prisma.budget.create({
      data: {
        name: "Auto Usado",
        amount: 8000,
        userId: users.user3.id,
      },
    });

    const budget5 = await this.prisma.budget.create({
      data: {
        name: "Gastos del Hogar",
        amount: 3000,
        userId: users.user2.id,
      },
    });

    console.log("✅ Budgets created");
    return { budget1, budget2, budget3, budget4, budget5 };
  }

  async seedExpenses(budgets: any) {
    console.log("📊 Creating expenses...");

    const result = await this.prisma.expense.createMany({
      data: [
        // Vacaciones Familiares
        {
          name: "Vuelos ida y vuelta",
          amount: 1200,
          budgetId: budgets.budget1.id,
        },
        {
          name: "Hotel 7 noches",
          amount: 1800,
          budgetId: budgets.budget1.id,
        },
        {
          name: "Tours y excursiones",
          amount: 600,
          budgetId: budgets.budget1.id,
        },
        {
          name: "Comidas y restaurantes",
          amount: 500,
          budgetId: budgets.budget1.id,
        },

        // Laptop Nueva
        {
          name: "MacBook Pro M4",
          amount: 2300,
          budgetId: budgets.budget2.id,
        },
        {
          name: "Funda protectora",
          amount: 50,
          budgetId: budgets.budget2.id,
        },
        {
          name: "Mouse inalámbrico",
          amount: 80,
          budgetId: budgets.budget2.id,
        },

        // Fondo de Emergencia
        {
          name: "Ahorro enero",
          amount: 1000,
          budgetId: budgets.budget3.id,
        },
        {
          name: "Ahorro febrero",
          amount: 1500,
          budgetId: budgets.budget3.id,
        },
        {
          name: "Ahorro marzo",
          amount: 1000,
          budgetId: budgets.budget3.id,
        },
        {
          name: "Bono laboral",
          amount: 2000,
          budgetId: budgets.budget3.id,
        },

        // Auto Usado
        {
          name: "Enganche inicial",
          amount: 2000,
          budgetId: budgets.budget4.id,
        },
        {
          name: "Documentación y trámites",
          amount: 300,
          budgetId: budgets.budget4.id,
        },

        // Gastos del Hogar
        {
          name: "Supermercado",
          amount: 450,
          budgetId: budgets.budget5.id,
        },
        {
          name: "Servicios (luz, agua, gas)",
          amount: 280,
          budgetId: budgets.budget5.id,
        },
        {
          name: "Internet y cable",
          amount: 120,
          budgetId: budgets.budget5.id,
        },
        {
          name: "Mantenimiento del hogar",
          amount: 200,
          budgetId: budgets.budget5.id,
        },
      ],
    });

    console.log(`✅ ${result.count} expenses created`);
  }

  async printStats() {
    const stats = {
      users: await this.prisma.user.count(),
      budgets: await this.prisma.budget.count(),
      expenses: await this.prisma.expense.count(),
    };

    // Calcular totales por presupuesto
    const budgetsWithTotals = await this.prisma.budget.findMany({
      include: {
        expenses: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("\n📊 Seed Summary:");
    console.log(`   - Users: ${stats.users}`);
    console.log(`   - Budgets: ${stats.budgets}`);
    console.log(`   - Expenses: ${stats.expenses}`);

    console.log("\n💰 Budget Details:");
    budgetsWithTotals.forEach((budget) => {
      const totalExpenses = budget.expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
      const remaining = Number(budget.amount) - totalExpenses;
      const percentage = (
        (totalExpenses / Number(budget.amount)) *
        100
      ).toFixed(1);

      console.log(`\n   ${budget.name} (${budget.user.name})`);
      console.log(`      Budget: $${budget.amount}`);
      console.log(`      Spent: $${totalExpenses} (${percentage}%)`);
      console.log(`      Remaining: $${remaining}`);
      console.log(`      Expenses: ${budget.expenses.length}`);
    });

    console.log("\n✨ Seed completed successfully!\n");
  }

  async seed() {
    try {
      console.log("🌱 Starting seed...\n");

      await this.cleanDatabase();
      const users = await this.seedUsers();
      const budgets = await this.seedBudgets(users);
      await this.seedExpenses(budgets);
      await this.printStats();
    } catch (error) {
      console.error("❌ Seed failed:", error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Ejecutar el seed
const seeder = new Seeder();
seeder.seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

// ---------- before the v1 -----------
// class Seeder {
//   private prisma;

//   constructor() {
//     this.prisma = new PrismaClient();
//   }

//   async cleanDatabase() {
//     console.log("🗑️  Cleaning database...");
//     await this.prisma.notification.deleteMany();
//     await this.prisma.budgetContribution.deleteMany();
//     await this.prisma.budget.deleteMany();
//     await this.prisma.user.deleteMany();
//     console.log("✅ Database cleaned");
//   }

//   async seedUsers() {
//     console.log("👥 Creating users...");

//     // Password hasheada: "Password123!"
//     const hashedPassword = await bcrypt.hash("Password123!", 10);
//     generateToken();
//     const user1 = await this.prisma.user.create({
//       data: {
//         email: "john.doe@example.com",
//         name: "John Doe",
//         password: hashedPassword,
//         token: generateToken(),
//       },
//     });

//     const user2 = await this.prisma.user.create({
//       data: {
//         email: "jane.smith@example.com",
//         name: "Jane Smith",
//         password: hashedPassword,
//         token: generateToken(),
//       },
//     });

//     const user3 = await this.prisma.user.create({
//       data: {
//         email: "bob.wilson@example.com",
//         name: "Bob Wilson",
//         password: hashedPassword,
//         token: generateToken(),
//       },
//     });

//     console.log("✅ Users created (password: Password123!)");
//     return { user1, user2, user3 };
//   }

//   async seedBudgets(users: { user1: any; user2: any; user3: any }) {
//     console.log("💰 Creating budgets...");

//     const budget1 = await this.prisma.budget.create({
//       data: {
//         title: "Vacaciones en Europa",
//         description: "Viaje a París, Roma y Barcelona en verano",
//         targetAmount: 5000,
//         savedAmount: 1200,
//         startDate: new Date("2025-01-01"),
//         endDate: new Date("2025-07-01"),
//         frequencyDays: 7,
//         ownerId: users.user1.id,
//       },
//     });

//     const budget2 = await this.prisma.budget.create({
//       data: {
//         title: "Laptop Nueva",
//         description: "MacBook Pro M4 para desarrollo",
//         targetAmount: 2500,
//         savedAmount: 800,
//         startDate: new Date("2025-02-01"),
//         endDate: new Date("2025-06-01"),
//         frequencyDays: 14,
//         ownerId: users.user1.id,
//       },
//     });

//     const budget3 = await this.prisma.budget.create({
//       data: {
//         title: "Fondo de Emergencia",
//         description: "Ahorro para imprevistos",
//         targetAmount: 10000,
//         savedAmount: 3500,
//         startDate: new Date("2025-01-01"),
//         endDate: new Date("2025-12-31"),
//         frequencyDays: 30,
//         ownerId: users.user2.id,
//       },
//     });

//     const budget4 = await this.prisma.budget.create({
//       data: {
//         title: "Auto Usado",
//         description: "Comprar un auto confiable",
//         targetAmount: 8000,
//         savedAmount: 2000,
//         startDate: new Date("2025-03-01"),
//         endDate: new Date("2025-12-01"),
//         frequencyDays: 7,
//         ownerId: users.user3.id,
//       },
//     });

//     console.log("✅ Budgets created");
//     return { budget1, budget2, budget3, budget4 };
//   }

//   async seedContributions(users: any, budgets: any) {
//     console.log("📊 Creating contributions...");

//     const result = await this.prisma.budgetContribution.createMany({
//       data: [
//         {
//           amount: 500,
//           userId: users.user1.id,
//           budgetId: budgets.budget1.id,
//           createdAt: new Date("2025-01-15"),
//         },
//         {
//           amount: 300,
//           userId: users.user1.id,
//           budgetId: budgets.budget1.id,
//           createdAt: new Date("2025-02-01"),
//         },
//         {
//           amount: 400,
//           userId: users.user1.id,
//           budgetId: budgets.budget1.id,
//           createdAt: new Date("2025-02-20"),
//         },
//         {
//           amount: 400,
//           userId: users.user1.id,
//           budgetId: budgets.budget2.id,
//           createdAt: new Date("2025-02-10"),
//         },
//         {
//           amount: 400,
//           userId: users.user1.id,
//           budgetId: budgets.budget2.id,
//           createdAt: new Date("2025-03-01"),
//         },
//         {
//           amount: 1000,
//           userId: users.user2.id,
//           budgetId: budgets.budget3.id,
//           createdAt: new Date("2025-01-05"),
//         },
//         {
//           amount: 1500,
//           userId: users.user2.id,
//           budgetId: budgets.budget3.id,
//           createdAt: new Date("2025-02-05"),
//         },
//         {
//           amount: 1000,
//           userId: users.user2.id,
//           budgetId: budgets.budget3.id,
//           createdAt: new Date("2025-03-05"),
//         },
//         {
//           amount: 1000,
//           userId: users.user3.id,
//           budgetId: budgets.budget4.id,
//           createdAt: new Date("2025-03-10"),
//         },
//         {
//           amount: 1000,
//           userId: users.user3.id,
//           budgetId: budgets.budget4.id,
//           createdAt: new Date("2025-04-01"),
//         },
//       ],
//     });

//     console.log(`✅ ${result.count} contributions created`);
//   }

//   async seedNotifications(users: any, budgets: any) {
//     console.log("🔔 Creating notifications...");

//     const result = await this.prisma.notification.createMany({
//       data: [
//         {
//           message:
//             "¡Recuerda aportar a tu meta de Vacaciones! Ya llevas $1200 de $5000",
//           budgetId: budgets.budget1.id,
//           userId: users.user1.id,
//           sentAt: new Date("2025-03-01"),
//         },
//         {
//           message: "Tu meta de Laptop está al 32%. ¡Sigue así!",
//           budgetId: budgets.budget2.id,
//           userId: users.user1.id,
//           sentAt: new Date("2025-03-15"),
//         },
//         {
//           message:
//             "Fondo de Emergencia: Ya tienes $3500 ahorrados (35% de tu meta)",
//           budgetId: budgets.budget3.id,
//           userId: users.user2.id,
//           sentAt: new Date("2025-04-01"),
//         },
//         {
//           message: "¡Vas por buen camino! Ya tienes $2000 para tu auto",
//           budgetId: budgets.budget4.id,
//           userId: users.user3.id,
//           sentAt: new Date("2025-04-05"),
//         },
//       ],
//     });

//     console.log(`✅ ${result.count} notifications created`);
//   }

//   async printStats() {
//     const stats = {
//       users: await this.prisma.user.count(),
//       budgets: await this.prisma.budget.count(),
//       contributions: await this.prisma.budgetContribution.count(),
//       notifications: await this.prisma.notification.count(),
//     };

//     console.log("\n📊 Seed Summary:");
//     console.log(`   - Users: ${stats.users}`);
//     console.log(`   - Budgets: ${stats.budgets}`);
//     console.log(`   - Contributions: ${stats.contributions}`);
//     console.log(`   - Notifications: ${stats.notifications}`);
//     console.log("\n✨ Seed completed successfully!\n");
//   }

//   async seed() {
//     try {
//       console.log("🌱 Starting seed...\n");

//       await this.cleanDatabase();
//       const users = await this.seedUsers();
//       const budgets = await this.seedBudgets(users);
//       await this.seedContributions(users, budgets);
//       await this.seedNotifications(users, budgets);
//       await this.printStats();
//     } catch (error) {
//       console.error("❌ Seed failed:", error);
//       throw error;
//     } finally {
//       await this.prisma.$disconnect();
//     }
//   }
// }

// // Ejecutar el seed
// const seeder = new Seeder();
// seeder.seed().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
