export function routeOffer(req, stats){

  const goal = req.query.goal
  const amount = req.query.amount
  const time = req.query.time
  const score = req.query.score

  // filtr ofert
  let filtered = offers.filter(o => {

    if(goal === "cash" && !o.category.includes("pozyczki")) return false

    if(score === "bad" && o.type === "bank") return false

    if(time === "fast" && o.speed !== "instant") return false

    return true
  })

  if(filtered.length === 0){
    filtered = offers
  }

  // AI ranking
  filtered.sort((a,b)=>b.epc-a.epc)

  return filtered[0]
}
