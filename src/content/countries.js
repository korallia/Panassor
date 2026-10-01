// Pays proposés quand l'adresse de livraison n'est pas canadienne.
// Codes ISO à 2 lettres ; les noms viennent du navigateur, dans la langue
// du site (Intl.DisplayNames), donc rien à traduire à la main.
const COUNTRY_CODES = [
  "AD","AE","AG","AI","AL","AM","AO","AR","AT","AU","AW","AZ","BA","BB","BD","BE","BF","BG","BH","BI",
  "BJ","BM","BN","BO","BR","BS","BT","BW","BZ","CH","CI","CL","CM","CN","CO","CR","CV","CW","CY","CZ",
  "DE","DJ","DK","DM","DO","DZ","EC","EE","EG","ES","ET","FI","FJ","FO","FR","GA","GB","GD","GE","GF",
  "GH","GI","GL","GM","GN","GP","GR","GT","GU","GY","HK","HN","HR","HT","HU","ID","IE","IL","IN","IS",
  "IT","JM","JO","JP","KE","KG","KH","KN","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LS","LT","LU",
  "LV","MA","MC","MD","ME","MG","MK","ML","MN","MO","MQ","MR","MT","MU","MV","MW","MX","MY","MZ","NA",
  "NC","NE","NG","NI","NL","NO","NP","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PR","PT","PY",
  "QA","RE","RO","RS","RW","SA","SC","SE","SG","SI","SK","SL","SM","SN","SR","SV","SZ","TC","TG","TH",
  "TN","TO","TR","TT","TW","TZ","UA","UG","US","UY","UZ","VC","VE","VG","VI","VN","VU","WS","ZA","ZM","ZW",
];

// Les États-Unis en premier (la destination la plus fréquente), puis
// l'ordre alphabétique dans la langue du site.
export function getCountryOptions(language = "fr") {
  let names;
  try {
    names = new Intl.DisplayNames([language === "en" ? "en-CA" : "fr-CA"], { type: "region" });
  } catch {
    names = null;
  }

  const options = COUNTRY_CODES.map((code) => ({
    code,
    name: names?.of(code) || code,
  })).sort((a, b) => a.name.localeCompare(b.name, language));

  const us = options.find((option) => option.code === "US");
  return [us, ...options.filter((option) => option.code !== "US")];
}
