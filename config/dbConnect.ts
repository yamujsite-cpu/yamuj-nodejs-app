import { connect } from "mongoose";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (error) {
  console.warn("Failed to set custom DNS servers:", error);
}

const dbConnect = () => {
  connect(process.env.MONGO_URL!)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.error("DB Connection Error:", err);
    });
};

export default dbConnect;

