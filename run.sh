#!/bin/bash
shopt -s extglob

which wget >/dev/null 2>&1
if [ $? == 1 ]; then
    echo "wget not installed."
    exit 1
fi

NWJS_FILE='none'
FILE='unset'
COMPRESS='yes'
CLEANUP='yes'
BUNDLE_CROSSEDEYES='no'
PLATFORM='unset'
PRETTY_JS='no'

for i in "$@"; do
    case $i in
    --file)
        shift
        FILE="${1}"
        shift
        ;;
    --platform)
        shift
        PLATFORM="${1}"
        shift
        ;;
    --nwjs)
        shift
        NWJS_FILE="${1}"
        shift
        ;;
    --nocompress)
        COMPRESS='no'
        shift
        ;;
    --nocleanup)
        CLEANUP='no'
        shift
        ;;
    --prettyjs)
        PRETTY_JS='yes'
        shift
        ;;
    --bundle-crossedeyes)
        BUNDLE_CROSSEDEYES='yes'
        shift
        ;;
    -* | --*)
        echo "Unknown option $i"
        exit 1
        ;;
    *) ;;
    esac
done

if [ ! -f "$FILE" ]; then
    echo "File: $FILE doesn't exist"
    exit 1
fi

if [ "$FILE" != 'none' ] && [ "$(echo "$FILE" | tail -c 8)" != '.tar.gz' ]; then
    echo "nwjs file: $NWJS_FILE has to have the .tar.gz extension"
fi

if [ "$PLATFORM" == 'windows' ] || [ "$PLATFORM" == 'linux' ] || [ "$PLATFORM" == 'macos' ]; then
    echo "Platform: $PLATFORM"
else
    echo "Unknown platform: $PLATFORM"
    exit 1
fi

if [ "$PLATFORM" == 'linux' ] && [ "$NWJS_FILE" == 'none' ]; then
    echo "Linux requires a --nwjs argument"
    exit 1
fi

if [ "$NWJS_FILE" != 'none' ] && [ ! -f "$NWJS_FILE" ]; then
    echo "nwjs file: $NWJS_FILE doesn't exist"
    exit 1
fi

if [ "$NWJS_FILE" != 'none' ] && [ "$(echo "$NWJS_FILE" | tail -c 8)" != '.tar.gz' ]; then
    echo "nwjs file: $NWJS_FILE has to have the .tar.gz extension"
fi

rm -rf tmp

mkdir -p tmp
if [ ! -f tmp/package.json ]; then
    echo "Extracting archive"
    tar -xf "$FILE" --directory=tmp
fi

if [ ! -d tmp/ccloader ]; then
    if [ ! -f archives/bundle.zip ]; then
        CROSSEDEYES_URL="$(wget -qO- 'https://api.github.com/repos/CCDirectLink/CrossedEyes/releases/latest' |
            npx jq '.assets[] | select(.name == "bundle.zip").browser_download_url' | head -c -2 | tail -c +2)"
        echo "Downloading $CROSSEDEYES_URL"
        wget -q "$CROSSEDEYES_URL" -O archives/bundle.zip
    fi
    echo "Extracting bundle.zip"
    unzip -qoD archives/bundle.zip -d tmp/

    if [ "$BUNDLE_CROSSEDEYES" == 'no' ]; then
        rm -f tmp/assets/mods/!(simplify|ccloader-version-display|demomod)
        rm -f tmp/CROSSEDEYES_MANUAL.md
    fi
fi

