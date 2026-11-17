# 💰 MoneyUp  

A web application for **personal finance management**, where families and individuals can **define, track, and achieve savings goals** in a simple and practical way.  

---

## 📖 General Information  

**Institution:** Institución Universitaria Colegio Mayor del Cauca  
**Faculty:** Engineering  
**Program:** Software Development Technology  
**Place & Date:** Popayán, September 2025  

**Authors:**  
- Santiago Torres Morocho  
- Juan David Chaves Muños  
- Jesús David León Chito  
- Gabriela Orozco Vásquez  
- Juan Sebastián Astudillo Ordoñez  

**Advisor:**  
- Víctor Hugo Pinto Rodríguez  

---

## 🎯 Purpose  

The **MoneyUp** application aims to provide a practical technological solution adapted to the local context, making it easier to control income and expenses while promoting sustainable saving habits.  

Many families in Colombia focus their efforts on meeting immediate needs, which makes long-term financial planning difficult. Without a simple and intuitive tool, saving is postponed, preventing the construction of a stable economic backup.  

---

## 📌 Objectives  

- Design a simple, accessible, and intuitive user interface that allows registering income, expenses, and savings goals.  
- Implement functionalities to dynamically create, modify, and delete savings goals.  
- Develop a notification and reminder system to encourage consistency in saving habits.  
- Integrate visual reports (charts and statistics) that clearly show progress toward goals.  
- Validate the prototype with end users to assess usability, accessibility, and effectiveness in achieving savings goals.  

---

## 👥 Stakeholders  

- **Sponsor:** Citria Company  
- **Developers:** Students responsible for the design, implementation, and validation of the application  
- **End users:** Families and individuals who face difficulties in defining and maintaining savings goals  
- **Academic advisor:** Provides academic and methodological support to the team  

---

## 📜 Project Charter  

**Project:** MoneyUp  

### 1. Background / Justification  
Many families in Colombia struggle to define and follow savings goals, leading to over-indebtedness and little financial stability. This project seeks to address this need with a technological application adapted to the local context, facilitating personal finance management.  

### 2. Project Purpose  
To design and develop a prototype application that allows families and individuals to register income, expenses, and savings goals, fostering sustainable financial habits.  

### 3. Project Objectives  
- Design a simple, accessible, and intuitive user interface.  
- Implement CRUD for savings goals.  
- Develop a notification and reminder system.  
- Integrate visual reports.  
- Validate the prototype with end users.  

### 4. Preliminary Scope  

**Includes:**  
- User interface design  
- Development of a functional prototype with income, expense, and savings goals registration  
- Implementation of notifications and basic visual reports  
- Initial validation with a small group of users  

**Excludes:**  
- Integration with banking systems or external applications  
- Advanced functionalities such as investments, loans, or professional financial advice  
- Long-term technical support after academic delivery  

### 5. Roles & Responsibilities  

- **Sponsor:** Citria Company  
- **Development team:** Students responsible for design and programming  
- **End users:** Families and individuals with savings difficulties  
- **Academic advisor:** Provides academic and methodological support  

### 6. Preliminary Timeline  

- **Start:** September 2025  
- **End:** December 2025  

**Key milestones:**  
- Week 1: Requirements gathering  
- Week 2: UI/UX design  
- Weeks 3–4: Backend and frontend development  
- Week 5: Internal testing  
- Week 6: Final delivery and presentation  

### 7. Approvals  

- **Citria** – Sponsor  
- **Gabriela Orozco Vásquez** – Project Leader  
- **Academic Advisor**  

---

## 🛠️ Technologies & Tools  

🌐 **Frontend:** React · TailwindCSS · TypeScript  
⚙️ **Backend:** Node.js · Express  
🗄️ **Database:** MongoDB · Prisma  
🚀 **Development Tools:** Git · GitHub · Vercel · VS Code  

---

## 🔧 Requirements  

- Node.js 18+  
- MongoDB 6+  
- Git  

---

## 📂 Project Structure  

```bash
moneyup/
│── frontend/ # UI code
│── backend/ # API code
│── prisma/ # Database schema and migrations
│── docs/ # Project documentation
│── README.md # Main documentation

```


---

## 🚀 Installation & Running  

1. **Clone the repository**  

```bash
git clone git@github.com:equipo/moneyup.git
cd moneyup
```
2. **Setup environment variables**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
3. **Run Backend**

```bash
cd backend
npm install
npm run dev
```
4. **Run Frontend**

```bash
cd frontend
npm install
npm run dev
```

