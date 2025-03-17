import cron from "node-cron";
import { deleteNewsExternalId, fecthDataNewsExternal } from "../controllers/news.controllers";

// cron untuk fecth data setiap 6 jam sekali
cron.schedule("*0 */6 * * *",async () => {
    console.log("feching news every 6 hours");
    await fecthDataNewsExternal
    console.log("✅ External news updated!")
});

// cron untuk menghapus berita external yang lebih dari 1 minggu setiap jam 12 malam
cron.schedule("0 0 */7 * *",async () => {
    console.log("🗑️ Deleting expired external news...");
    await deleteNewsExternalId
    console.log("✅ External news deleted!")
})

console.log("🚀 Cron jobs initialized!");