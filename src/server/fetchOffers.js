import fetch from "node-fetch";
import cheerio from "cheerio";
import { supabase } from "./supabase.js";

const categories = [
  "kredyty-gotowkowe",
  "kredyty-konsolidacyjne",
  "kredyty-hipoteczne",
  "kredyty-samochodowe",
  "chwilowki",
  "pozyczki",
  "pozyczki-bankowe-online",
  "konta-osobiste",
  "karty-kredytowe",
  "konta-oszczednosciowe",
  "lokaty-i-inwestycje",
  "ubezpieczenia-ac-oc",
  "pozostale-ubezpieczenia",
  "konta-dla-firm",
  "kredyty-dla-firm"
];

export async function fetchOffersFromPanel() {

  let allOffers = [];

  for (const cat of categories) {

    try {
      const url = `https://toomasz-money.oferty-kredytowe.pl/${cat}`;
      const res = await fetch(url);
      const html = await res.text();

      const $ = cheerio.load(html);

      $(".offer, .item, .product").each((i, el) => {

        const name =
          $(el).find("h2, h3, .title").text().trim();

        const link =
          $(el).find("a").attr("href");

        if (name && link) {
          allOffers.push({
            name,
            url: link.startsWith("http")
              ? link
              : "https://toomasz-money.oferty-kredytowe.pl" + link,
            category: cat,
            country: ["PL"],
            device: ["mobile", "desktop"],
            epc: 1
          });
        }
      });

    } catch (e) {
      console.log("Błąd kategorii:", cat);
    }
  }

  // zapis do Supabase
  for (const o of allOffers) {
    await supabase.from("offers").upsert([o], {
      onConflict: ["name"]
    });
  }

  console.log("✅ FETCH ZAKOŃCZONY");
  console.log("📊 LICZBA OFERT:", allOffers.length);

  return allOffers.length;
}
