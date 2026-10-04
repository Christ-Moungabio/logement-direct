// Données de démonstration : comptes, villes, annonces et photos.
// Usage : npm run db:seed (lit .env.local ou .env).
//
// Script de développement séparé, jamais importé par l'application. Il utilise
// SUPABASE_SECRET_KEY et lit les mots de passe des comptes de démo dans
// .env.local (DEMO_*_PASSWORD) : aucun mot de passe n'est écrit dans le dépôt.
//
// Le trigger `guard_listing_changes` empêche la clé secrète de publier une
// annonce. Le script passe donc par les vraies sessions : le propriétaire
// crée et publie, l'administrateur masque. La clé secrète sert seulement à
// créer les comptes, nettoyer les données précédentes et avancer la mise en
// ligne (sinon il faudrait attendre 5 minutes).
//
// Le script est rejouable : il supprime d'abord les annonces, photos et
// signalements des comptes de démonstration, et uniquement ceux-là.

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET = "listing-photos";
// Ancienne convention des comptes de démo (numéro → e-mail technique) : ces
// comptes sont repris et passent aux adresses @ndako.cg.
const LEGACY_EMAIL_DOMAIN = "whatsapp.logement-direct.app";

const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY,
  DEMO_TENANT_PASSWORD,
  DEMO_OWNER_PASSWORD,
  DEMO_ADMIN_PASSWORD,
} = process.env;

const REQUIRED_VARIABLES = {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY,
  DEMO_TENANT_PASSWORD,
  DEMO_OWNER_PASSWORD,
  DEMO_ADMIN_PASSWORD,
};

const missing = Object.keys(REQUIRED_VARIABLES).filter((name) => !REQUIRED_VARIABLES[name]);
if (missing.length) {
  console.error(`Variables manquantes dans .env.local ou .env : ${missing.join(", ")}.`);
  process.exit(1);
}

// Les mots de passe ne sont jamais écrits dans le dépôt : ils viennent de .env.local.
const tooShort = ["DEMO_TENANT_PASSWORD", "DEMO_OWNER_PASSWORD", "DEMO_ADMIN_PASSWORD"].filter(
  (name) => REQUIRED_VARIABLES[name].length < 12,
);
if (tooShort.length) {
  console.error(`Mots de passe trop courts (12 caractères minimum) : ${tooShort.join(", ")}.`);
  process.exit(1);
}

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false },
};
const admin = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  clientOptions,
);

export const DEMO_ACCOUNTS = {
  tenant: {
    role: "tenant",
    fullName: "Lucie Mabiala",
    email: "locataire@ndako.cg",
    whatsappNumber: "+242060000001",
    password: DEMO_TENANT_PASSWORD,
  },
  owner: {
    role: "owner",
    fullName: "Jean Moukoko",
    email: "proprietaire@ndako.cg",
    whatsappNumber: "+242060000002",
    password: DEMO_OWNER_PASSWORD,
  },
  admin: {
    role: "admin",
    fullName: "Équipe Ndako",
    email: "admin@ndako.cg",
    whatsappNumber: "+242060000003",
    password: DEMO_ADMIN_PASSWORD,
  },
};

const CITIES = {
  Brazzaville: [
    "Makélékélé",
    "Bacongo",
    "Poto-Poto",
    "Moungali",
    "Ouenzé",
    "Talangaï",
    "Mfilou",
    "Madibou",
    "Djiri",
  ],
};

const ROOMS = [
  "Façade",
  "Salon",
  "Chambre",
  "Cuisine",
  "Douche",
  "Cour",
  "Chambre 2",
  "Vue de la rue",
];
const PALETTE = [
  "#1d4ed8",
  "#0f766e",
  "#b45309",
  "#7c3aed",
  "#be123c",
  "#0369a1",
  "#4d7c0f",
  "#a21caf",
];

