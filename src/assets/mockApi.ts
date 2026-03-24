import { dummyFoodLogs, dummyActivityLogs } from "../assets/assets";
import type { UserData, FoodEntry, ActivityEntry, FormData } from "../types";

interface DB {
  users: any[];
  currentUser: any;
  foodLogs: FoodEntry[];
  activityLogs: ActivityEntry[];
}

const getDB = (): DB => {
  const dbStr = localStorage.getItem("fitness_db");

  if (!dbStr) {
    return {
      users: [],
      currentUser: null,
      foodLogs: [],
      activityLogs: [],
    };
  }

  return JSON.parse(dbStr);
};

const saveDB = (db: DB) => {
  localStorage.setItem("fitness_db", JSON.stringify(db));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  auth: {
    login: async (credentials: any) => {
      await delay(500);
      const db = getDB();

      const user = db.users.find(
        (u) =>
          u.email === credentials.email &&
          u.password === credentials.password
      );

      if (!user) {
        throw new Error("Credenciales incorrectas");
      }

      db.currentUser = user;
      saveDB(db);

      return {
        data: {
          user,
          jwt: "mock_jwt_token_" + Date.now(),
        },
      };
    },

    register: async (credentials: any) => {
      await delay(500);
      const db = getDB();

      const exists = db.users.find(
        (u) => u.email === credentials.email
      );

      if (exists) {
        throw new Error("El usuario ya existe");
      }

      const newUser = {
  id: "user_" + Date.now(),
  username: credentials.username,
  email: credentials.email,
  password: credentials.password,
  age: 0,
  weight: 0,
  height: 0,
  goal: "maintain" as const,
  createdAt: new Date().toISOString(),
};

      db.users.push(newUser);
      db.currentUser = newUser;
      db.foodLogs = [...dummyFoodLogs];
      db.activityLogs = [...dummyActivityLogs];

      saveDB(db);

      return {
        data: {
          user: newUser,
          jwt: "mock_jwt_token_" + Date.now(),
        },
      };
    },
  },

  user: {
    me: async () => {
      await delay(300);
      const db = getDB();
      return { data: db.currentUser };
    },

    update: async (_id: string, updates: Partial<UserData>) => {
      await delay(300);
      const db = getDB();

      if (db.currentUser) {
        db.currentUser = { ...db.currentUser, ...updates };

        db.users = db.users.map((u) =>
          u.id === db.currentUser.id ? db.currentUser : u
        );

        saveDB(db);
      }

      return { data: db.currentUser };
    },
  },

  foodLogs: {
    list: async () => {
      await delay(300);
      const db = getDB();
      return { data: db.foodLogs };
    },

    create: async (payload: { data: FormData | any }) => {
      await delay(300);
      const db = getDB();

      const newEntry: FoodEntry = {
        id: Date.now(),
        documentId: "doc_food_" + Date.now(),
        name: payload.data.name,
        calories: payload.data.calories,
        mealType: payload.data.mealType,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };

      db.foodLogs.push(newEntry);
      saveDB(db);

      return { data: newEntry };
    },

    delete: async (documentId: string) => {
      await delay(300);
      const db = getDB();

      db.foodLogs = db.foodLogs.filter(
        (f) => f.documentId !== documentId
      );

      saveDB(db);
      return { data: { id: documentId } };
    },
  },

  activityLogs: {
    list: async () => {
      await delay(300);
      const db = getDB();
      return { data: db.activityLogs };
    },

    create: async (payload: {
      data: { name: string; duration: number; calories: number };
    }) => {
      await delay(300);
      const db = getDB();

      const newEntry: ActivityEntry = {
        id: Date.now(),
        documentId: "doc_act_" + Date.now(),
        name: payload.data.name,
        duration: payload.data.duration,
        calories: payload.data.calories,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };

      db.activityLogs.push(newEntry);
      saveDB(db);

      return { data: newEntry };
    },

    delete: async (documentId: string) => {
      await delay(300);
      const db = getDB();

      db.activityLogs = db.activityLogs.filter(
        (a) => a.documentId !== documentId
      );

      saveDB(db);
      return { data: { id: documentId } };
    },
  },

  imageAnalysis: {
    analyze: async (_formData: any) => {
      await delay(1500);

      const foods = [
        { name: "Apple", calories: 95 },
        { name: "Banana", calories: 105 },
        { name: "Avocado Toast", calories: 250 },
        { name: "Pizza Slice", calories: 300 },
      ];

      const randomFood =
        foods[Math.floor(Math.random() * foods.length)];

      return {
        data: {
          result: randomFood,
        },
      };
    },
  },
};

export default mockApi;