// priority: 10
PlayerEvents.tick(event => {
    let player = event.player
    if (player.age % 20 != 0) return
    let typeMap = getPlayerChestCavityTypeMap(player);
    if (typeMap.has('kubejs:player_tick')) {
        typeMap.get('kubejs:player_tick').forEach(organ => {
            organPlayerTickStrategies[organ.id](event, organ)
        })
    }
    let onlySet = new Set()
    if (typeMap.has('kubejs:player_tick_only')) {
        typeMap.get('kubejs:player_tick_only').forEach(organ => {
            if (!onlySet.has(organ.id)) {
                onlySet.add(organ.id)
                organPlayerTickOnlyStrategies[organ.id](event, organ)
            }
        })
    }
})


/**
 * 玩家Tick秒级策略
 * @constant
 * @type {Object<string,function(Internal.SimplePlayerEventJS, organ):void>}
 */
const organPlayerTickStrategies = {
    'kubejs:machine_clockwork': function (event, organ) {
        let player = event.player
        let count = player.persistentData.getInt(resourceCount)
        if (player.isSprinting()) {
            let speed = Math.floor(player.getSpeed() * 40)
            updateResourceCount(player, count + speed)
        } else if (count > 0) {
            updateResourceCount(player, count - 1)
        }
    },
    'kubejs:mantis_shrimp_fist': function (event, organ) {
        if (event.player.age % 60 != 0) {
            return
        }
        let player = event.player
        let criticalPunchCount = player.persistentData.getInt(criticalPunch)
        if (criticalPunchCount >= criticalPunchMaxCount) return
        player.persistentData.putInt(criticalPunch, criticalPunchCount + 1)
    },
};

/**
 * 玩家Tick秒级唯一策略
 * @constant
 * @type {Object<string,function(Internal.SimplePlayerEventJS, organ):void>}
 */
const organPlayerTickOnlyStrategies = {
    'kubejs:platelet_dispatcher': function (event, organ) {
        let player = event.player
        if (player.health != player.maxHealth && player.health > player.maxHealth * 0.75) {
            let filtration = player.chestCavityInstance.organScores.getOrDefault(new ResourceLocation('chestcavity', 'filtration'), 0)
            player.heal(Math.min(filtration / 4, 1))
        }
    },
    'kubejs:sand_bone': function (event, organ) {
        let player = event.player
        if (event.level.getBlock(player.x, player.y - 1, player.z).id == 'minecraft:sand') {
            player.potionEffects.add('minecraft:speed', 20 * 3, 1)
        }
    },
    'kubejs:tamagotchi': function (event, organ) {
        if (event.player.age % 600 != 0) {
            return
        }
        if (Math.random() > 0.05) {
            return
        }
        event.player.potionEffects.add('kubejs:hungry_tamagotchi', 60 * 20, 0)
        event.player.tell(Text.gray({ "translate": "kubejs.msg.tamagotchi.1" }))
    },
    'kubejs:embers_liver': function (event, organ) {
        let player = event.player
        if (player.age % 40 != 0) {
            return
        }
        if (!isPlayerOnFire(player)) {
            return
        }
        let amplifier = -1
        if (player.hasEffect('minecraft:strength')) {
            amplifier = player.getEffect('minecraft:strength').getAmplifier()
        }
        player.potionEffects.add('minecraft:strength', 8 * 20, Math.min(amplifier + 1, 4))
    },
    'kubejs:mini_vampire': function (event, organ) {
        let player = event.player
        let maxHealth = player.getMaxHealth()
        let health = player.getHealth()
        if (health < maxHealth * 0.2) {
            player.potionEffects.add('kubejs:vampiric', 20 * 3, 2)
        } else if (health < maxHealth * 0.3) {
            player.potionEffects.add('kubejs:vampiric', 20 * 3, 1)
        } else if (health < maxHealth * 0.5) {
            player.potionEffects.add('kubejs:vampiric', 20 * 3, 0)
        }
    },
    'kubejs:vulcan_furnace': function (event, organ) {
        let player = event.player
        let count = player.persistentData.getInt(resourceCount)
        if (player.hasEffect('kubejs:burning_heart')) {
            let duration = player.getEffect('kubejs:burning_heart').getDuration()
            updateResourceCount(player, count + Math.floor(duration / 20))
        } else if (player.hasEffect('kubejs:flaring_heart')) {
            let amplifier = player.getEffect('kubejs:flaring_heart').getAmplifier()
            updateResourceCount(player, count + (amplifier + 1) * 20)
        }
    },
    'kubejs:worm_neuron': function (event, organ) {
        let player = event.player
        if (player.age % 600 != 0) return
        if (player.nbt?.ForgeCaps['goety:lichdom']?.lichdom == 1) return
        let warp = player.persistentData.getInt(warpCount)
        if (warp < 20) return
        let instance = player.getChestCavityInstance()
        // 如果该位置存在物品，则不进行生成
        let randomIndex = Math.floor(Math.random() * 27 + 1)
        if (instance.inventory.getItem(randomIndex) != 'minecraft:air') return

        let typeMap = getPlayerChestCavityTypeMap(player)
        if (!typeMap.has('kubejs:organ')) return

        let organCount = typeMap.get('kubejs:organ').length * 1
        let emptySolt = 27 - organCount

        let tumor = Item.of('kubejs:random_tumor', { organData: {} })
        let amount = Math.floor(Math.random() * 2 + 1)
        for (let i = 0; i < amount; i++) {
            let attri = randomGet(tumorAttriBute)
            let attriName = attri.name
            // 扩散系数，用于控制属性的扩散范围(-0.5, 1.5)
            let diffusivity = Math.random() + Math.random() - 0.5
            // 新陈代谢效率
            let metabolism = instance.organScores.getOrDefault(new ResourceLocation('chestcavity', 'metabolism'), 0)
            // 空格子数量放大属性
            let amplifier = 1 / (27 - Math.min(emptySolt, 26)) + 0.01 * Math.min(metabolism, 30) + 0.25
            // 魔法值用于修正amplifier的取值范围
            amplifier = amplifier * 16
            let attriValue = Math.min(attri.multi * Math.floor(diffusivity * amplifier * 8 + 1) / 8, attri.max)
            attriValue = Math.max(attriValue, -attri.max)
            tumor.nbt.organData.put(attriName, attriValue)
        }
        instance.inventory.setItem(randomIndex, tumor)
        player.potionEffects.add('minecraft:hunger', 5, 4)
        global.initChestCavityIntoMap(player, false)
        if (player.persistentData.contains(organActive) &&
            player.persistentData.getInt(organActive) == 1) {
            global.updatePlayerActiveStatus(player)
        }
    },
};