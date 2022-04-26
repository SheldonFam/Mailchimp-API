const express = require("express");
const bodyParsel = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");

app.use(express.static("public"));

app.use(bodyParsel.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const email = req.body.email;
  const message = req.body.message;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          MESSAGE: message,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/7e30ba891a";

  const options = {
    method: "post",
    auth: "Sheldon Fam:7eca1e0d3ef4b5dbe405d40842895768-us14",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is connected");
});
