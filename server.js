const express = require("express");
const app = express();

const albums = require("./albums.json");
const fs = require("fs");

const saveToJson = (arr) => {
  fs.writeFileSync("./albums.json", JSON.stringify(arr, null, 2));
};

const getAllAlbums = (req, res) => {
  res.send(albums);
};

const getAbumById = (req, res) => {
  const albumId = parseInt(req.params.albumId);
  const album = albums.find((a) => a.albumId === albumId);

  if (album) {
    res.send(album);
  } else {
    res.status(400).send("No album found");
  }
};

const saveNewAlbum = (req, res) => {
  const newAlbum = req.body;

  const sameAlbum = albums.find(
    (a) => a.collectionName === newAlbum.collectionName
  );

  if (sameAlbum) {
    res.status(400).send("this album already exists");
  }

  const maxId = Math.max(...albums.map((a) => a.albumId));
  newAlbum.albumId = maxId + 1;

  albums.push(newAlbum);
  saveToJson(albums);
  res.status(200).send(newAlbum);
};

const deleteAlbum = (req, res) => {
  const albumId = parseInt(req.params.albumId);
  const album = albums.find((a) => a.albumId === albumId);
  albumIndex = albums.indexOf(album);
  if (album) {
    albums.splice(albumIndex, 1);
    res.status(200).send(album);
    saveToJson(albums);
  } else {
    res.status(404).send("nothing found to delete");
  }
};

app.use(express.json());
app.get("/albums", getAllAlbums);
app.get("/albums/:albumId", getAbumById);
app.post("/albums", saveNewAlbum);
app.delete("/albums/:albumId", deleteAlbum);

const port = 4000;
app.listen(port, () => console.log("Server is up and running"));
