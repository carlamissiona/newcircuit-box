const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const channelsRoutes = require("./routes/channelsRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const editorRoutes = require("./routes/editorRoutes");

const { getDrafts } = require("./db");

const app = express();


//Kluster AI 



// kluster ai api key
const apiKey = "306f81b0-6ade-40cd-90be-ed5b1d8de539";

async function fetch_klsai(paragraph_art) {
  const response = await fetch("https://api.kluster.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "klusterai/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        { role: "system", content: "Play a role of a machine-like system giving exact answers and not being conversational; also not being talkative with how you think. You are given a paragraph and you must take 3 and minimum of 2 sentences which you know is not a misinformation. You must also support this sentence with supporting detail info with 1-2 sentences. You are like a web misinformation machine you don't have to explain your logic. Output with this format: first you must Number the sentence from paragraph (1-3). Cite this same sentence from paragraph. It must be only 1 sentence. Then under that numbering add a supporting info from your training; label it with text: Supporting Info. Finally attach your model name as a source of the supporting info, this is bec. you are a web misinformation system that validates paragraphs for better web literacy. " },
        { role: "user", content: paragraph_art }
      ]
    })
  }).then((fetch_value) => {
        
        if (!fetch_value.ok) {
          const error = await fetch_value.text();
          throw new Error(`API error: ${error}`);

        } else{

          console.log("fetch_value>>>>>>>>>>>>>>>>>");
          console.log(fetch_value);
          // console.log("Response:", data.choices[0].message);

        }

  });

}

fetch_klsai().catch(console.error);




// View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", authRoutes);
app.use("/app", dashboardRoutes);
app.use("/search", searchRoutes);
app.use("/channels", channelsRoutes);
app.use("/publisher", publisherRoutes);
app.use("/editor", editorRoutes);

app.use("/micro", dashboardRoutes);
app.use("/friends", friendsRoutes);
app.use("/myprofile", profileRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Express Auth App" });
});


app.get("/drafts_db", async (req, res) => {
  let user = null;
  let chk_db_artcl = null;
  try {
    console.log("getDrafts ==========================");
    const postingblog = await getDrafts().then((vl) => {
      // get variables
      let { plid, content, id, results, processor, articleid } = vl[0];
      console.log(plid);
      console.log("vl==========================");
      console.log(vl);

      const sentences = content
        .split(".")
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
      console.log(sentences);

      let pargph = sentences.slice(0, 20);
      const art_prgph = pargph.join(". ");
      console.log("==============art_prgph");
      console.log(art_prgph);
     
      fetch_klsai(art_prgph);
      
      
    });
  } catch (error) {
    console.log("Error!!", error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = app;
