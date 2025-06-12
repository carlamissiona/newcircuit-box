// Import database functions for future use
const {
  getUserByEmailDB,
  getSearchedfriends,
  getSearchedchannels,
  postUserfriends,
  createUserDB,
  getUserSubsByEmail,
  postUsersubs,
  postMicro,
  postArticle,
} = require("../db");

const root =
  "https://3001-carlamission-newcircuit-d8ou6v00znw.ws-eu120.gitpod.io/";

// Show dashboard page
const showDashboard = (req, res) => {
  // Dashboard data for the authenticated user
  const dashboardData = {
    stats: {
      projects: 12,
      tasks: 48,
      completed: 32,
      pending: 16,
    },
    recentActivity: [
      {
        action: "Completed task",
        item: "Design homepage",
        time: "2 hours ago",
      },
      {
        action: "Added new task",
        item: "Implement login page",
        time: "4 hours ago",
      },
      {
        action: "Updated project",
        item: "Client website redesign",
        time: "1 day ago",
      },
      {
        action: "Joined project",
        item: "Mobile app development",
        time: "3 days ago",
      },
    ],
  };

  res.render("dashboard", {
    title: "Dashboard",
    user: req.user,
    data: dashboardData,
  });
};

const rendrHome = async (req, res) => {
  // get 5 notification history from 7 days ago
  let subs = null;
  let artcls = [];
  let email = req.user;
  // console.log(email);
  let user = await getUserSubsByEmail(email).then((value) => {
    // TODO : details may be invalid JSON

    console.log("====value===>>>>");
    console.log(value.length);
    if (value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        let { title } = JSON.parse(value[i].nc_details_article);
        artcls.push(JSON.parse(value[i].nc_details_article));
      }

      console.log(">>>>>>>>>>How To Parse the>>>>>>>>>>>>>>>>>>");
      console.log(JSON.parse(value[0]));
      subs = value;
    }
    subs = value;
  });

  console.log("user subs==");
  res.render("home", {
    title: "Express Auth App",
    useremail: req.user,
    userinfo: req.userinfo,
    subitems: artcls,
  });
};



const post_microblog = async (req, res) => {
  console.log("POSTING POSTING ");
  // console.log("POSTING POSTING ");
  const { message } = req.body;

  if (!message) {
    res.redirect("/app?error=Complete your posts. All fields required.");
  }
  let user = null;
  const userob = await getUserByEmailDB(req.user).then((vl) => {
    console.log("email == @getUserByEmailDB ");
    user = vl.id;
  });

  try {
    const postingblog = await postMicro({ message, user }).then((vl) => {
      console.log("postingblog");
      console.log("<== blogging");
      res.redirect("/app?message=You have successfully posted a blog");
    });

    res.redirect("home");
  } catch (error) {
    console.log("Error!!", error);
    res.redirect("/app?error=Server error");
  }
};

// post submit publisher editor page post_publishercontent
const post_publishercontent = async (req, res) => {
  // TODO : CHECK IF THE REQUEST IS FROM CREATOR
  let is_publisher;

  const { content, title } = req.body;
  console.log("channel ", req.user_ischannel);

  console.log("fn!!!!!================!!!!!!!!!!");
  console.log(req.userfullname);

  console.log("req.userinfo");
  console.log(req.userinfo);

  let userid = null;
  let categories = "[ Lifestyle, Street Children ]";
  let draft_status = "Draft_Start";

  console.log(req.userfullname);

  let details = "author & category";
  console.log("JSON.stringify(details)================================>>");
  // console.log(JSON.stringify(details));

  const userob = await getUserByEmailDB(req.user).then((vl) => {
    console.log("email == @getUserByEmailDB ");
    userid = vl.id;
  });

  try {
    const posting = await postArticle({
      content,
      userid,
      draft_status,
      details,
    }).then((vl) => {
      console.log("postingblog");
      console.log("<== blogging");
      console.log(vl);
      res.redirect("/editor?message=You have successfully posted a blog");
    });
  } catch (error) {
    console.log("Error!!", error);
    res.redirect("/editor?error=Server error");
  }
};

// get publisher editor page
const render_editor = async (req, res) => {
  let subs = null;
  let artcls = [];
  let email = req.user;
  let is_publisher;

  res.render("publisher_editor", {
    title: "Search Search",
    user: req.user,
  });
};

//publisher home
const render_publisher = async (req, res) => {
  let subs = null;
  let artcls = [];
  let email = req.user;
  let is_publisher;

  res.render("publisher_home", {
    title: "Creator's Home",
    user: req.user,
  });
};

