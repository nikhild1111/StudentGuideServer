const Books = require('../models/Books');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');
const mailSender = require('../utils/mailSender');

// -------------------- UPLOAD BOOKS --------------------
exports.uploadbooks = async (req, res) => {
  try {
    const { semister, contact, price, booksname, year, department } = req.body;
    const { name, email, id } = req.user;

    const formattedBooksName = Array.isArray(booksname)
      ? booksname
      : booksname.split(',').map(book => book.trim());

    const imagesUrls = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const newBook = await Books.create({
      name,
      email,
      department,
      year,
      semister,
      price,
      contact: contact.toString(),
      booksname: formattedBooksName,
      images: imagesUrls
    });

    await User.findByIdAndUpdate(
      id,
      { $push: { booksProfile: newBook._id } },
      { new: true }
    );

    await mailSender(
      email,
      "Books Upload",
      `Hello ${name}, your books for Semester ${semister} were uploaded successfully.`
    );

    await mailSender(
      process.env.Email_USER,
      "Books Upload Notification",
      `New books uploaded by:
      Name: ${name}
      Contact: ${contact}
      Department: ${department}
      Semester: ${semister}
      Year: ${year}
      Email: ${email}`
    );

    res.status(200).json({
      success: true,
      message: "Books uploaded successfully",
      book: newBook
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// -------------------- GET ALL BOOKS WITH FILTERS --------------------
exports.getbooksall = async (req, res) => {
  try {
    let { page = 1, limit = 6, year, department, search, semister } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (year) filter.year = year;
    if (department) filter.department = department;
    if (semister) filter.semister = semister;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { booksname: regex }, 
        { department: regex }
      ];
    }

    const books = await Books.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Books.countDocuments(filter);

    res.status(200).json({
      success: true,
      books,
      pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      },
   
      message: "Books fetched successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

// -------------------- GET LOGGED-IN USER BOOKS --------------------
exports.getbooksuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("booksProfile")
      .select("name email booksProfile");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      books: user.booksProfile,
      message: "User books fetched successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch user books" });
  }
};

// -------------------- UPDATE BOOK --------------------
exports.updatebooks = async (req, res) => {
  try {
    const { bookId, booksname, price, contact, semister, year, department } = req.body;

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (req.user.role !== 'admin' && req.user.email !== book.email) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this book" });
    }

    // Delete old images if new ones uploaded
    if (req.files && req.files.length > 0) {
      for (let img of book.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    const imagesUrls = req.files && req.files.length > 0
      ? req.files.map(file => ({ url: file.path, public_id: file.filename }))
      : book.images;

    const formattedBooksName = Array.isArray(booksname)
      ? booksname
      : booksname.split(',').map(book => book.trim());

    const updatedBook = await Books.findByIdAndUpdate(
      bookId,
      {
        booksname: formattedBooksName,
        price,
        contact,
        semister,
        year,
        department,
        images: imagesUrls
      },
      { new: true }
    );

    await mailSender(
      book.email,
      "Book Updated",
      `Hello ${book.name}, your book "${formattedBooksName.join(', ')}" has been updated successfully.`
    );

    await mailSender(
      process.env.Email_USER,
      "Book Updated Notification",
      `Book updated by ${book.name} (${book.email})`
    );

    res.status(200).json({ success: true, message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
};

// -------------------- DELETE BOOK --------------------
exports.deletebooks = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (req.user.role !== 'admin' && req.user.email !== book.email) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this book" });
    }

    for (let img of book.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Books.findByIdAndDelete(bookId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { booksProfile: bookId } }, { new: true });

    await mailSender(
      book.email,
      "Book Deleted",
      `Hello ${book.name}, your book "${book.booksname.join(', ')}" has been deleted successfully.`
    );

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
};
