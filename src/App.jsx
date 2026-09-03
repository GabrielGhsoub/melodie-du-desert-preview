/* Mélodie du désert, page de réservation avec options.

   Le 27 juillet Karen et Saïd ont décliné en expliquant pourquoi: les clients
   ajoutent un dromadaire de selle, une nuit de plus, un départ d'une ville et
   un retour d'une autre, "et nous ne savons pas le gérer automatiquement".

   Cette page ne cherche pas à leur faire standardiser quoi que ce soit. Elle
   montre l'inverse: chaque option porte son prix, le total se recalcule tout
   seul, et l'acompte de 20% suit. Rien n'est envoyé, rien n'est encaissé:
   c'est une démonstration construite avec leurs tarifs publics. */
import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  agence, calcule, euro, options, treks, villes,
} from './data/trek.js'
import './app.css'

const ETAPES = ['Le trek', 'Vos options', 'Votre demande']

export default function App() {
  const [etape, setEtape] = useState(0)
  const [trekKey, setTrekKey] = useState(treks[0].key)
  const [villeAller, setVilleAller] = useState('marrakech')
  const [villeRetour, setVilleRetour] = useState('marrakech')
  const [adultes, setAdultes] = useState(2)
  const [enfants, setEnfants] = useState(0)
  const [choix, setChoix] = useState({})
  const [envoye, setEnvoye] = useState(false)
  const titre = useRef(null)

  const trek = treks.find((t) => t.key === trekKey)
  const devis = useMemo(
    () => calcule({ trek, villeAller, villeRetour, adultes, enfants, choix }),
    [trek, villeAller, villeRetour, adultes, enfants, choix],
  )

  function aller(n) {
    setEtape(n)
    requestAnimationFrame(() => titre.current?.focus())
  }
  const set = (k, v) => setChoix((c) => ({ ...c, [k]: Math.max(0, v) }))

  return (
    <div className="page">
      <header className="tete">
        <div className="shell tete__in">
          <div>
            <strong>{agence.nom}</strong>
            <em>{agence.lieu}</em>
          </div>
          <a className="tete__lien" href={agence.site} target="_blank" rel="noreferrer">
            melodiedudesert.com
          </a>
        </div>
      </header>

      <section className="hero">
        <img className="hero__fond" src="img/desert-3.jpg" alt="" width="1400" height="2100" fetchPriority="high" />
        <div className="hero__voile" />
        <div className="shell hero__in">
          <p className="sur">Démonstration</p>
          <h1>Rien ne se réserve sans vous.<br />Seuls les chiffres se font tout seuls.</h1>
          <p className="hero__texte">
            Le dromadaire de selle, la nuit de plus au bivouac, le départ de Marrakech
            avec un retour par Ouarzazate: chaque choix a déjà son tarif chez vous. Ici,
            le voyageur les assemble lui-même et voit le total avancer, puis vous envoie
            sa demande. La conversation reste la vôtre, l'arithmétique se fait toute
            seule, et l'acompte de 20% suit vos règles.
          </p>
        </div>
      </section>

      <main className="shell principal">
        <div className="grille">
          <div className="panneau">
            <ol className="etapes" aria-label="Étapes">
              {ETAPES.map((e, i) => (
                <li key={e} className={i === etape ? 'ici' : i < etape ? 'fait' : ''}
                    aria-current={i === etape ? 'step' : undefined}>
                  <span aria-hidden="true">{i < etape ? '✓' : i + 1}</span>{e}
                  {i < etape && <span className="vh">terminé</span>}
                </li>
              ))}
            </ol>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={etape}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: .26, ease: [.22, 1, .36, 1] }}
              >
                {etape === 0 && (
                  <>
                    <h2 className="q" tabIndex={-1} ref={titre}>Quel trek ?</h2>
                    <div className="treks">
                      {treks.map((t) => (
                        <button
                          key={t.key} type="button"
                          className={`trek${t.key === trekKey ? ' on' : ''}`}
                          aria-pressed={t.key === trekKey}
                          onClick={() => setTrekKey(t.key)}
                        >
                          <img src={t.image} alt="" loading="lazy" />
                          <span className="trek__txt">
                            <strong>{t.nom}</strong>
                            <em>{t.duree} · {t.marche}</em>
                            <span className="trek__niv">{t.niveau}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    <h2 className="q q--2">Départ et retour</h2>
                    <p className="aide">
                      Vous pouvez partir d'une ville et revenir par une autre. Le tarif
                      s'ajuste, une demi-part pour chaque trajet.
                    </p>
                    <div className="deux">
                      <label className="ch">
                        <span>Aller depuis</span>
                        <select value={villeAller} onChange={(e) => setVilleAller(e.target.value)}>
                          {villes.map((v) => <option key={v.key} value={v.key}>{v.nom}</option>)}
                        </select>
                      </label>
                      <label className="ch">
                        <span>Retour vers</span>
                        <select value={villeRetour} onChange={(e) => setVilleRetour(e.target.value)}>
                          {villes.map((v) => <option key={v.key} value={v.key}>{v.nom}</option>)}
                        </select>
                      </label>
                    </div>

                    <h2 className="q q--2">Qui part ?</h2>
                    <div className="deux">
                      <Compteur label="Adultes" val={adultes} min={1} max={12} set={setAdultes} />
                      <Compteur label="Enfants de moins de 12 ans" val={enfants} min={0} max={8} set={setEnfants} />
                    </div>

                    <div className="nav">
                      <span />
                      <button type="button" className="btn btn--p" onClick={() => aller(1)}>
                        Choisir les options
                      </button>
                    </div>
                  </>
                )}

                {etape === 1 && (
                  <>
                    <h2 className="q" tabIndex={-1} ref={titre}>Vos options</h2>
                    <p className="aide">
                      Ce sont vos tarifs publics. Chacun se calcule selon la durée du trek
                      et le nombre de personnes.
                    </p>
                    <ul className="opts">
                      {options.map((o) => (
                        <li key={o.key} className={choix[o.key] ? 'opt on' : 'opt'}>
                          <div className="opt__txt">
                            <strong>{o.nom}</strong>
                            <em>{o.detail}</em>
                          </div>
                          {o.max || o.unite === 'forfait' ? (
                            <Compteur
                              label={o.nom} compact
                              val={choix[o.key] || 0} min={0} max={o.max || 3}
                              set={(v) => set(o.key, v)}
                            />
                          ) : (
                            <label className="bascule">
                              <input
                                type="checkbox"
                                checked={Boolean(choix[o.key])}
                                onChange={(e) => set(o.key, e.target.checked ? 1 : 0)}
                              />
                              <span>{choix[o.key] ? 'Inclus' : 'Ajouter'}</span>
                            </label>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="nav">
                      <button type="button" className="btn btn--g" onClick={() => aller(0)}>Retour</button>
                      <button type="button" className="btn btn--p" onClick={() => aller(2)}>Voir la demande</button>
                    </div>
                  </>
                )}

                {etape === 2 && !envoye && (
                  <>
                    <h2 className="q" tabIndex={-1} ref={titre}>Votre demande</h2>
                    <p className="aide">
                      Rien n'est réservé et rien n'est encaissé. La demande partirait chez
                      vous, complète, et vous la confirmez comme aujourd'hui.
                    </p>
                    <div className="recap">
                      <Recap devis={devis} trek={trek} />
                    </div>
                    <div className="nav">
                      <button type="button" className="btn btn--g" onClick={() => aller(1)}>Retour</button>
                      <button type="button" className="btn btn--p" onClick={() => { setEnvoye(true); requestAnimationFrame(() => titre.current?.focus()) }}>
                        Envoyer la demande
                      </button>
                    </div>
                  </>
                )}

                {etape === 2 && envoye && (
                  <div className="fini">
                    <p className="demo demo--haut">
                      Démonstration: aucun message n'a été envoyé et rien n'a été encaissé.
                    </p>
                    <div className="fini__ok" aria-hidden="true">✓</div>
                    <h2 className="q" tabIndex={-1} ref={titre} role="status">
                      Voilà ce que vous recevriez
                    </h2>
                    <div className="recap recap--fini">
                      <Recap devis={devis} trek={trek} />
                    </div>
                    <p className="aide">
                      Avec le nom, le téléphone et les dates du client. Vous répondez pour
                      confirmer, exactement comme Karen le fait aujourd'hui, mais sans
                      refaire le calcul à la main.
                    </p>
                    <div className="nav nav--centre">
                      <button type="button" className="btn btn--g" onClick={() => { setEnvoye(false); aller(0) }}>
                        Recommencer
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="total" aria-live="polite">
            <p className="total__quoi">{trek.nom}</p>
            <p className="total__duree">{trek.duree}</p>
            <div className="total__gros">
              <span className="vh">Total</span>
              <strong>{euro(devis.total)}</strong>
            </div>
            <div className="total__ac">
              <span>Acompte 20%</span>
              <strong>{euro(devis.acompte)}</strong>
            </div>
            <p className="total__note">
              Le solde se règle sur place auprès de Saïd, comme indiqué dans votre FAQ.
            </p>
          </aside>
        </div>
      </main>

      <footer className="pied">
        <div className="shell">
          <p>
            Page de démonstration préparée par Likwiid avec les tarifs publics de{' '}
            <a href={agence.site} target="_blank" rel="noreferrer">melodiedudesert.com</a>,
            relevés le 16 août 2026. Elle n'envoie rien et n'encaisse rien.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Compteur({ label, val, min, max, set, compact }) {
  return (
    <div className={`cpt${compact ? ' cpt--c' : ''}`}>
      {!compact && <span className="cpt__l">{label}</span>}
      <div className="cpt__b">
        <button type="button" onClick={() => set(val - 1)} disabled={val <= min}
                aria-label={`Retirer un ${label}`}>−</button>
        <output aria-label={label}>{val}</output>
        <button type="button" onClick={() => set(val + 1)} disabled={val >= max}
                aria-label={`Ajouter un ${label}`}>+</button>
      </div>
    </div>
  )
}

function Recap({ devis, trek }) {
  return (
    <>
      <p className="recap__t">{trek.nom}, {trek.duree}</p>
      <ul className="lignes">
        {devis.lignes.map((l) => (
          <li key={l.libelle + l.detail} className={l.option ? 'opt' : ''}>
            <span>
              {l.libelle}
              <em>{l.detail}</em>
            </span>
            <strong>{euro(l.montant)}</strong>
          </li>
        ))}
      </ul>
      <div className="lignes__total">
        <span>Total</span><strong>{euro(devis.total)}</strong>
      </div>
      <div className="lignes__ac">
        <span>Acompte à verser, 20%</span><strong>{euro(devis.acompte)}</strong>
      </div>
    </>
  )
}
