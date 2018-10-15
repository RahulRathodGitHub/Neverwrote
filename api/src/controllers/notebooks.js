const express = require("express");
const _ = require("lodash");
const models = require("../models");
const router = express.Router();

//Takes in the fields that are allowed to be set by the users.
function postFilter(obj) {
  return _.pick(obj, ['title']);
}

// The following returns all the notebooks in the order of their creation date, it also catched the exception that might get caught.
router.get("/", (req, res) => {
  models.Notebook.findAll({ order: [["createdAt", "DESC"]] })
    .then(notebooks => res.json(notebooks))
    .catch(err => res.status(500).json({ error: err.message }));
});

/* The following returns all the notes that belong to a particular notebookId,
 * It would return an erorr if this is not successful
 */
router.get("/:notebookId/notes",(req,res) => {
	models.Note.findAll({where:{notebookId: req.params.notebookId}})
    .then(notes => res.json(notes))
  	.catch(err => res.status(500).json({error: err.message}));
});

//Creates a new notebook using the posted data.
//Returns the new notebook.
router.post("/", (req, res) => {
  models.Notebook.create(postFilter(req.body))
    .then(notebook => res.json(notebook))
    .catch(err => res.status(422).json({ error: err.message }));
});

//Returns a single notebook by ID
router.get("/:notebookId", (req, res) => {
  models.Notebook.findById(req.params.notebookId)
    .then(notebook => res.json(notebook))
    .catch(err => res.status(500).json({ error: err.message }));
});

//Deletes a single notebook by ID
router.delete("/:notebookId", (req, res) => {
  models.Notebook.destroy({ where: { id: req.params.notebookId } }) //findById(req.params.notebookId))
    .then(() => res.json({}))
    .catch(err => res.status(500).json({ error: err.message }));
});

//Updates the attributes of a particular notebook.
//Returns the updates notebook.
router.put("/:notebookId", (req, res) => {
  models.Notebook.findById(req.params.notebookId)
    .then(notebook => notebook.update(postFilter(req.body)))
    .then(notebook => res.json(notebook))
    .catch(err => res.status(500).json({ error: err.message }));
  /*models.Notebook.update({where:{id: req.params.notebokId}})
  .then(notebook => res.json(notebook) )
  .catch(err => res.status())
  */ //will this work??
});

module.exports = router;

