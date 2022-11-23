const nodemailer = require("nodemailer");
const url = `${process.env.SITE}`;

/*
var transporter = nodemailer.createTransport({
  host: "smtp.kitlivre.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "naoresponda@kitlivre.com", // generated ethereal user
    pass: "Livre@2022", // generated ethereal password
  },
});
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "biomob.teste@gmail.com",
    pass: "rzlfarjwubklorzo",
  },
});

// async..await is not allowed in global scope, must use a wrapper

module.exports = {
  async sendMail(email, senha) {
    let info = await transporter.sendMail({
      from: "naoresponda@kitlivre.com", // sender address
      to: email, // list of receivers
      subject: "Conclua o cadastro", // Subject line
      text: `Cadastro criado com sucesso sua senha é ${senha}`, // plain text body
      html: `<p>Cadastro criado com sucesso sua senha é</p> <b> ${senha} </b>`, // html body
    });

    //console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  },
  async sendMailSimples(email, documento) {
    let info = await transporter.sendMail({
      from: "naoresponda@kitlivre.com", // sender address
      to: email, // list of receivers
      subject: "Conclua o cadastro", // Subject line
      text: `Cadastro criado com sucesso crie sua senha `, // plain text body
      html: `<p>Cadastro criado com sucesso <br> cire sua senha</p> ${url}/troca-senha?documento=${documento}`, // html body
    });

    //console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  },
  async sendMailCadastro(email, documento) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const activationLink = `${process.env.SITE}/activate-user/${documento}`;
      const mailOptions = {
        from: "Biomob",
        to: email,
        subject: "Conclua seu cadastro",
        text: `Recebemos seu cadastro para acessar nosso APP e utilizar o MobLivre.
Para concluir seu cadastro, acesse o link a segui e preencha seus dados para ativar seu login.
${activationLink} `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  async sendMailRecoverPassword(email, documento) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const changePasswordLink = `${process.env.SITE}/trocar-senha?doc=${documento}`;
      const mailOptions = {
        from: "Biomob",
        to: email,
        subject: "Trocar senha",
        text: `Acesse o link abaixo e troque sua senha agora.
${changePasswordLink}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