if [ "$NWJS_FILE" != 'none' ]; then
    # NWJS_FILE="$NWJS_FOLDER.tar.gz"
    # if [ ! -f $NWJS_FILE ]; then
    #     echo "Downloading NWJS v0.72.0"
    #     wget 'https://dl.nwjs.io/v0.72.0/nwjs-v0.72.0-linux-x64.tar.gz'
    # fi
    if [ ! -f tmp/nwjssetup ]; then
        echo "Unpacking NWJS"
        tar -xf $NWJS_FILE --directory=tmp
        cp -rf tmp/nwjs-*/* tmp/
        mv tmp/nw tmp/CrossCode
        rm -r tmp/nwjs-*
        touch tmp/nwjssetup
    fi
fi

cp -r ./src/demomod tmp/assets/mods/

echo "Removing all extensions"
rm -rf tmp/assets/extension
echo "Removing greenworks"
rm -rf tmp/assets/modules
echo "" >tmp/assets/mods/simplify/prestart.js

rm -rf tmp/lib/vk_swiftshader_icd.json tmp/swiftshader tmp/lib/libvk_swiftshader.so
rm -rf tmp/locales/*.info

rm -rf tmp/assets/*.info

rm -f tmp/chrome_crashpad_handler

if [ ! -f tmp/assets/js/stipped ]; then
    _TMP=$(pwd)
    cd tmp/assets/js
    npx prettier --tab-width 0 --print-width 10000 --bracket-same-line --single-quote --no-config -w game.compiled.js
    cd "$_TMP"
    npx bun ./src/moduleRemover.ts
    cd tmp/assets/js
    [ "$PRETTY_JS" == 'yes' ] && npx prettier --tab-width 4 --no-semi --print-width 500 --bracket-same-line --single-quote --no-config -w game.compiled.js
    cd "$_TMP"
    touch tmp/assets/js/stripped
fi

npx bun ./src/jsonPurger.ts
# potentials: media/gui
ASSETS_TO_REMOVE="\
    data/arena \
    data/maps/!(cargo-ship|hideout|rhombus-square-view.json) \
    data/maps/cargo-ship/?(challenge-room.json|christmas.json|puzzle-challenge.json|room1-old.json|room3.json|test.json) \
    data/maps/hideout/?(inner-test.json|inner-garden.json) \
    data/areas/!(cargo-ship.json|hideout.json|fallback.json) \
    data/animations/boss/!(cargo-crab.json) \
    data/animations/enemies/!(mouse-bot.json|simple-bot.json|seahorse.json|shredder.json|shredder-cold.json|target-bot.json|turret-large.json) \
    data/animations/?(pets|henry-prop.json|player-poses-debug.json|player-sleeping.json|player-weak.json|player-xmas.json|player-skins) \
    data/animations/?(shizuka-poses-manlea.json) \
    data/animations/npc/!(captain.json|cargo-crew.json|carla.json|designer.json|genius.json) \
    data/effects/!(ar.json|ball-assault.json|ball.json|ball-special.json|charge.json|color*|combat.json|combat|combatant.json|cube-debris.json|default-hit.json|dust.json|enemies|enemy.json|guard.json|map|marble.json|npc.json|puzzle.json|scene|skins|special-neutral.json|speedlines.json|stepFx.json|sweeps.json|teleport.json|throw.json|turret.json|special|specials|puzzle) \
    data/effects/specials/!(heat.json) \
    data/effects/puzzle/!(destructible.json) \
    data/effects/combat/!(mode.json|dark.json) \
    data/effects/skins/!(default.json) \
    data/effects/scene/!(battle-sounds.json|designer.json|throwing.json|water.json|water-extra.json) \
    data/effects/map/!(barrier.json|door.json|rh-quest-hub.json) \
    data/effects/enemies/!(crab-boss.json|designer.json|turret-large.json|arid.json) \
    data/save-presets \
    data/scale-props/!(dungeon-ar.json|dungeon-ar-special.json|hideout.json|ship-outer.json|forest.json) \
    data/props/!(cabins.json|cargo-hold.json|dungeon-ar.json|forest-interior.json|forest.json|hideout.json|unknown-interior.json|trading-autumn.json|ship-bridge.json|ship-outer.json|rhombus-square-view.json) \
    data/players/!(lea.json|sergey.json|shizuka.json|shizuka0.json) \
    data/parallax/!(hideout.json|login.json|logo*|planet*|ship-far.json|title.json) \
    data/enemies/!(captain.json|mouse-bot.json|turret-large.json|boss-test.json|target-bot.json|simple-bot.json|shredder-alpha.json|shredder-cold.json|shredder.json) \
    data/characters/!(cargo-crew|main|antagonists|objects) \
    data/characters/objects/!(barrier.json) \
    \
    media/bgm/!(muCargohold.ogg|muCargohold-i.ogg|muSolar.ogg|muTitle.ogg|ability-got.ogg|muOldhideout.ogg|muFiercebattle.ogg|muFiercebattle-i.ogg|muSrank.ogg|muSrank-i.ogg|muSrank-i.ogg|muMysterious.ogg|muDistantfuture.ogg|muAwakened.ogg|muBattle1.ogg|muCrossworlds.ogg|muChallenge1.ogg|muChallenge1-i.ogg|muBattle1-i.ogg|muAvatar-i.ogg|muAvatar.ogg|muBossbattle.ogg|muBossbattle-i.ogg) \
    media/concept \
    media/entity/effects/!(ball-special.png|ball.png|circle.png|cold.png|combat-dark.png|crab-effects.png|debris.png|dust.png|explosion-round-l.png|explosion-round.png|explosion.png|guard.png|heat.png|hit1-old.png|hit1.png|hit2.png|icicles.png|lighter-particle.png|neutral.png|particles1.png|red-charge.png|sand-whirl.png|special-charge.png|spread1.png|spread2.png|sweep.png|sweep2.png|turret.png|water.png|bomb-explo.png|element-change.png|arid-fx.png) \
    media/entity/enemy/!(easy-bot*|generic-bot1.png|item-drops.png|mouse-bot.png|target-bot.png|turret-large.png|shredder.png|shredder-ice.png|boss) \
    media/entity/enemy/boss/!(cargo-crab.png) \
    media/entity/map-gui/_unused \
    media/entity/npc/!(captain.png|cargo-crew.png|carla.png|designer.png|genius.png) \
    media/entity/objects/!(block.png|dungeon-ar.png|elevator.png|puzzle-elements-1.png|object-effects.png|dynamic-blocks.png|upgrade-symbol.png) \
    media/entity/pets \
    media/entity/player/!(move-shizuka.png|move.png|poses.png|shizuka-special.png|throw.png|throw-shizuka.png|poses-shizuka.png) \
    media/entity/style/!(cargo-bridge-map.png|cargo-hold-map.png|cargo-outer-map.png|default-destruct.png|default-destruct2.png|default-map.png|default-puzzle-2.png|default-puzzle.png|hideout-inner-map.png|hideout-outer-map.png|unknown-interior-map.png) \
    media/face/!(captain.png|cargo-colleague.png|cargo-fanboy.png|carla.png|designer.png|gautham.png|genius.png|lea-special.png|lea.png|npc-portrait.png|programmer.png|lore|shizuka.png) \
    media/face/lore/!(designer.png|genius.png|captain.png|sergey.png|lea.png|shizuka.png) \
    media/font/_unused \
    media/gui/!(area-icons.png|basic.png|buttons.png|chapters.png|circuit-icons.png|circuit.png|env-black.png|env-red.png|env-white.png|html5-logo.png|impact-logo.png|indiegogo.png|loading.png|map-ar.png|map-icon.png|menu.png|message.png|overload-overlay.png|pause_word.png|pvp.png|rfg-fish.png|rfg-text.png|scanlines.png|sergey-mode-corner.png|severed-heads.png|social-facebook.png|social-twitter.png|status-gui.png|tech-intro-bg.png|title-bg.png|title-logo-new.png|title-logo.png|world-map.png|xeno-dialogs.png) \
    media/map/!(cargo-ship*|collisiontiles-16x16.png|lightmap-tiles.png|lightmap.png|old-hideout*|pathmap-tiles.png|props.png|props2.png|teleporter.png|unknown-interior.png|fog2.png|forest.png|cloud.png|water.png|rhombus-square-bg.png|combined-props.png|velsa_sheet.png|rain.png) \
    media/parallax/!(hideout|login|logo|planet|planet-far|ship-far|title|sun-blind.png|white-fade.png) \
    media/pics \
    media/tutorials \
    media/sound/background/!(cargo|hideout|ship-outside.ogg|title-ambient.ogg|waterfall.ogg|rain.ogg|rain-strong.ogg) \
    media/sound/?(arena|loltest.ogg|va|drops) \
    media/sound/environment/!(plant-shake.ogg) \
    media/sound/battle/airon/!(ball-hit*|ball-bounce-heat*|close-combat-heat-sweep*|close-combat-sweep*|hit-organic-*|explosion-woosh.ogg|throw-ball*|exposion-enemy-small*|fire-hit*|cold|hit-metal-light*|hit-metal-medium*) \
    media/sound/battle/airon/cold/!(ball-hit-cold-hard*.ogg|close-combat-cold-sweep*) \
    media/sound/battle/!(airon|ball*|block-hit.ogg|charge-*|dash*|enemy-explode.ogg|explosion*|hit-block.ogg|hit-7.ogg|hit-counter-echo.ogg|hit-light*|level-up.ogg|enemies|shiny-effect.ogg|special|laser.ogg|laser-charge.ogg|pre-explosion*) \
    media/sound/battle/enemies/!(shredder|charge*|mine|mouse) \
    media/sound/battle/enemies/mine/!(ground-ice-crystal.ogg) \
    media/sound/boss/!(crab|turret) \
    media/sound/menu/!(helmet.ogg|login*|logo*|menu*|radicalfish-bubbles.ogg|quick-menu*|shop) \
    media/sound/menu/shop/!(shop-menu-up.ogg) \
    media/sound/misc/!(computer-beep*|countdown*|elevator*|scifi-effect*) \
    media/sound/move/!(heat-mode.ogg|neutral-mode.ogg|instamatter-break.ogg|heal.ogg|jump.ogg|land.ogg|metal-solid*|step-*|stone*|throw*|targeting-charged.ogg|water*|wooden*|grass*|cardboard*) \
    media/sound/puzzle/!(barrier*|bot*|counter.ogg|door*|switch*|speed-up.ogg) \
    media/sound/scenes/!(bomb-*|designer*|fall-from-chair.ogg|jetpack.ogg|parallax-ship.ogg|sergey-mode*|swoosh-*|teleport*|soft-alarm.ogg|soundscape.ogg|boom.ogg) \
    \
    impact/page/css/fonts \
"
for file in $ASSETS_TO_REMOVE; do
    rm -rf tmp/assets/$file
done

NAME="crosscode-demo-$PLATFORM"
if [ "$BUNDLE_CROSSEDEYES" == 'yes' ]; then
    NAME="$NAME-crossedeyes"
fi
rm -rf "$NAME"
mv tmp "$NAME"
if [ "$COMPRESS" == 'yes' ]; then
    echo "Compressing..."
    mkdir -p ./demos
    FINAL_ARCHIVE="$NAME.zip"
    OUTPATH="$(realpath "./demos/$FINAL_ARCHIVE")"
    rm -f "$OUTPATH"
    zip -q -r "$OUTPATH" "$NAME"
    echo "Output: $OUTPATH"
fi

if [ "$CLEANUP" == 'yes' ]; then
    rm -rf "$NAME"
    rm -rf tmp
fi
