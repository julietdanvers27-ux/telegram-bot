exports.handler = async (event) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

  try {
    const update = JSON.parse(event.body || "{}");

    if (!update.message) {
      return {
        statusCode: 200,
        body: "OK",
      };
    }

    const message = update.message;

    const chatId = message.chat.id;
    const firstName = message.from.first_name || "Investor";
    const lastName = message.from.last_name || "";
    const username = message.from.username || "No Username";
    const text = message.text || "";

    if (text === "/start") {
      const notificationText =
        `🚀 New High-Intent Lead Detected!\n\n` +
        `👤 Name: ${firstName} ${lastName}\n` +
        `🆔 Username: @${username}\n` +
        `📍 Telegram ID: ${chatId}`;

      // Notify admin
      await sendMessage(
        BOT_TOKEN,
        ADMIN_CHAT_ID,
        notificationText
      );

      // Welcome user
      const welcomeMessage =
        `Welcome ${firstName}!\n\n` +
        `I've received your request to join the private trade logs.\n\n` +
        `Join the channel below:\n` +
        `https://t.me/your_channel_link`;

      await sendMessage(
        BOT_TOKEN,
        chatId,
        welcomeMessage
      );
    }

    return {
      statusCode: 200,
      body: "OK",
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: "Server Error",
    };
  }
};

async function sendMessage(token, chatId, text) {
  await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    }
  );
}
