const Authors = require("../Models/AuthorM");
const Books = require("../Models/BookM");

const register = async (req, res) => {
  try {
    const { author, books, image } = req.body;

    const newAuthor = new Authors({
      author,
      image,
      books,
    });
    const savedAuthor = await newAuthor.save();
    if (books && books.length > 0) {
      for (let bookId of books) {
        await Books.findByIdAndUpdate(bookId, {
          $addToSet: { author: savedAuthor._id },
        });
      }
    }

    res.status(201).json(savedAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const authorId = req.body.id;
    const author = await Authors.findById(authorId);
    const updatedAuthor = await Authors.findByIdAndUpdate(authorId, req.body, {
      new: true,
    });
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }
    const oldBooks = author.books;
    const newBooks = updatedAuthor.books;
    const removedBooks = oldBooks.filter(
      (bookId) => !newBooks.includes(bookId)
    );
    for (let bookId of removedBooks) {
      await Books.findByIdAndUpdate(bookId, {
        $pull: { author: authorId },
      });
    }
    const addedBooks = newBooks.filter((bookId) => !oldBooks.includes(bookId));
    for (let bookId of addedBooks) {
      await Books.findByIdAndUpdate(bookId, {
        $addToSet: { author: authorId },
      });
    }
    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const supp = async (req, res) => {
  try {
    const authorId = req.params.id;
    const deletedAuthor = await Authors.findByIdAndDelete(authorId);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }
    await Books.updateMany(
      { author: authorId },
      { $pull: { author: authorId } }
    );
    res.status(200).json({ message: "Auteur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const authors = await Authors.find().populate("books");
    const invertedData = authors.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await Authors.findById(authorId).populate("books");

    if (!author) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.author;
    const authors = await Authors.find({
      author: new RegExp(query, "i"),
    }).populate("books");

    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAuthorMovies = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await Authors.findById(authorId).populate("books");
    console.log("author: ", author);

    if (!author) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, update, supp, all, one, search, getAuthorMovies };
