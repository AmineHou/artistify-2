const express = require("express");
const router = new express.Router();
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const AlbumModel = require("./../model/Album");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  try {
    await AlbumModel.find()
      .populate("artist label")
      .then((albums) => {
        console.log(albums);
        res.render("dashboard/albums", { albums });
      })
      .catch((err) => console.error(err));
  } catch (err) {
    next(err);
  }
});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();
  await res.render("dashboard/albumCreate", { artists, labels });
});

// GET - update one album (form)
router.get("/update/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const albumOnDisplay = await AlbumModel.findById(id);
    const artists = await ArtistModel.find();
    const labels = await LabelModel.find();
    console.log("this is the album we try to update", albumOnDisplay);
    await res.render("dashboard/albumUpdate", {albumOnDisplay, artists, labels});
  } catch (err) {
    next(err);
  }
});

// POST - update one album

router.post("/update/:id", uploader.single("cover"), async (req, res, next) => {
  try {
  const id = req.params.id;
  console.log(id);
  console.log("thisistheconsolelogofREGBODY", req.body);
  //
  if (req.file) {
    req.body.cover = req.file.path
  }
  const updatedAlbum = await AlbumModel.findByIdAndUpdate(id, req.body,
   {new: true});
  res.redirect("/dashboard/albums");
  }
  catch (err){
  next(err)
  }
})

// GET - delete one album
router.get("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await AlbumModel.findByIdAndDelete(id);
    await res.redirect("/dashboard/albums");
  } catch (err) {
    next(err);
  }
});

// POST - create one album
router.post("/", uploader.single("cover"), async (req, res, next) => {
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/albums");
  } catch (err) {
    next(err);
  }
});



module.exports = router;
