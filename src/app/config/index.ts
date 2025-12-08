import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  saltRound: Number(process.env.SALT_ROUND) || 5,
  accessSecret: process.env.ACCESS_SECRET!,
  accessExpire: process.env.ACCESS_EXPIRE!,
  refreshSecret: process.env.REFRESH_SECRET!,
  refreshExpire: process.env.REFRESH_EXPIRE!,
  databaseUrl: process.env.DATABASE_URL!,
};
