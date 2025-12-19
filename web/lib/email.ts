type EmailPayload = {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? process.env.ADMIN_EMAIL;

export async function sendEmail(payload: EmailPayload) {
  console.log("[email] sendEmail called:", {
    to: payload.to,
    subject: payload.subject,
  });

  const hasSmtp =
    !!SMTP_HOST && !!SMTP_PORT && !!SMTP_USER && !!SMTP_PASS && !!SMTP_FROM;

  console.log("[email] hasSmtp:", hasSmtp);

  if (!hasSmtp) {
    console.info("[email] DEV MODE (dry-run)", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
    return { delivered: false, logged: true };
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  console.log("[email] SMTP send successful");

  return { delivered: true, logged: false };
}
