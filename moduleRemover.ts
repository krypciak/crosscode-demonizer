var fs: typeof import('fs') = require('fs')
const fp = 'tmp/assets/js/game.compiled.js'

let code: string = fs.readFileSync(fp).toString()
let delModules = [
    'game.feature.achievements.achievements',
    'game.feature.achievements.plug-in',
    'game.feature.achievements.stat-steps',
    'game.feature.arena.arena',
    'game.feature.arena.arena-bonus-objectives',
    'game.feature.arena.arena-challenges',
    'game.feature.arena.arena-cheer',
    'game.feature.arena.arena-loadable',
    'game.feature.arena.arena-score-types',
    'game.feature.arena.arena-steps',
    'game.feature.arena.entities.arena-spawn',
    'game.feature.arena.gui.arena-effect-display',
    'game.feature.arena.gui.arena-gui',
    'game.feature.arena.gui.arena-round-gui',
    'game.feature.arena.gui.arena-rush-gui',
    'game.feature.arena.gui.arena-start-gui',
    'game.feature.arena.gui.arena-trophy-gui',
    'game.feature.arena.plug-in',
    'game.feature.combat.combat-assault',
    'game.feature.combat.entities.enemy-spawner',
    'game.feature.combat.entities.food-icon',
    'game.feature.combat.entities.stone', // ?',
    'game.feature.combat.gui.pvp-gui',
    'game.feature.combat.model.enemy-booster',
    'game.feature.combat.model.enemy-level-scaling',
    'game.feature.combat.pvp',
    'game.feature.gui.hud.item-timer-hud', // ?',
    'game.feature.gui.hud.key-hud', // ?',
    'game.feature.gui.hud.landmark-hud', // ?',
    'game.feature.gui.hud.quest-hud', // ?',
    'game.feature.gui.hud.sp-change-hud', // ??',
    'game.feature.gui.hud.sp-hud', // ?? ',
    'game.feature.gui.hud.sp-mini-hud', // ??',
    'game.feature.gui.widget.demo-highscore',
    'game.feature.gui.widget.demo-stats',
    'game.feature.gui.widget.indiegogo-gui',
    'game.feature.gui.widget.social', // ??',
    'game.feature.gui.widget.timer-gui', // ??',
    'game.feature.inventory.detectors',
    'game.feature.inventory.item-level-scaling',
    'game.feature.map-content.entities.jump-panel', // ??',
    'game.feature.map-content.entities.rhombus-point',
    'game.feature.map-content.gui.rhombus-map',
    'game.feature.map-content.prop-interact',
    'game.feature.map-content.sc-doors',
    'game.feature.menu.gui.arena.arena-cup-page',
    'game.feature.menu.gui.arena.arena-list',
    'game.feature.menu.gui.arena.arena-menu',
    'game.feature.menu.gui.arena.arena-misc',
    'game.feature.menu.gui.arena.arena-round-page',
    'game.feature.menu.gui.botanics.botanics-list',
    'game.feature.menu.gui.botanics.botanics-menu',
    'game.feature.menu.gui.botanics.botanics-misc',
    'game.feature.menu.gui.circuit.circuit-detail',
    'game.feature.menu.gui.circuit.circuit-detail-elements',
    'game.feature.menu.gui.circuit.circuit-effect-display',
    'game.feature.menu.gui.circuit.circuit-menu',
    'game.feature.menu.gui.circuit.circuit-misc',
    'game.feature.menu.gui.circuit.circuit-overview',
    'game.feature.menu.gui.circuit.circuit-swap-branches',
    'game.feature.menu.gui.equip.equip-bodypart',
    'game.feature.menu.gui.equip.equip-menu',
    'game.feature.menu.gui.equip.equip-misc',
    'game.feature.menu.gui.equip.equip-status',
    'game.feature.menu.gui.item.item-status-buffs', //', // ??',
    'game.feature.menu.gui.item.item-status-default', // ??',
    'game.feature.menu.gui.item.item-status-equip', // ??',
    'game.feature.menu.gui.item.item-status-favs', // ??',
    'game.feature.menu.gui.item.item-status-trade', // ??',
    'game.feature.menu.gui.museum.museum-menu', // ??',
    'game.feature.menu.gui.new-game.new-game-dialogs',
    'game.feature.menu.gui.new-game.new-game-list',
    'game.feature.menu.gui.new-game.new-game-menu',
    'game.feature.menu.gui.new-game.new-game-misc',
    'game.feature.menu.gui.shop.shop-list',
    'game.feature.menu.gui.quest-hub.quest-hub-list',
    'game.feature.menu.gui.quest-hub.quest-hub-menu',
    'game.feature.menu.gui.quest-hub.quest-hub-misc',
    'game.feature.menu.gui.quests.quest-details',
    'game.feature.menu.gui.quests.quest-entries',
    'game.feature.menu.gui.quests.quest-menu',
    'game.feature.menu.gui.quests.quest-misc',
    'game.feature.menu.gui.quests.quest-tab-list',
    'game.feature.menu.gui.shop.shop-cart',
    'game.feature.menu.gui.shop.shop-confirm',
    'game.feature.menu.gui.shop.shop-list',
    'game.feature.menu.gui.shop.shop-menu',
    'game.feature.menu.gui.shop.shop-misc',
    'game.feature.menu.gui.shop.shop-quantity',
    'game.feature.menu.gui.shop.shop-start',
    'game.feature.menu.gui.shop.shop-stats',
    'game.feature.menu.gui.social.social-list',
    'game.feature.menu.gui.social.social-menu',
    'game.feature.menu.gui.social.social-misc',
    'game.feature.menu.gui.trade.trade-misc',
    'game.feature.menu.gui.trade.trader-list',
    'game.feature.menu.gui.trade.trader-menu',
    'game.feature.menu.gui.trophy.trophy-list',
    'game.feature.menu.gui.trophy.trophy-menu',
    'game.feature.menu.gui.trophy.trophy-misc',
    'game.feature.new-game.new-game-model',
    'game.feature.new-game.new-game-steps',
    'game.feature.new-game.plug-in',
    'game.feature.npc.entities.npc-runner-entity',
    'game.feature.npc.gui.npc-display-gui',
    'game.feature.npc.npc-runners',
    'game.feature.player.entities.player-pet',
    'game.feature.player.item-consumption',
    'game.feature.puzzle.components.push-pullable',
    'game.feature.puzzle.entities.ball-changer',
    'game.feature.puzzle.entities.bomb',
    'game.feature.puzzle.entities.boss-platform',
    'game.feature.puzzle.entities.chest',
    'game.feature.puzzle.entities.compressor',
    'game.feature.puzzle.entities.dynamic-platform',
    'game.feature.puzzle.entities.element-shield',
    'game.feature.puzzle.entities.extract-platform',
    'game.feature.puzzle.entities.ferro',
    'game.feature.puzzle.entities.floor-switch',
    'game.feature.puzzle.entities.group-switch',
    'game.feature.puzzle.entities.ice-disk',
    'game.feature.puzzle.entities.item-destruct',
    'game.feature.puzzle.entities.key-panel',
    'game.feature.puzzle.entities.lorry',
    'game.feature.puzzle.entities.magnet',
    'game.feature.puzzle.entities.ol-platform',
    'game.feature.puzzle.entities.push-pull-block',
    'game.feature.puzzle.entities.push-pull-dest',
    'game.feature.puzzle.entities.quick-sand',
    'game.feature.puzzle.entities.regen-destruct',
    'game.feature.puzzle.entities.rotate-blocker',
    'game.feature.puzzle.entities.sliding-block',
    'game.feature.puzzle.entities.spiderweb',
    'game.feature.puzzle.entities.steam-pipes',
    'game.feature.puzzle.entities.tesla-coil',
    'game.feature.puzzle.entities.thermo-pole',
    'game.feature.puzzle.entities.water-block',
    'game.feature.puzzle.entities.water-bubble',
    'game.feature.puzzle.entities.wave-teleport',
    'game.feature.quest.plug-in',
    'game.feature.quest.quest-model',
    'game.feature.quest.quest-steps',
    'game.feature.quest.quest-types',
    'game.feature.save-preset.plug-in',
    'game.feature.save-preset.save-preset',
    'game.feature.timers.gui.timers-hud',
    'game.feature.timers.plug-in',
    'game.feature.timers.timers-model',
    'game.feature.timers.timers-steps',
    'game.feature.trade.gui.equip-toggle-stats',
    'game.feature.trade.gui.trade-dialog',
    'game.feature.trade.gui.trade-icon',
    'game.feature.trade.gui.trade-menu',
    'game.feature.trade.plug-in',
    'game.feature.trade.trade-model',
    'game.feature.trade.trade-steps',
    'game.feature.version.gui.dlc-gui',
    'impact.base.extension',
    'impact.feature.dream-fx.dream-fx',
    'impact.feature.dream-fx.dream-fx-steps',
    'impact.feature.dream-fx.plug-in',
    'impact.feature.map-content.entities.stair-door',
]

let sp = code.split('\n').map(s => s.trim())
for (let lineI = 0; lineI < sp.length; lineI++) {
    let l = sp[lineI]
    for (const module of delModules) {
        if (l.startsWith(`ig.module('${module}')`) || (l == 'ig' && sp[lineI + 1].match(module) !== null)) {
            console.log(`removing ${module}`)
            while (true) {
                l = sp[lineI]
                sp.splice(lineI, 1)
                if (l == 'ig.baked = !0') {
                    lineI--
                    break
                }
            }
        }
    }
}
let final = sp.join('\n')
for (const module of delModules) {
    final = final.replaceAll(`'${module}',`, '').replaceAll(`'${module}'`, '')
}
fs.writeFileSync(fp, final)
