/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import { world, system } from '@minecraft/server'

/**
 * Turns Minecraft's day tick number into a 24 based hour time string (e.g. 23:59).
 * @param {number} time The game tick time. Must be coercible to an integer between 0 and 24000.
 * @returns {string|undefined} The translated time of day value.
 * If the provided time was not coercible to an integer, then it returns `undefined`
 */
function translateTimeOfDay(time) {
    const safeTime = parseInt(time, 10)
    if (!safeTime || safeTime > 24000 || safeTime < 0) {
        return undefined
    }

    let minecraftTime = 6 + (safeTime / 24000) * 24 // Day tick 0 corresponds to 6:00 AM
    if (minecraftTime > 24) {
        minecraftTime -= 24 // Normalize in the 0-24 hour range
    }

    const hour = Math.floor(minecraftTime)
    const minute = Math.floor((minecraftTime - hour) * 60)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

function newPlayer(player) {
    // Weather
    //
    // Unfortunately, there is not yet a way to query weather. Instead, the work around is to subscribe to the
    // weatherChange event and get it that way.
    let weather = 'Not yet set'
    world.events.weatherChange.subscribe((event) => {
        if (event.raining && event.lightning) {
            weather = 'thunder'
        } else if (event.raining) {
            weather = 'rain'
        } else {
            weather = 'clear'
        }
    })

    // Calculations run every tick
    system.runInterval(() => {
        const { location } = player
        const playerBlock = {
            x: Math.floor(location.x),
            y: Math.floor(location.y),
            z: Math.floor(location.z)
        }
        const playerChunk = {
            x: Math.floor(playerBlock.x / 16),
            y: Math.floor(playerBlock.y / 16),
            z: Math.floor(playerBlock.z / 16)
        }
        const playerChunkString = `${playerChunk.x}, ${playerChunk.y}, ${playerChunk.z}`

        const playerChunkPosition = {
            x: playerBlock.x % 16,
            y: playerBlock.y % 16,
            z: playerBlock.z % 16
        }
        const playerChunkPositionString = `${playerChunkPosition.x}, ${playerChunkPosition.y}, ${playerChunkPosition.z}`

        const velocity = player.getVelocity()
        const rotation = player.getRotation()
        const day = Math.floor(world.getAbsoluteTime() / 24000)

        const block = player.getBlockFromViewDirection()
        let blockString = ''
        if (block?.typeId) {
            if (block.isWaterlogged) {
                blockString = 'waterlogged '
            }
            if (block.typeId.substring(0, 10) === 'minecraft:') {
                blockString += block.typeId.substring(10, block.typeId.length)
            } else {
                blockString += block.typeId
            }
            blockString += ` (${block.x}, ${block.y}, ${block.z})`
        } else {
            blockString = 'None'
        }

        const entity = player.getEntitiesFromViewDirection()[0]
        let entityString = ''
        if (entity?.typeId) {
            if (entity.typeId.substring(0, 10) === 'minecraft:') {
                entityString += entity.typeId.substring(10, entity.typeId.length)
            } else {
                entityString += entity.typeId
            }

            if (entity?.nameTag) {
                entityString += ` "${entity.nameTag}" `
            }

            const loc = entity.location
            entityString += ` (${loc.x.toFixed(1)}, ${loc.y.toFixed(1)}, ${loc.z.toFixed(1)})`
        } else {
            entityString = 'None'
        }

        // Display the final output
        player.onScreenDisplay.setActionBar(
            // eslint-disable-next-line prettier/prettier
            `${
                player.name
            }                                                                                             
Position / Velocity
X: ${location.x.toFixed(2).padStart(8, ' ')} / ${velocity.x.toFixed(6)}
Y: ${location.y.toFixed(2).padStart(8, ' ')} / ${velocity.y.toFixed(6)}
Z: ${location.z.toFixed(2).padStart(8, ' ')} / ${velocity.z.toFixed(6)}
Chunk (${playerChunkPositionString}) in (${playerChunkString})

Bearing: ${(rotation.y + 180).toFixed(1).padStart(5, '0')}°, Elevation: ${-rotation.x.toFixed(1)}°
Looking at
  Block:  ${blockString}
  Entity: ${entityString}

Dimension: ${player.dimension.id}
Weather:   ${weather}
Day ${day} ${translateTimeOfDay(world.getTime())}





 `
            // The final lines are for action bar positioning above the hot bar
        )
    })
}

world.events.worldInitialize.subscribe(() => {
    const players = world.getAllPlayers()
    if (players.length > 0) {
        players.forEach(newPlayer)
        world.events.playerJoin.subscribe(newPlayer)
    }
})
