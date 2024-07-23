import { createServer } from "http";
import { PORT } from "./config/index.js";
import {
  initializeDB,
  initializeDailyAttendance,
  initializeDailyAttendanceCron,
  initializeFaceRecognitionModels,
} from "./config/init.js";
import app from "./app.js";

const server = createServer(app);

initializeDB();
initializeFaceRecognitionModels();
initializeDailyAttendance();
initializeDailyAttendanceCron();

server.listen(PORT, () => {
  console.log("Server live on PORT: ", PORT);
});