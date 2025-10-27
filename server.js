require("dotenv").config();
const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "myDatabase", // change this to your preferred database name
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Example Schema & Model
const ConSchema = new mongoose.Schema({
  content: {type: Array, default: []},
  secret: {type: String, default: ""},
  identify: Number,
},
{
  versionKey: false
});

const UserSchema = new mongoose.Schema({
  username: {type: String, default: ""},
  identify: Number
})

const NumSchema = new mongoose.Schema({
  value: Number
},
{
  versionKey: false
});


const viewSchema = new mongoose.Schema({
  page: { type: String, unique: true },
  viewers: { type: Number, default: 0 },
  lastViewed: { type: [Date], default: ()=> [new Date()] },
  lastDevices: {type: [String], default: []}
},{
  versionKey: false
});


const ContentModel = mongoose.model("Content", ConSchema);
const UserModel = mongoose.model("User", UserSchema);
const NumberModel = mongoose.model("Number", NumSchema);
const ViewSchema = mongoose.model("View", viewSchema);


// Get Data
// app.get("/", async (req, res) => {
//   try {
//     const contents = await ContentModel.find();
//     res.json(contents);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// })

app.get("/api/getnumbers", async (req, res) => {
  try {
    const numbers = await NumberModel.find();
    res.json(numbers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.get("/api/getcontents", async (req, res) => {
  try {
    const contents = await ContentModel.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.get("/api/getusers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

// Get all users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// Add new user
// app.post("/contents/", async (req, res) => {
//   try {
//     const newContent = new ContentModel(req.body);
//     await newContent.save();
//     res.json(newContent);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.get("/api/views", async (req, res) => {
  try {
    const viewers = await ViewSchema.find();
    res.json(viewers);
  } catch (err) {
    res.status(500).json({error: "Terjadi kesalahan"})
  }
})

app.get("/view/", async (req, res) => {
  
  try {
    const page = req.query.page || "default";
    const userAgent = req.headers['user-agent'];

    let deviceType = "Desktop";
    if (/mobile/i.test(userAgent)) deviceType = "Mobile";
    else if (/tablet/i.test(userAgent)) deviceType = "Tablet";

    await ViewSchema.findOneAndUpdate (
      { page },
      { 
        $inc: { viewers: 1 },
        $push: {
          lastViewed: new Date(Date.now() + 7 * 60 * 60 * 1000),
          lastDevices: deviceType
        },
      },
      { 
        upsert: true, new: true 
      }
    );

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({error: "Terjadi kesalahan server"})
  }
})


app.post("/api/contents", async (req, res) => {
  try {
    const newContent = new ContentModel(req.body);
    await newContent.save();
    res.json(newContent);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

app.post("/api/numbers", async (req, res) => {
  try {
    const newNumber = new NumberModel(req.body);
    await newNumber.save();
    res.json(newNumber);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

// update content
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContent = await UserModel.findByIdAndUpdate(
      id,
      req.body,
      {new: true}
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(updatedContent);

  } catch (err) {
    res.status(500).json({error: err.message})
  }
})


// Delete user by ID
// app.delete("/numbers/:id", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User deleted successfully", deletedUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

