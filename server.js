import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import mailchimp from "@mailchimp/mailchimp_marketing";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const listId = "28b10bc0d2";

mailchimp.setConfig({
  apiKey: "595a394538202d9cd9f7d6e0303e600e-us21",
  server: "us21",
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});
app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName + lastName + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us21.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    method: "POST",
    auth: "zyga:595a394538202d9cd9f7d6e0303e600e-us21",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.send(`${__dirname}/failure.html`);
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(3000, () => {
  console.log("server started");
});