// Cas couverts : complète (8 photos, portes), une seule photo sans portes,
// « Bientôt libre », brouillon, fermée, masquée. V1 : Brazzaville uniquement.
const LISTINGS = [
  {
    key: "complete",
    target: "published",
    city: "Brazzaville",
    neighborhood: "Poto-Poto",
    type: "appartement",
    monthlyRent: 150000,
    advanceMonths: 3,
    water: "individual",
    electricity: "individual",
    doorsCount: 6,
    availableInDays: null,
    photos: 8,
    description:
      "Appartement au premier étage d'un immeuble calme, à deux rues du marché de Poto-Poto.\nDeux chambres, un salon, une cuisine et une douche intérieure. Compteurs d'eau et d'électricité individuels. Cour fermée.",
  },
  {
    key: "single-photo",
    target: "published",
    city: "Brazzaville",
    neighborhood: "Bacongo",
    type: "studio",
    monthlyRent: 75000,
    advanceMonths: 2,
    water: "shared",
    electricity: "shared",
    doorsCount: null,
    availableInDays: null,
    photos: 1,
    description:
      "Studio meublé proche de l'avenue Matsoua. Pièce principale avec coin cuisine, douche intérieure. Eau et électricité partagées avec la parcelle.",
  },
  {
    key: "available-soon",
    target: "published",
    city: "Brazzaville",
    neighborhood: "Moungali",
    type: "maison",
    monthlyRent: 250000,
    advanceMonths: 4,
    water: "individual",
    electricity: "individual",
    doorsCount: 3,
    availableInDays: 12,
    photos: 4,
    description:
      "Maison de trois chambres avec salon, cuisine et deux douches. Parcelle clôturée avec portail. Le locataire actuel part à la fin du mois.",
  },
  {
    key: "mfilou",
    target: "published",
    city: "Brazzaville",
    neighborhood: "Mfilou",
    type: "appartement",
    monthlyRent: 180000,
    advanceMonths: 3,
    water: "individual",
    electricity: "shared",
    doorsCount: 4,
    availableInDays: null,
    photos: 5,
    description:
      "Appartement lumineux de deux chambres dans une rue calme de Mfilou. Électricité partagée avec un autre logement de la parcelle.",
  },
  {
    key: "draft",
    target: "draft",
    city: "Brazzaville",
    neighborhood: "Ouenzé",
    type: "chambre",
    monthlyRent: 35000,
    advanceMonths: 1,
    water: "shared",
    electricity: "none",
    doorsCount: null,
    availableInDays: null,
    photos: 2,
    description:
      "Chambre simple dans une parcelle familiale. Brouillon non publié.",
  },
  {
    key: "closed",
    target: "closed",
    city: "Brazzaville",
    neighborhood: "Talangaï",
    type: "villa",
    monthlyRent: 400000,
    advanceMonths: 6,
    water: "individual",
    electricity: "individual",
    doorsCount: 2,
    availableInDays: null,
    photos: 3,
    description:
      "Villa de quatre chambres avec jardin. Annonce fermée : logement loué.",
  },
  {
    key: "hidden",
    target: "hidden",
    city: "Brazzaville",
    neighborhood: "Makélékélé",
    type: "appartement",
    monthlyRent: 120000,
    advanceMonths: 3,
    water: "individual",
    electricity: "individual",
    doorsCount: null,
    availableInDays: null,
    photos: 2,
    description:
      "Appartement de deux pièces. Annonce masquée par l'administrateur.",
  },
];

const legacyEmail = (number) =>
  `${number.replace(/\D/g, "")}@${LEGACY_EMAIL_DOMAIN}`;

function check(error, context) {
  if (error) {
    throw new Error(`${context} : ${error.message ?? error}`);
  }
}

async function findAuthUserByEmail(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    check(error, "Lecture des comptes");
    const user = data.users.find((u) => u.email === email);
    if (user) return user;
    if (data.users.length < 1000) return null;
  }
}

