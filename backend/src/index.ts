import express, { response } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AccountModel, UserModel } from "./db/db";
import { userMiddleware } from "./middleware/userMid";
import { AuthRequest } from "./types";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.post("/api/v1/user/signup", async (req: Request, res: Response) => {
  const signupSchema = z.object({
    username: z.string().min(8).max(50),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
  });
  const parsedSchema = signupSchema.safeParse(req.body);

  if (!parsedSchema.success) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }

  const { username, password, firstName, lastName } = parsedSchema.data;

  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const userDb = await UserModel.create({
      username,
      password: hashedPass,
      firstName,
      lastName,
    });

    const userId = userDb._id;
    const initialBalanceInRupees = 1 + Math.random() * 10000;
    const balanceInPaise = Math.floor(initialBalanceInRupees * 100);

    await AccountModel.create({
      userId,
      balance: balanceInPaise,
    });
    return res.status(201).json({
      message: "You are signed up",
    });
  } catch (e) {
    console.error("Signup error:", e);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/user/signin", async (req: Request, res: Response) => {
  const signupSchema = z.object({
    username: z.string().min(8).max(50),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character",
      }),
  });
  const parsedSchema = signupSchema.safeParse(req.body);

  if (!parsedSchema.success) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }
  const { username, password } = parsedSchema.data;

  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return res.status(403).json({
        message: "Account does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Incorrect Credentials",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({
      message: "Signin successful",
      token: token,
    });
  } catch (e) {
    console.error("Signin error:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.put(
  "/api/v1/user",
  userMiddleware,
  async (req: AuthRequest, res: Response) => {
    const updateSchema = z.object({
      username: z.string().min(8).max(50).optional(),

      password: z
        .string()
        .min(8)
        .refine((val) => /[A-Z]/.test(val), {
          message: "Password must contain uppercase",
        })
        .refine((val) => /[0-9]/.test(val), {
          message: "Password must contain number",
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
          message: "Password must contain special character",
        })
        .optional(),

      firstName: z.string().min(3).max(100).optional(),
      lastName: z.string().min(3).max(100).optional(),
    });

    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }
    if (!req.userId) {
      return res.status(400).json({
        message: "error! sign in again",
      });
    }

    try {
      const userId = req.userId;
      const updateData: any = {};

      // 🔹 Username update (with uniqueness check)
      if (parsed.data.username) {
        const existingUser = await UserModel.findOne({
          username: parsed.data.username,
        });

        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(409).json({
            message: "Username already taken",
          });
        }

        updateData.username = parsed.data.username;
      }

      // 🔹 First name
      if (parsed.data.firstName) {
        updateData.firstName = parsed.data.firstName;
      }

      // 🔹 Last name
      if (parsed.data.lastName) {
        updateData.lastName = parsed.data.lastName;
      }

      // 🔹 Password (hash before saving)
      if (parsed.data.password) {
        const hashed = await bcrypt.hash(parsed.data.password, 10);
        updateData.password = hashed;
      }

      await UserModel.updateOne({ _id: userId }, { $set: updateData });

      return res.status(200).json({
        message: "User updated successfully",
      });
    } catch (e) {
      console.error("Update error:", e);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);

app.get(
  "/api/v1/user/bulk",
  userMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      const filter =
        typeof req.query.filter === "string" ? req.query.filter : "";

      const users = await UserModel.find({
        _id: { $ne: userId },
        $or: [
          {
            firstName: {
              $regex: filter,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: filter,
              $options: "i",
            },
          },
          {
            username: {
              $regex: filter,
              $options: "i",
            },
          },
        ],
      }).select("username firstName lastName _id"); // projection

      return res.json({
        users,
      });
    } catch (e) {
      console.error("Bulk fetch error:", e);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);

app.get(
  "/api/v1/account/balance",
  userMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const account = await AccountModel.findOne({ userId });

      if (!account) {
        return res.status(404).json({
          message: "Account not found",
        });
      }

      return res.status(200).json({
        balance: account.balance / 100,
      });
    } catch (error) {
      console.error("Balance fetch error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);

app.post(
  "/api/v1/account/transfer",
  userMiddleware,
  async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();

    try {
      const { to, amount } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!to || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          message: "Invalid input",
        });
      }

      if (to === userId) {
        return res.status(400).json({
          message: "Cannot transfer to yourself",
        });
      }

      await session.startTransaction();

      const fromAccount = await AccountModel.findOne({ userId }, null, {
        session,
      });

      if (!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }

      const toAccount = await AccountModel.findOne({ userId: to }, null, {
        session,
      });

      if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Invalid recipient",
        });
      }

      await AccountModel.updateOne(
        { userId },
        { $inc: { balance: -amount } },
        { session },
      );

      await AccountModel.updateOne(
        { userId: to },
        { $inc: { balance: amount } },
        { session },
      );

      await session.commitTransaction();

      return res.status(200).json({
        message: "Transfer successful",
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Transfer error:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      session.endSession();
    }
  },
);
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("connected to the database");
  } catch (e) {
    message: "error while connecting to db";
  }
}

function startServer() {
  app.listen(3000, async () => {
    await connectDB();
    console.log("Server started");
  });
}

startServer();
