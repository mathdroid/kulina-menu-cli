#!/usr/bin/env node

const mri = require("mri");
const fetch = require("isomorphic-unfetch");
const columnify = require("columnify");
const cfonts = require("cfonts");
const gradient = require("gradient-string");
const ora = require("ora");

const color = gradient(["#f9423a", "#fd9714"]);
const muted = gradient(["#888888", "#888888"]);

const args = process.argv.slice(2);

const cli = mri(args, {
  string: ["count"],
  alias: {
    c: "count"
  },
  default: {
    count: 5
  }
});

let spinner;

new Promise(res => {
  console.log(color.multiline(cfonts.render("kulina-cli").string));
  const number = parseInt(cli.count, 10);
  const count = number > 0 ? number : 5;
  spinner = ora(`Mengambil ${count} menu dari API`).start();
  res(count);
}).then(getMenu);

async function getMenu(count) {
  const response = await fetch(
    `https://api.kulina.id/api/v8/meal/schedule?data_count=${count}`
  );
  const body = await response.json();
  spinner.succeed();
  const meals = body.data.map(d => ({
    tanggal: d.delivery_date,
    menu: color(d.meal.name) + "\n\n" + muted(d.meal.description),
    // deskripsi: d.meal.description,
    rating: d.meal.rating || "N/A",
    review: d.meal.review_count || "N/A"
  }));
  const columns = columnify(meals, {
    config: {
      menu: {
        maxWidth: 60
      }
    }
  });
  console.log(columns);
}
