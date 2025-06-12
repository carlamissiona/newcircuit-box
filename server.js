const app = require("./app");

const PORT = process.env.PORT || 3019;


async function fetch_a() {
  try {
console.log("after 2 min hiiiiiiii");
console.log("hiiiiiiii");
console.log("hiiiiiiii");

    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}
 


async function fetch_b() {
  try {
console.log("after 2 min hiiiiiiii");
console.log("hiiiiiiii");
console.log("hiiiiiiii");

    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("{{{{app}}}}");
  console.log(app);

setInterval(fetch_a, 120000); // Calls greet() every 1000 milliseconds (1 second)
setInterval(fetch_b, 300000); // Calls greet() every 1000 milliseconds (1 second)
 
});

