const TelegramBot = require('node-telegram-bot-api');

// Token env variable se lo, ya seedha yahan daal do (sirf testing ke liye)
const token = process.env.BOT_TOKEN || '8901568527:AAFEesWGaJw64xrhWHLN03kA_Ur2aGUbhz0';

if (!token || token === 'YOUR BOT TOKEN') {
  console.error('BOT_TOKEN set nahi hai. Env variable set karo ya upar wali line mein token daalo.');
  process.exit(1);
}

const bot = new TelegramBot(token, {
  polling: {
    params: {
      // Ye batana zaroori hai warna Telegram chat_join_request event bhejta hi nahi
      allowed_updates: ['message', 'chat_join_request']
    }
  }
});

console.log('Bot started. Waiting for messages and channel join requests...');

// Jab koi user group/channel join request bhejta hai
bot.on('chat_join_request', async (req) => {
  const chatId = req.chat.id;
  const userId = req.from.id;
  const userName = req.from.first_name || 'there';

  console.log(`Join request aayi: ${userId} (${userName}) chat ${chatId} se`);

  try {
    await bot.sendMessage(
  userId,
  `🎉 Welcome to VIP Team! 💯

🔗 Registration Link:
https://www.ts777.online/#/register?invitationCode=324515976095

✅ Register karke deposit karo aur Screenshot bhej do. Screenshot verify hote hi tumhe VIP Group me add kar diya jayega. 🚀`
);

await bot.sendDocument(userId, "./ITHESH VIP PANEL.apk", {
  caption: "📲 Download App"
});

await bot.sendVoice(userId, "./audio.ogg");

await bot.sendMessage(
  userId,
  "✅ Deposit karke Screenshot Send karo."
);
    console.log(`DM sent to ${userId}`);
  } catch (dmError) {
    console.error(`DM FAILED for ${userId}: ${dmError.message}`);
    if (dmError.response && dmError.response.body) {
      console.error('Telegram response:', JSON.stringify(dmError.response.body));
    }
  }
});

// Jab koi user normal message bhejta hai
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'there';
  const text = msg.text;

  console.log(`Message aaya: ${userName} (${chatId}) - "${text}"`);

  // Yahan apna reply logic daalo, e.g.:
  // bot.sendMessage(chatId, `Aapne bheja: ${text}`);
});

// Kisi bhi tarah ki polling error ko crash hone se bachao
bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});

// Graceful shutdown: Railway restart/redeploy karte waqt purana polling connection
// poori tarah band karo, warna naya instance 409 conflict dega
let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} mila, bot ko gracefully band kar rahe hain...`);
  try {
    await bot.stopPolling();
    console.log('Polling successfully stop ho gayi.');
  } catch (err) {
    console.error('Polling stop karte waqt error:', err.message);
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