async function ensureCities() {
  const ids = {};
  for (const [cityName, neighborhoods] of Object.entries(CITIES)) {
    const { error: cityError } = await admin
      .from("cities")
      .upsert(
        { name: cityName },
        { onConflict: "name", ignoreDuplicates: true },
      );
    check(cityError, `Ville ${cityName}`);

    const { data: city, error } = await admin
      .from("cities")
      .select("id")
      .eq("name", cityName)
      .single();
    check(error, `Ville ${cityName}`);

    const { error: nError } = await admin.from("neighborhoods").upsert(
      neighborhoods.map((name) => ({ city_id: city.id, name })),
      { onConflict: "city_id,name", ignoreDuplicates: true },
    );
    check(nError, `Quartiers de ${cityName}`);

    const { data: rows, error: readError } = await admin
      .from("neighborhoods")
      .select("id, name")
      .eq("city_id", city.id);
    check(readError, `Quartiers de ${cityName}`);
    ids[cityName] = {
      id: city.id,
      neighborhoods: Object.fromEntries(rows.map((n) => [n.name, n.id])),
    };
  }
  return ids;
}

async function ensureAccount(account, cityId) {
  const { email } = account;
  let user =
    (await findAuthUserByEmail(email)) ??
    (await findAuthUserByEmail(legacyEmail(account.whatsappNumber)));

  if (user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      email,
      email_confirm: true,
      password: account.password,
      user_metadata: { full_name: account.fullName },
    });
    check(error, `Mise à jour de ${account.fullName}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.fullName },
    });
    check(error, `Création de ${account.fullName}`);
    user = data.user;
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      full_name: account.fullName,
      whatsapp_number: account.whatsappNumber,
      email,
      role: account.role,
      city_id: cityId,
      terms_accepted_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  check(profileError, `Profil de ${account.fullName}`);
  return user.id;
}

async function signedInClient(account) {
  const client = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    clientOptions,
  );
  const { error } = await client.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });
  check(error, `Connexion de ${account.fullName}`);
  return client;
}

async function cleanPreviousSeed(ownerId, tenantId) {
  const { error: reportsError } = await admin
    .from("reports")
    .delete()
    .eq("reporter_id", tenantId);
  check(reportsError, "Suppression des signalements de démonstration");

  const { data: listings, error } = await admin
    .from("listings")
    .select("id")
    .eq("owner_id", ownerId);
  check(error, "Lecture des annonces de démonstration");

  for (const { id } of listings) {
    const { data: files } = await admin.storage.from(BUCKET).list(id);
    if (files?.length) {
      const { error: removeError } = await admin.storage
        .from(BUCKET)
        .remove(files.map((file) => `${id}/${file.name}`));
      check(removeError, `Suppression des photos de ${id}`);
    }
  }

  if (listings.length) {
    const { error: deleteError } = await admin
      .from("listings")
      .delete()
      .eq("owner_id", ownerId);
    check(deleteError, "Suppression des annonces de démonstration");
  }
  return listings.length;
}

function escapeXml(value) {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c],
  );
}

async function placeholderPhoto(index, label) {
  const color = PALETTE[index % PALETTE.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${color}"/>
          <stop offset="1" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g)"/>
      <rect x="380" y="300" width="440" height="300" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10"/>
      <path d="M380 540 L520 420 L640 520 L720 460 L820 560" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10"/>
      <text x="600" y="700" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(label)}</text>
      <text x="600" y="770" font-family="Arial, sans-serif" font-size="32" fill="#ffffff" fill-opacity="0.8" text-anchor="middle">Photo de démonstration ${index + 1}</text>
    </svg>`;
  return sharp(Buffer.from(svg))
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
}

function isoDayInBrazzaville(daysFromToday) {
  const day = new Date(Date.now() + daysFromToday * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Brazzaville",
  }).format(day);
}

