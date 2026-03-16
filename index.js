const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const UserRouter = require("./src/routes/UserRouter");
const ProductsRouter = require("./src/routes/ProductRouter");
const cartRouter = require("./src/routes/CartRouter");
const feedbackRouter = require("./src/routes/FeedBackRouter");
const questionRouter = require("./src/routes/questionRouter");
const wishListRouter = require("./src/routes/WishListRouter");
const salerRouter = require("./src/routes/SalerRouter");
const invoiceDownloadRouter = require("./src/routes/InvoiceDownloadRouter");
const orderRouter = require("./src/routes/OrderRouter");
const bugReportRouter = require("./src/routes/BugReportRouter");
const notesRouter = require("./src/routes/NotestRouter");
const ticketRouter = require("./src/routes/TicketRouter");
const communityFeedRouter = require("./src/routes/communityFeedRouter");

const app = express();
//
app.use(express.json());
app.use(cors());
connectDB();

// app.get("/", (req, res) => {
//   try {
//     res.status(201).send({ message: "Hello, world!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Backend API Dashboard</title>
    <style>
      body{
        font-family: Arial, sans-serif;
        background:#0f172a;
        color:#e2e8f0;
        padding:40px;
      }
      .container{
        max-width:900px;
        margin:auto;
      }
      h1{
        color:#38bdf8;
        margin-bottom:10px;
      }
      p{
        color:#94a3b8;
        margin-bottom:30px;
      }
      .api{
        background:#1e293b;
        padding:18px;
        border-radius:10px;
        margin-bottom:14px;
      }
      .title{
        font-size:18px;
        font-weight:bold;
      }
      .desc{
        font-size:14px;
        color:#94a3b8;
        margin:6px 0 10px 0;
      }
      a{
        color:#22c55e;
        text-decoration:none;
        font-weight:bold;
      }
      a:hover{
        text-decoration:underline;
      }
    </style>
  </head>

  <body>

  <div class="container">

    <h1>🚀 Backend API Dashboard</h1>
    <p>Available service endpoints for this backend.</p>

    <div class="api">
      <div class="title">👤 Users</div>
      <div class="desc">User account management and authentication.</div>
      <a href="/api/users" target="_blank">Open → /api/users</a>
    </div>

    <div class="api">
      <div class="title">🛍 Products</div>
      <div class="desc">Product catalog and product information.</div>
      <a href="/api/products" target="_blank">Open → /api/products</a>
    </div>

    <div class="api">
      <div class="title">🛒 Cart</div>
      <div class="desc">Shopping cart management APIs.</div>
      <a href="/api/cart" target="_blank">Open → /api/cart</a>
    </div>

    <div class="api">
      <div class="title">⭐ Product Feedback</div>
      <div class="desc">Customer reviews and product ratings.</div>
      <a href="/api/product-feedback" target="_blank">Open → /api/product-feedback</a>
    </div>

    <div class="api">
      <div class="title">❓ Product Questions</div>
      <div class="desc">Questions related to products.</div>
      <a href="/api/product-question" target="_blank">Open → /api/product-question</a>
    </div>

    <div class="api">
      <div class="title">❤️ Wishlist</div>
      <div class="desc">Save products for future purchase.</div>
      <a href="/api/product-wishlist" target="_blank">Open → /api/product-wishlist</a>
    </div>

    <div class="api">
      <div class="title">🏪 Seller</div>
      <div class="desc">Seller management and listings.</div>
      <a href="/api/saler" target="_blank">Open → /api/saler</a>
    </div>

    <div class="api">
      <div class="title">🧾 Invoices</div>
      <div class="desc">Download order invoices.</div>
      <a href="/api/invoices" target="_blank">Open → /api/invoices</a>
    </div>

    <div class="api">
      <div class="title">📦 Orders</div>
      <div class="desc">Order creation and management.</div>
      <a href="/api/orders" target="_blank">Open → /api/orders</a>
    </div>

    <div class="api">
      <div class="title">🐞 Bug Reports</div>
      <div class="desc">Report application bugs.</div>
      <a href="/api/bug-report" target="_blank">Open → /api/bug-report</a>
    </div>

    <div class="api">
      <div class="title">📝 Notes</div>
      <div class="desc">Create and manage user notes.</div>
      <a href="/api/notes" target="_blank">Open → /api/notes</a>
    </div>

    <div class="api">
      <div class="title">🎫 Support Tickets</div>
      <div class="desc">Customer support ticket system.</div>
      <a href="/api/tickets" target="_blank">Open → /api/tickets</a>
    </div>

    <div class="api">
      <div class="title">🌐 Community Feed</div>
      <div class="desc">Posts, comments, likes and discussions.</div>
      <a href="/api/feed" target="_blank">Open → /api/feed</a>
    </div>

  </div>

  </body>
  </html>
  `);
});

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads"));

app.use("/api/users", UserRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/product-feedback", feedbackRouter);
app.use("/api/product-question", questionRouter);
app.use("/api/product-wishlist", wishListRouter);
app.use("/api/saler", salerRouter);
app.use("/api/invoices", invoiceDownloadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/bug-report", bugReportRouter);

app.use("/api/notes", notesRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/feed", communityFeedRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
