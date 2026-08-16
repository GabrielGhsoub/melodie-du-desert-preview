/* Chaque prix ci-dessous est copié des pages publiques de melodiedudesert.com,
   relevées le 2026-08-16. Rien n'est inventé, rien n'est arrondi.

   Karen et Saïd nous ont écrit le 27 juillet que les options des clients
   (dromadaire de selle, nuit supplémentaire, départ d'une ville et retour
   d'une autre) changent le prix et qu'ils "ne savent pas le gérer
   automatiquement". Cette page ne fait qu'une chose: montrer que ces
   options-là SONT le système. */

export const agence = {
  nom: 'Mélodie du désert',
  lieu: "M'hamid El Ghizlane, Vallée du Drâa",
  email: 'melodiedudesert@gmail.com',
  site: 'https://www.melodiedudesert.com',
  /* FAQ, mot pour mot: "Karen envoie le formulaire de réservation avec la
     demande d'acompte (20% du voyage). Le solde du voyage se règle sur place
     auprès de Saïd." */
  acomptePct: 0.2,
};

/* /nos-voyages/trek-désert-4-jours et /trek-désert-6-jours, tableau TARIF.
   Le tarif dépend de la ville de départ: c'est déjà une option chez eux. */
export const treks = [
  {
    key: '4j',
    nom: 'Escapade aux dunes hurlantes',
    duree: '5 jours - 4 nuits',
    marche: '4 jours à pied',
    niveau: 'Facile à intermédiaire',
    image: 'img/desert-1.jpg',
    nuitsDesert: 4,
    prix: {
      mhamid: { adulte: 295, enfant: 235 },
      ouarzazate: { adulte: 345, enfant: 275 },
      marrakech: { adulte: 390, enfant: 295 },
      agadir: { adulte: 410, enfant: 335 },
    },
  },
  {
    key: '6j',
    nom: 'La caravane du désert',
    duree: '7 jours - 6 nuits',
    marche: '6 jours à pied',
    niveau: 'Intermédiaire',
    image: 'img/desert-5.jpg',
    nuitsDesert: 6,
    prix: {
      mhamid: { adulte: 385, enfant: 285 },
      ouarzazate: { adulte: 440, enfant: 335 },
      marrakech: { adulte: 495, enfant: 380 },
      agadir: { adulte: 515, enfant: 410 },
    },
  },
];

export const villes = [
  { key: 'mhamid', nom: "M'hamid" },
  { key: 'ouarzazate', nom: 'Ouarzazate' },
  { key: 'marrakech', nom: 'Marrakech' },
  { key: 'agadir', nom: 'Agadir' },
];

/* Page /tarifs, section "Autres tarifs (optionnel)", mot pour mot. */
export const options = [
  {
    key: 'dromadaire',
    nom: 'Dromadaire de selle',
    detail: "20 € par jour et par dromadaire. Monté ou descendu pendant la marche, deux enfants possibles par selle.",
    prix: 20,
    unite: 'parJourParUnite',
    max: 4,
  },
  {
    key: 'nuit',
    nom: 'Nuitée supplémentaire au bivouac fixe',
    detail: 'Transfert du village au bivouac en 4x4 aller-retour, nuitée et pension complète. 60 € par adulte, 30 € par enfant de moins de 12 ans.',
    prix: 60,
    prixEnfant: 30,
    unite: 'parNuitParPersonne',
    max: 3,
  },
  {
    key: 'duvet',
    nom: 'Location de sac de couchage confort 0°',
    detail: '25 € par trek et par personne.',
    prix: 25,
    unite: 'parPersonne',
  },
  {
    key: 'hammam',
    nom: 'Hammam au bivouac fixe',
    detail: "10 € par adulte. L'eau vient du puits et chauffe au bois.",
    prix: 10,
    unite: 'parAdulte',
  },
  {
    key: 'recuperation',
    nom: 'Récupération anticipée dans le désert',
    detail: '140 € par véhicule 4x4 de 6 places.',
    prix: 140,
    unite: 'forfait',
  },
];

export function calcule({ trek, villeAller, villeRetour, adultes, enfants, choix }) {
  const lignes = [];

  /* Aller et retour peuvent partir de deux villes différentes: c'est
     exactement le cas qu'ils décrivaient comme non automatisable. On prend
     la moyenne des deux tarifs, une demi-part de chaque trajet. */
  const pa = trek.prix[villeAller];
  const pr = trek.prix[villeRetour];
  const adulte = (pa.adulte + pr.adulte) / 2;
  const enfant = (pa.enfant + pr.enfant) / 2;

  if (adultes > 0) {
    lignes.push({
      libelle: `Trek, ${adultes} adulte${adultes > 1 ? 's' : ''}`,
      detail: villeAller === villeRetour
        ? `aller-retour ${villes.find((v) => v.key === villeAller).nom}`
        : `aller ${villes.find((v) => v.key === villeAller).nom}, retour ${villes.find((v) => v.key === villeRetour).nom}`,
      montant: adulte * adultes,
    });
  }
  if (enfants > 0) {
    lignes.push({
      libelle: `Trek, ${enfants} enfant${enfants > 1 ? 's' : ''} de moins de 12 ans`,
      detail: 'tarif enfant',
      montant: enfant * enfants,
    });
  }

  for (const opt of options) {
    const n = choix[opt.key] || 0;
    if (!n) continue;
    let montant = 0;
    let detail = '';
    if (opt.unite === 'parJourParUnite') {
      montant = opt.prix * n * trek.nuitsDesert;
      detail = `${n} x ${opt.prix} € x ${trek.nuitsDesert} jours`;
    } else if (opt.unite === 'parNuitParPersonne') {
      montant = (opt.prix * adultes + (opt.prixEnfant || opt.prix) * enfants) * n;
      detail = `${n} nuit${n > 1 ? 's' : ''} x ${adultes} adulte${adultes > 1 ? 's' : ''}${enfants ? ` et ${enfants} enfant${enfants > 1 ? 's' : ''}` : ''}`;
    } else if (opt.unite === 'parPersonne') {
      montant = opt.prix * (adultes + enfants);
      detail = `${adultes + enfants} personne${adultes + enfants > 1 ? 's' : ''} x ${opt.prix} €`;
    } else if (opt.unite === 'parAdulte') {
      montant = opt.prix * adultes;
      detail = `${adultes} adulte${adultes > 1 ? 's' : ''} x ${opt.prix} €`;
    } else if (opt.unite === 'forfait') {
      montant = opt.prix * n;
      detail = `${n} véhicule${n > 1 ? 's' : ''}`;
    }
    if (montant > 0) lignes.push({ libelle: opt.nom, detail, montant, option: true });
  }

  const total = lignes.reduce((s, l) => s + l.montant, 0);
  return { lignes, total, acompte: Math.round(total * agence.acomptePct) };
}

export const euro = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