async function createListing(
  spec,
  { ownerClient, adminClient, ownerId, cities, typeIds },
) {
  const city = cities[spec.city];
  const { data: listing, error } = await ownerClient
    .from("listings")
    .insert({
      owner_id: ownerId,
      property_type_id: typeIds[spec.type],
      city_id: city.id,
      neighborhood_id: city.neighborhoods[spec.neighborhood],
      monthly_rent: spec.monthlyRent,
      advance_months: spec.advanceMonths,
      description: spec.description,
      water: spec.water,
      electricity: spec.electricity,
      doors_count: spec.doorsCount,
      availability: spec.availableInDays ? "available_soon" : "available",
      available_from: spec.availableInDays
        ? isoDayInBrazzaville(spec.availableInDays)
        : null,
    })
    .select("id")
    .single();
  check(error, `Annonce ${spec.key}`);

  for (let i = 0; i < spec.photos; i++) {
    const buffer = await placeholderPhoto(i, ROOMS[i % ROOMS.length]);
    const path = `${listing.id}/photo-${i + 1}.jpg`;
    const { error: uploadError } = await ownerClient.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
    check(uploadError, `Photo ${i + 1} de ${spec.key}`);

    const { error: photoError } = await ownerClient
      .from("listing_photos")
      .insert({
        listing_id: listing.id,
        storage_path: path,
        mime_type: "image/jpeg",
        file_size_bytes: buffer.length,
        sort_order: i + 1,
        is_primary: i === 0,
      });
    check(photoError, `Photo ${i + 1} de ${spec.key}`);
  }

  if (spec.target === "draft") return listing.id;

  // Publier : le trigger fixe la mise en ligne à maintenant + 5 minutes.
  const { error: publishError } = await ownerClient
    .from("listings")
    .update({ status: "scheduled" })
    .eq("id", listing.id);
  check(publishError, `Publication de ${spec.key}`);

  // Avancer la mise en ligne pour ne pas attendre le cron.
  const { error: visibleError } = await admin
    .from("listings")
    .update({
      status: "published",
      visible_from: new Date(Date.now() - 60_000).toISOString(),
    })
    .eq("id", listing.id);
  check(visibleError, `Mise en ligne de ${spec.key}`);

  if (spec.target === "closed") {
    const { error: closeError } = await ownerClient
      .from("listings")
      .update({ status: "closed", close_reason: "rented" })
      .eq("id", listing.id);
    check(closeError, `Fermeture de ${spec.key}`);
  }

  if (spec.target === "hidden") {
    const { error: hideError } = await adminClient
      .from("listings")
      .update({
        status: "hidden",
        hidden_reason:
          "Photos ne correspondant pas au logement, signalement vérifié.",
      })
      .eq("id", listing.id);
    check(hideError, `Masquage de ${spec.key}`);
  }

  return listing.id;
}

async function main() {
  console.log("Villes et quartiers…");
  const cities = await ensureCities();

  const { data: types, error: typesError } = await admin
    .from("property_types")
    .select("id, name");
  check(typesError, "Types de bien");
  const typeIds = Object.fromEntries(types.map((t) => [t.name, t.id]));

  console.log("Comptes de démonstration…");
  const ids = {};
  for (const [key, account] of Object.entries(DEMO_ACCOUNTS)) {
    ids[key] = await ensureAccount(account, cities.Brazzaville.id);
  }

  const removed = await cleanPreviousSeed(ids.owner, ids.tenant);
  if (removed)
    console.log(
      `${removed} annonce(s) de démonstration précédente(s) supprimée(s).`,
    );

  const ownerClient = await signedInClient(DEMO_ACCOUNTS.owner);
  const adminClient = await signedInClient(DEMO_ACCOUNTS.admin);

  console.log("Annonces et photos…");
  const created = [];
  for (const spec of LISTINGS) {
    const id = await createListing(spec, {
      ownerClient,
      adminClient,
      ownerId: ids.owner,
      cities,
      typeIds,
    });
    created.push({
      cas: spec.key,
      statut: spec.target,
      photos: spec.photos,
      url: `/annonces/${id}`,
    });
  }

  await Promise.all([ownerClient.auth.signOut(), adminClient.auth.signOut()]);

  console.table(created);
  console.log("\nComptes (mots de passe dans .env.local) :");
  for (const account of Object.values(DEMO_ACCOUNTS)) {
    console.log(`  ${account.role.padEnd(6)} ${account.email}`);
  }
}

main().catch((error) => {
  console.error(`\nÉchec du seed : ${error.message}`);
  process.exit(1);
});
