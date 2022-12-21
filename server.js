import express from "express";
import cors from "cors";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import path from 'path'
import * as url from 'url';

//these next two lines give us a package that should let us use .env variables
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const apiKey = process.env.MY_API_KEY;

// const _filename = url.fileURLToPath(import.meta.url); 
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const app = express();

//this line makes all files at __dirname accessable to the server 
app.use(express.static(__dirname))
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("port running!");
});

app.get("/", (req, res) => {
  // res.json({ hello: "World" });
  res.sendFile(path.join(__dirname,'/index.html'));
});

app.get("/data/:user_input", async (req, res) => {
  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const prompt = await openai.createImage({
    //prompt will be the user input
    prompt: req.params.user_input,
    //number of images to generate (max 10):
    n: 1,
    //must be Must be one of 256x256, 512x512, or 1024x1024:
    size: "1024x1024",
  });

  let url = prompt.data.data[0].url;

  // let response = await axios.get(prompt);
  // console.log(response);

  res.json({ url });
});
