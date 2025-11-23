<div align="center">

# **@imjxsx/localdb**

## *A lightweight MongoDB-style BSON database for Node.js*

Fast, fully-typed, zero-dependency storage backed by BSON files.  
Ideal for small apps, CLIs, bots, desktop tools, configs, caching, and offline data.

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Node Version](https://img.shields.io/badge/Node-%3E=20.0.0-blue)
![BSON](https://img.shields.io/badge/Format-BSON-orange)
![Status](https://img.shields.io/badge/Maintained-Yes-success)

</div>

---

<div align="center">

## 📦 Installation

</div>

```bash
npm i @imjxsx/localdb
pnpm add @imjxsx/localdb
yarn add @imjxsx/localdb
bun add @imjxsx/localdb
```

---

<div align="center">

## 🚀 Example of use

</div>

```ts
import { LocalDB, IDocument } from "@imjxsx/localdb";

interface IUser extends IDocument {
  name: string;
  level: number;
}
const db = new LocalDB("data").db("app");

// Load file
await db.load();

// Obtain the collection or create it if it doesn't exist
const users = db.collection<IUser>("users");

// Insert
users.insertOne({ name: "Jxsx", level: 50 });
users.insertOne({ name: "Luz", level: 20 });

// Query
console.log(users.findOne({ name: "Jxsx" }));
console.log(users.find({ level: 20 }));

// Update
users.updateOne({ name: "Luz" }, { level: 30 });

// Delete
users.deleteOne({ name: "Jxsx" });

// Save file
await db.save();
```

---

<div align="center">

## 🛠 Requirements

</div>

- Node.js **>= 20.0.0**
- TypeScript (optional but recommended)

---

<div align="center">

## 📜 License

MIT © 2025 — Created & maintained by  

### <a href="https://github.com/imjxsx">I'm Jxsx</a>

</div>
