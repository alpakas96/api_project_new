import connection from './connections.js'
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import express from "express";
import cors from "cors";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import path from 'path';
import * as url from 'url';

//these allow us to make simple HTTP requests to our own server
import request from 'request'; 
import { MongoClient } from 'mongodb';

const dbURL = 'mongodb://localhost:27017';
const dbName = 'myDatabase'; 

function downloadImage(url){
  MongoClient.connect(dbURL, {useUnifiedTopology: true}, function(err, client) {
    console.log("MongoClient connected to the server"); 

    const db = client.db(dbName); 

    //downloading the image from the URL variable: 
    request.get({url: url, encoding: 'binary'}, function(err, response, body) {
      if(err) {
        console.log(err); 
        return; 
      }

      //creating a new mongodb document with the image data 
      const newImage = { 
        data: new Buffer.from(body, 'binary'), 
        contentType: 'image/jpeg'
      };

      //inserting the new image into the images collection 
      db.collection('images').insertOne(newImage, function(err, result) {
        console.log('Image saved to the database'); 
        // client.close(); 
      });

      console.log(db.collection('images'))
    });
  });
}

//these next two lines give us a package that lets us use .env variables

import * as dotenv from 'dotenv'
dotenv.config()

//this brings in the api key stored in the .env file
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

  downloadImage(prompt.data.data[0].url);

  // Get the documents collection
  const collection = connection.collection('images');

  //manually incrementing through .forEach
  let i = 0; 
  // collection.find returns an array
  collection.find({}).forEach (() => {
    let newSrc = collection[i]._id.data.binary.base64; 
    //append child img tag to html with newSrc prop value
    i++;
  });

  res.json({ url });

});
