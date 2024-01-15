export default class DemoMod {
    prestart() {
        ig.isdemo = true
        sc.pvp = {
            points: 0,
            enemies: [],
            observers: [],
            isCombatantInPvP() {
                return false
            },
            isActive() {
                return false
            },
            getDmgFactor() {
                return 1
            },
            onPvpCombatantDefeat() {},
        }
        sc.party = {
            observers: [],
            getPartySize() {
                return 0
            },
            isDungeonBlocked() {
                return false
            },
        }
        sc.quests = {
            observers: [],
            hasQuestSolvedDialogs() {
                return false
            },
            hasSolvedQuestsStacked() {
                return false
            },
            cycleFavQuest() {},
        }
        sc.trophies = {
            observers: [],
            validateFeatPoints() {},
            updateAll() {},
        }
        sc.arena = {
            active: false,
            isStatusModifierBlocked() {
                return { type: undefined }
            },
            isPauseBlocked() {
                return false
            },
            onPreDamageApply() {},
            isSideMessagesBlocked() {
                return false
            },
            onHitKill() {},
            onLockEnd() {},
            onPreInstantDamage() {},
            onCombatHeal() {},
            onEnviromentKill() {},
            onEnemyBreak() {},
            onGuardCounter() {},
            onPreDamageModification() {},
            onPrefectDodge() {},
            onTargetHit() {},
            onCombatantDeathHit() {},
            onPerfectDodge() {},
            onCombatantHeal() {},
        }
        sc.enemyBooster = { updateEnemyBoostState() {} }
        ig.extensions = {
            addListener() {},
            hasExtension() {
                return false
            },
            load() {},
            getExtensionList() {
                return []
            },
        }
        ig.dreamFx = {
            isActive() {
                return false
            },
        }
        sc.newgame = {
            get() {
                return false
            },
            hasHarderEnemies() {
                return false
            },
            getDropRateMultiplier() {
                return 1
            },
            getEXPMultiplier() {
                return 1
            },
        }

        sc.TitleScreenButtonGui.inject({
            checkClearSaveFiles() {
                return false
            },
        })

        sc.ItemTimerHudGui = ig.GuiElementBase.extend({})
        sc.SpHudGui = ig.GuiElementBase.extend({})
        sc.SpChangeHudGui = ig.GuiElementBase.extend({})
        sc.KeyHudGui = ig.GuiElementBase.extend({})
        sc.ItemHudBox = ig.GuiElementBase.extend({})
        sc.FavQuestHud = ig.GuiElementBase.extend({})
        sc.QuestUpdateHud = ig.GuiElementBase.extend({})
        sc.LandmarkHud = ig.GuiElementBase.extend({})
        sc.DLCGui = ig.GuiElementBase.extend({})

        sc.AssaultTools = { spawn() {} }

        sc.ItemConsumption = ig.Class.extend({
            activateItemEffect() {
                return false
            },
            runItemUseAction() {},
        })
        sc.Inventory.inject({
            updateScaledEquipment() {},
        })
        function a(b) {
            b = ig.root + b.match(/^(.*)\.[^\.]+$/)[1] + '.' + ig.soundManager.format.ext + ig.getCacheSuffix()
            return ig.getFilePath(b)
        }
        ig.SoundManager.inject({
            loadWebAudio(c, d) {
                var e = a(c)
                if (this.buffers[c]) {
                    d && d(c, true)
                    return this.buffers[c]
                }
                var f = new XMLHttpRequest()
                f.open('GET', e, true)
                f.responseType = 'arraybuffer'
                f.onload = function () {
                    ig.soundManager.context.decodeAudioData(
                        f.response,
                        function (a) {
                            if (a) {
                                ig.soundManager.buffers[c] = a
                                d && d(c, true)
                            } else ig.system.error(Error('Web Audio Load Error: Decoded but NULL ' + c))
                        },
                        function () {
                            ig.system.error(Error('Web Audio Load Error: Could not DECODE: ' + c))
                        }
                    )
                }
                f.onerror = function () {
                    // console.log('Web Audio Load Error: Could not LOAD: ' + c)
                    d && d(c, true)
                }
                f.send()
            },
        })
        ig.Loader.inject({
            init(...args) {
                this.parent(...args)
                this.tolerateMissingResources = true
            },
        })
        ig.Game.inject({
            teleport(mapName, marker, hint, clearCache, reloadCache) {
                if (mapName == 'cargo-ship.ship' && marker && marker.marker == 'containerTop') {
                    function gotoTile() {
                        ig.game.reset()
                        sc.model.enterTitle()
                    }
                    sc.Dialogs.showChoiceDialog('The demo ends here.', null, ['Ok'], gotoTile)
                    return
                }
                this.parent(mapName, marker, hint, clearCache, reloadCache)
            },
        })

        ig.ENTITY.WavePushPullBlock = ig.Class.extend({})
        ig.ENTITY.PushPullBlock = ig.Class.extend({})
    }
}
