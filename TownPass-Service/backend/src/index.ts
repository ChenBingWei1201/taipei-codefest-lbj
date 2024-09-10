import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./db/index.js";
import { foodLog, sessions, users, weights } from "./db/schema.js";
import { desc, eq } from "drizzle-orm";

dotenv.config();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.post("/user", async (req, res) => {
  const user = req.body;
  // console.log(user);
  const weight = user.weight;
  // @ts-ignore
  const isUserExist = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  if (isUserExist.length === 0) {
    // @ts-ignore
    await db.insert(users).values(user).execute();
    await db
      .insert(weights)
      .values({
        userId: user.id,
        weight: weight,
        month: new Date().getMonth() + 1,
      })
      .execute();
  }
  res.json(user);
});

app.get("/user", async (req, res) => {
  // @ts-ignore
  // console.log(req.query);
  const user = await db.select().from(users).where(eq(users.id, req.query.id));
  // // console.log(user)
  res.json(user);
});

app.get("/session", async (req, res) => {
  const user = req.query.user;
  // console.log("user", req.query);
  // @ts-ignore
  const userSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, user))
    .orderBy(desc(sessions.time));
  // // console.log("sessions", userSessions);
  res.json(userSessions);
});

app.get("/onesession", async (req, res) => {
  const id = req.query.id;
  // @ts-ignore
  const session = await db.select().from(sessions).where(eq(sessions.id, id));
  res.json(session);
});

app.post("/session", async (req, res) => {
  const session = req.body;
  // add time field
  // current year month day
  // @ts-ignore
  const new_session = await db.insert(sessions).values(session).returning();

  // console.log("new_session", new_session);
  res.json(new_session[0]);
});

app.get("/weight", async (req, res) => {
  const user = req.query.id;

  // @ts-ignore
  const weight = await db
    .select()
    .from(weights)
    .where(eq(weights.userId, user))
    .orderBy(weights.month);
  const weightinfo = weight.map((w) => {
    return {
      month: months[w.month! - 1],
      weight: w.weight,
    };
  });
  // console.log("weightinfo", weightinfo);

  res.json(weightinfo);
});

app.post("/weight", async (req, res) => {
  let weight = req.body;
  // @ts-ignore
  const month = new Date().getMonth() + 1;
  weight.month = month;
  // if month exist, update
  // @ts-ignore
  const isExist = await db
    .select()
    .from(weights)
    .where(eq(weights.userId, weight.userId))
    .where(eq(weights.month, month));
  if (isExist.length > 0) {
    // @ts-ignore
    await db
      .update(weights)
      .set(weight)
      .where(eq(weights.userId, weight.userId))
      .where(eq(weights.month, month))
      .returning();
  } else {
    // @ts-ignore
    await db.insert(weights).values(weight).returning();
  }
  weight.month = months[month - 1];
  // console.log("weight", weight);
  res.json(weight);
});

app.get("/weight", async (req, res) => {
  // console.log("ok");
  const user = req.query.id;
  // @ts-ignore
  const weight = await db
    .select()
    .from(weights)
    .where(eq(weights.userId, user))
    .orderBy(weights.month);
  res.json(weight);
});

app.get("/food", async (req, res) => {
  const user = req.query.user;
  // @ts-ignore
  const food = await db
    .select()
    .from(foodLog)
    .where(eq(foodLog.userId, user))
    .orderBy(desc(foodLog.time));

  res.json(food);
});

app.post("/food", async (req, res) => {
  const food = req.body;
  // @ts-ignore
  const new_food = await db.insert(foodLog).values(food).returning();

  res.json(new_food[0]);
});

app.get("/today", async (req, res) => {
  const user = req.query.id;
  // console.log("userid", user);
  // @ts-ignore
  let today = await db.select().from(sessions).where(eq(sessions.userId, user));

  today = today.filter((session) => {
    return new Date(session.time!).getDate() === new Date().getDate();
  });

  let duration = 0;
  today.forEach((session) => {
    duration += parseInt(session.duration!);
  });

  let burned = 0;
  today.forEach((session) => {
    burned += parseFloat(session.calories!);
  });

  // console.log("duration", duration);
  // console.log("calories", burned);
  let intake = 0;
  let food = await db.select().from(foodLog).where(eq(foodLog.userId, user));
  food = food.filter((f) => {
    return new Date(f.time).getDate() === new Date().getDate();
  });
  food.forEach((f) => {
    intake += parseFloat(f.calories) * parseFloat(f.amount);
  });

  res.json({
    burned,
    intake,
    time: duration,
  });
});

app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});
