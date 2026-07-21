const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8901568527:AAFEesWGaJw64xrhWHLN03kA_Ur2aGUbhz0';
const ADMIN_ID = 851887045;

const bot = new TelegramBot(TOKEN, { polling: true });

const userMap = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcomeMessage = `🎉 Welcome to VIP Team! 💯

🔗 Registration Link:
https://www.ts777.online/#/register?invitationCode=324515976095

✅ Register karke deposit karo aur Screenshot bhej do. Screenshot verify hote hi tumhe VIP Group me add kar diya jayega. 🚀`;

  bot.sendMessage(chatId, welcomeMessage);
  bot.sendDocument(chatId, "./ITHESH VIP PANEL.apk", {
    caption: "📲 Download App"
  });
  bot.sendVoice(chatId, "./audio.ogg");
  bot.sendMessage(chatId, "✅ Deposit karke Screenshot Send karo.");
});

bot.on('chat_join_request', (req) => {
  const chatId = req.from.id;

  const joinMessage = `🎉 Welcome to VIP Team! 💯

🔗 Registration Link:
https://www.ts777.online/#/register?invitationCode=324515976095

✅ Register karke deposit karo aur Screenshot bhej do. Screenshot verify hote hi tumhe VIP Group me add kar diya jayega. 🚀`;

  bot.sendMessage(chatId, joinMessage);
  bot.sendDocument(chatId, "./ITHESH VIP PANEL.apk", {
    caption: "📲 Download App"
  });
  bot.sendVoice(chatId, "./audio.ogg");
  bot.sendMessage(chatId, "✅ Deposit karke Screenshot Send karo.");
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (chatId === ADMIN_ID) {
    if (msg.text && msg.text.startsWith('/start')) return;

    if (msg.reply_to_message) {
      const repliedId = msg.reply_to_message.message_id;
      const targetUserId = userMap[repliedId];

      if (targetUserId) {
        bot.sendMessage(targetUserId, msg.text);
      } else {
        bot.sendMessage(ADMIN_ID, 'Ye message kis user ka hai pata nahi chal raha, sahi message pe reply karo.');
      }
    }
    return;
  }

  if (msg.text && msg.text.startsWith('/start')) return;

  const userName = msg.from.first_name || 'User';
  const username = msg.from.username ? `@${msg.from.username}` : 'No username';

  const forwardText = `📩 New message\n👤 ${userName} (${username})\n🆔 ${chatId}\n\n${msg.text}`;

  bot.sendMessage(ADMIN_ID, forwardText).then((sentMsg) => {
    userMap[sentMsg.message_id] = chatId;
  });
});

bot.on('polling_error', (error) => {
  console.log(error.message);
});
