const Book = require("../Models/BookM");
const Authors = require("../Models/AuthorM");
const Types = require("../Models/TypeM");
const Movies = require("../Models/MovieM");
const Reviews = require("../Models/ReviewsM");
const Rating = require("../Models/RatingM");

const register = async (req, res) => {
  try {
    const { title, summary, author, image, types, adaptation } = req.body;

    if (!title || !summary) {
      return res
        .status(400)
        .json({ message: "Le titre et le résumer  sont obligatoire" });
    }
    if (adaptation && adaptation.adapt === false) {
      adaptation.id_movie = null;
    }
    const book = new Book({
      title: title,
      summary: summary,
      author: author,
      image: image,
      types: types,
      adaptation: adaptation,
    });
    if (!author) book.author = null;
    // if (!types) book.types = null;
    // if (!adaptation) book.adaptation.id_movie = null;

    const savedBook = await book.save();

    if (author) {
      await Authors.findByIdAndUpdate(author, {
        $push: { books: savedBook._id },
      });
    }
    if (adaptation && adaptation.adapt === true && adaptation.id_movie) {
      await Movies.findByIdAndUpdate(adaptation.idBook, {
        "adaptation.adapt": true,
        "adaptation.idBook": savedBook._id,
      });
    }
    const populatedBook = await Book.findById(savedBook._id)
      .populate("author")
      .populate("types")
      .populate("adaptation.id_movie");

    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const bookId = req.body.id;

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    })
      .populate("author")
      .populate("types")
      .populate("adaptation.id_movie");

    if (!updatedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const supp = async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookToDelete = await Book.findById(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    await Reviews.deleteMany({ book: bookId });
    if (bookToDelete.adaptation.adapt === true) {
      await Movies.findByIdAndUpdate(bookToDelete.adaptation.id_movie, {
        "adaptation.adapt": false,
        "adaptation.idBook": null,
      });
    }
    await Authors.updateMany({ author: bookId }, { $pull: { author: bookId } });
    await bookToDelete.remove();
    res.status(200).json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("author")
      .populate("types")
      .populate("adaptation.id_movie");
    const invertedData = books.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId)
      .populate("author")
      .populate("types")
      .populate("reviews")
      .populate("rating")
      .populate("adaptation.id_movie");

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.title;
    const books = await Book.find({ title: new RegExp(query, "i") })
      .populate("author")
      .populate("types")
      .populate("adaptation.id_movie");

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, update, supp, all, one, search };