// get page /search_page for
const get_search_page = async (req, res) => {};

const get_search = async (req, res) => {
  // get micro blog and render profile

  let data = req.headers.xdata || "default";
  if (typeof req.cookies.xdata1 === "undefined") {
    console.log("no cookie!");
    data = [];
  } else {
    console.log("req.cookies");
    data = req.cookies.xdata1 || "default";
    data = JSON.parse(data);
    console.log(data);
  }
  res.cookie("xdata1", null, { httpOnly: true });
  res.clearCookie("xdata1");

  console.log("x-data");
  console.log(data);
  res.render("search", {
    title: "Search Search",
    results: data,
    user: req.user,
  });
};

const post_search = async (req, res) => {
  const { searched } = req.body;
  let subs = [];
  let result = [];

  let friends = await getSearchedfriends({ searched }).then(async (value) => {
    subs = [];
    console.log("v!alue connection search");

    for (let i = 0; i < value.length; i++) {
      //todo : make the result contain name and email plus 40 chars desc
      console.log(value[i]);
      result.push(JSON.parse(value[i].nc_details_user));
      //if(){} filter channel name "Channel: - " to get people results to add to results.people
    }
  });

  console.log("result");
  console.log(result);
  res.setHeader("xdata", JSON.stringify(result));
  res.header("xdata2", JSON.stringify(result));
  res.cookie("xdata1", JSON.stringify(result));

  res.cookie("xdata1", JSON.stringify(result), { httpOnly: true });
  console.log("res.get(X-Data-Results)");
  console.log(res.get("xdata"));
  console.log(res.xdata);
  res.redirect("/search?messsage=Successfully subscribe!");

  //   results: result,
  // });
};

const get_frsearch = async (req, res) => {
  // get micro blog and render profile

  res.render("friends_search", { title: "Get Search", user: req.user });
};
const post_subs = async (req, res) => {
  let email = req.user;
  const { channel_email } = req.body;
  let val = null;
  const channel = await getUserByEmailDB(channel_email).then((vl) => {
    console.log("email == @post_subs ");
    console.log(vl.id);
    val = vl.id;
    // check here when the vl.id is undefined it means no email on db
  });

  if (!channel_email) {
    res.redirect("/app?error= Server error.Subscribing failed.");
  }

  try {
    const usersub = await postUsersubs({ email, val }).then((vl) => {
      console.log("email == @postUsersubs ");
      console.log(vl);

      res.redirect("/search?messsage=Successfully subscribe!");
    });
  } catch (error) {
    console.log("Error!! usersub", error);
    res.redirect("/app?error=Server error");
  }

  res.render("search", { title: "Get Search", user: req.user });
}; // end post subs

const post_friends = async (req, res) => {
  let email = req.user;
  const { fremail } = req.body;
  let val = null;

  console.log("fremail");
  console.log(fremail);

  const channel = await getUserByEmailDB(fremail).then(async (vl) => {
    val = vl.id;
    // check here when the vl.id is undefined it means no email on db

    try {
      const userfr = await postUserfriends({ fremail, val }).then((vl) => {
        console.log("email == @postUsersubs value is undefined ");
        console.log(vl);

        res.redirect("/search?messsage=Successfully subscribed!");
      });
    } catch (error) {
      console.log("Error!! usersub", error);
      res.redirect("/app?error=Server error");
    }
  });

  if (!fremail) {
    res.redirect("/app?error= Server error. Subscribing failed.");
  }

  res.render("search", { title: "Get Search", user: req.user });
}; // end post subs


const draft_process = async (req, res) => {
  
  // console.log("POSTING POSTING ");
  // console.log("POSTING POSTING ");
 

  let user = null;
  const chk_db_artcl = ;
  const chk_db_procssr =; 

  
  try {
    const postingblog = await postMicro({ message, user }).then((vl) => {
      console.log("postingblog");
      console.log("<== blogging");
      res.redirect("/app?message=You have successfully posted a blog");
    });

    res.redirect("home");
  } catch (error) {
    console.log("Error!!", error);
    res.redirect("/app?error=Server error");
  }
};

module.exports = {
  showDashboard,
  rendrHome,
  post_microblog,
  get_search,
  post_subs,
  get_frsearch,
  post_friends,
  post_search,
  render_publisher,
  post_publishercontent,
  render_editor,
  draft_process,
};
