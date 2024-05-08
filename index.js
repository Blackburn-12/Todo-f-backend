import express, { response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PostModel } from "./models/post.models.js";
import dotenv from 'dotenv'

dotenv.config({
  path: './env',
})
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


const DB_CONNECT = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(
      `\n Mongo is connected and hosted at ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("error", error.message);
  }
};

DB_CONNECT();

app.post("/createpost", async (request, response) => {
  try {
    console.log("request", request.body);
    const { title, description, userId } = request.body;
    if (!title || !description || !userId) {
      response.json({
        message: "All fields are required",
        status: false,
      });
      return;
    }
    const obj = {
      title,
      description,
      userId,
    };

    const postCreate = await PostModel.create(obj);
    console.log("postCreate", postCreate);
    response.json({
      message: "Post created successfully",
      data: postCreate,
      status: true,
    });
  } catch (error) {
    response.json({
      message: error.message,
      data: [],
      status: false,
    });
  }
});

app.get("/getpost", async (request, response) => {
  try {
    const postGet = await PostModel.find({});
    response.json({
      message: "Post get successfully",
      data: postGet,
      status: true,
    });
  } catch (error) {
    response.json({
      message: error.message,
      data: [],
      status: false,
    });
  }
});

app.put("/updatepost/:id", async (request, response) => {
  try {
    const postID = request.params.id;
    const { title, description } = request.body;

    // Validate if postID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postID)) {
      return response.status(400).json({
        message: "Invalid post ID",
        status: false
      });
    }

    // Update the post
    const updatePost = await PostModel.findByIdAndUpdate(postID, { title, description }, { new: true });

    if (!updatePost) {
      return response.status(404).json({
        message: "Post not found",
        status: false
      });
    }

    response.json({
      message: "Post updated successfully",
      data: updatePost,
      status: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


app.delete("/deletepost/:id", async (request, response) => {
  try {
    const postID = request.params.id;
    const deletePost = await PostModel.findByIdAndDelete(postID);
    console.log("deletePost", deletePost);
    response.json({
      message: "Post deleted Successfully",
      status: true,
    });
  } catch (error) {
    response.json({
      message: error.message,
      data: [],
      status: false,
    });
  }

});

app.get("/", (request, response) => {
  response.json({
    message: "Server up",
  });
});

app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}/`)
);
