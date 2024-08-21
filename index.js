const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/myBlog", { useNewUrlParser: true })
  .then(() => {
    const app = express();

    // Middleware pour parser les corps de requêtes en JSON
    app.use(express.json());

    // Route pour obtenir tous les posts
    app.get("/posts", async (req, res) => {
      const posts = await Post.find();
      res.send(posts);
    });

    // Route pour créer un nouveau post
    app.post("/posts", async (req, res) => {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
      });
      await post.save();
      res.send(post);
    });

    // Route pour obtenir un post spécifique par ID
    app.get("/posts/:id", async (req, res) => {
      try {
        const post = await Post.findById(req.params.id);
        if (!post) {
          return res.status(404).send("Post not found");
        }
        res.send(post);
      } catch (err) {
        res.status(500).send("Erreur serveur");
      }
    });

    // Route pour supprimer un post spécifique par ID
    app.delete("/posts/:id", async (req, res) => {
      try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
          return res.status(404).send("Post not found");
        }
        res.send("Post deleted successfully");
      } catch (err) {
        res.status(500).send("Erreur serveur");
      }
    });

    app.listen(3000, () => {
      console.log("Server has started!");
    });
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));
