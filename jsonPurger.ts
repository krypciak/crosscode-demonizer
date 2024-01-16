var jsonpath: typeof import('jsonpath') = require('jsonpath')
import * as fs from 'fs'

const jsonPurge: Record</* file */ string, /* paths */ string[]> = {
    'database.json': [
        'achievements',
        'areas!!hideout,cargo-ship,fallback',
        'commonEvents[*]',
        'drops[*]',
        'enemies!!captain,mouse-bot,turret-large,boss-test,target-bot,simple-bot',
        'lore!!prologue,chapter-01',
        'names',
        'quests[*]',
        'shops[*]',
        'traders[*]',
        'questHubs[*]',
    ],
    'global-settings.json': ['ItemDestruct', 'ENTITY'],
    'item-database.json': ['items[0:16:17:168,169:498,499:672,673:]'],
    'terrain.json': ['$!!media/map/cargo-ship-inner.png,media/map/teleporter.png,media/map/old-hideout.png,media/map/old-hideout-inner.png,media/map/forest.png'],
    'tile-infos.json': ['$!!media/map/old-hideout-shadows.png,media/map/old-hideout-shadows2.png,media/map/forest.png'],
}
for (const file in jsonPurge) {
    const entries = jsonPurge[file]
    const path = `tmp/assets/data/${file}`
    const obj = JSON.parse(fs.readFileSync(path).toString())
    for (let purgePath of entries) {
        if (purgePath.match(/!!/)) {
            const [pre, exceptWhole] = purgePath.split('!!')
            const except: Set<string> = new Set(exceptWhole.split(','))
            const res = jsonpath.query(obj, pre)[0]
            const delKeys = Object.keys(res).filter(k => !except.has(k))
            purgePath = `${pre}[${delKeys.map(k => `"${k}"`).join(',')}]`
        }
        try {
            jsonpath.apply(obj, purgePath, () => undefined)
            console.log(purgePath)
        } catch (e) {
            console.log(`${path} fail ${purgePath}`)
        }
    }
    fs.writeFileSync(path, JSON.stringify(obj, undefined, 4))
}
