import { WebSiteModel } from "../../shared/models/websites.js";


/**
 * 
 * @param iterations - nombre d'iteration pour stabiliser le rang
 * @param d - Damping factor
 * 
 * @description Le PageRank[a] ou PR est l'algorithme d'analyse des liens concourant au système de classement des pages Web utilisé par le moteur de recherche Google. Il mesure quantitativement la popularité d'une page web. Le PageRank n'est qu'un indicateur parmi d'autres dans l'algorithme qui permet de classer les pages du Web dans les résultats de recherche de Google. Ce système a été inventé par Larry Page, cofondateur de Google[1]. Ce mot est une marque déposée. <source: WIKIPEDIA>
 */
export async function globalWebSiteRanking(iterations: number, d: number = 0.85) {

    // On recupere la liste des pages
    const pages = await WebSiteModel.find({}, { _id: 0, rank: 1, link: 1, urls: 1 });
    const pageMap = new Map(pages.map(p => [p.link, { ...p, rank: p.rank ?? 1 / pages.length }]));

    // 2. Boucle PageRank
    for (let iter = 0; iter < iterations; iter++) {
        const newRank = new Map<string, number>();
        let currentIndex = 1
        for (const page of pages) {
            let sum = 0;
            for (const p of pages.filter(p => p.urls.includes(page.link))) {
                sum += (pageMap.get(p.link)!.rank!) / p.urls.length;
            }
            const tempRank = (1 - d) / pages.length + d * sum
            newRank.set(page.link, tempRank);
            console.log(`[${iter + 1} - ${currentIndex}/${pages.length}] - rank : ${tempRank}`)
            currentIndex++
        }

        // update ranks
        pages.forEach(page => pageMap.get(page.link)!.rank = newRank.get(page.link)!)

    }

    await WebSiteModel.bulkWrite(Array.from(pages).map(page => ({
        updateOne: {
            filter: { link: page.link },
            update: { $set: { rank: pageMap.get(page.link)!.rank } },
            upsert: false
        }
    })))

}