const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/send-messages", async (req, res) => {
  try {
    const { messages } = req.body;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let messagesSent = 0;
    let messagesFailed = 0;

    async function sendMessage(phoneNumber, message) {
      await page.goto(
        `https://web.whatsapp.com/send?phone=+55${phoneNumber}&text=${message}`
      );
      await delay(30000);

      const errorMessage = await page.evaluate(() => {
        const errorElement = document.querySelector(".f8jlpxt4.iuhl9who");
        return errorElement ? errorElement.innerText : null;
      });

      if (errorMessage) {
        messagesFailed++;
        await page.click("button.emrlamx0.aiput80m");
      } else {
        messagesSent++;

        await page.waitForSelector("button[aria-label='Enviar'].tvf2evcx");
        await page.click("button[aria-label='Enviar'].tvf2evcx");
        await delay(10000);
      }
    }

    for (const { phoneNumber, message } of messages) {
      await sendMessage(phoneNumber, message);
    }

    await browser.close();

    res.status(200).json({
      success: true,
      message: "Mensagens enviadas com sucesso",
      messagesSent,
      messagesFailed,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao enviar as mensagens" });
  }
});

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
