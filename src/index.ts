import { configDotenv } from "dotenv";
configDotenv({
  path: "./.env",
});
import app from "./server";

const PORT = process.env.PORT || 8000;

async function init() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
init();
