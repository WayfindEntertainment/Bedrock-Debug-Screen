/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import { world, system } from '@minecraft/server'

/**
 * The Player class defines an entity controlled by a human player.
 * @typedef {import('@minecraft/server').Player} Player
 */

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

/**
 * Starts the interval command that shows the debug menu for a player.
 * @param {Player} player An instance of a Minecraft `Player` class entity object
 * @returns {function} a function handle that can be used to clear the `setInterval` call later.
 */
function showDebugInfo(player) {
    // Calculations run every tick
    return system.runInterval(() => {
        const { location } = player

        const playerSpawn = player.getSpawnPoint()
        let playerSpawnString = ''
        if (playerSpawn) {
            const spawnDimension = playerSpawn.dimension.id.substring(
                10,
                playerSpawn.dimension.id.length
            )
            playerSpawnString = `${spawnDimension} (${playerSpawn?.x}, ${playerSpawn?.y}, ${playerSpawn?.z})`
        } else {
            const defaultSpawn = world.getDefaultSpawnLocation()
            playerSpawnString = `World spawn: (${defaultSpawn.x}, ${defaultSpawn.z})`
        }

        const playerBlock = {
            // The block coordinates the player occupies
            x: Math.floor(location.x),
            y: Math.floor(location.y),
            z: Math.floor(location.z)
        }
        const playerChunk = {
            // The chunk the player is in
            x: Math.floor(playerBlock.x / 16),
            y: Math.floor(playerBlock.y / 16),
            z: Math.floor(playerBlock.z / 16)
        }
        const playerChunkString = `${playerChunk.x}, ${playerChunk.y}, ${playerChunk.z}`

        const playerChunkPosition = {
            // The relative position within that chunk
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
        if (block?.block.isValid) {
            // If no block is returned, or block is in an unloaded chunk, trying any of these operations throws an error
            if (block.block.isWaterlogged) {
                blockString = 'waterlogged '
            }
            if (block.block.typeId.substring(0, 10) === 'minecraft:') {
                // Removes the minecraft namespace for brevity
                blockString += block.block.typeId.substring(10, block.block.typeId.length)
            } else {
                blockString += block.block.typeId // If not minecraft namespace, use the full value
            }
            blockString += ` (${block.block.x}, ${block.block.y}, ${block.block.z})`
        } else {
            blockString = 'None'
        }

        const entity = player.getEntitiesFromViewDirection()[0]
        let entityString = ''
        if (entity?.entity.typeId) {
            if (entity.entity.typeId.substring(0, 10) === 'minecraft:') {
                entityString += entity.entity.typeId.substring(10, entity.entity.typeId.length)
            } else {
                entityString += entity.typeId
            }

            if (entity?.entity.nameTag) {
                entityString += ` "${entity.entity.nameTag}" `
            }

            const loc = entity.entity.location
            entityString += ` (${loc.x.toFixed(1)}, ${loc.y.toFixed(1)}, ${loc.z.toFixed(1)})`
        } else {
            entityString = 'None'
        }

        let moonPhaseString = ''
        switch (world.getMoonPhase()) {
            case 1:
                moonPhaseString = 'Waning Gibbous'
                break
            case 2:
                moonPhaseString = 'First Quarter'
                break
            case 3:
                moonPhaseString = 'Waning Crescent'
                break
            case 4:
                moonPhaseString = 'New Moon'
                break
            case 5:
                moonPhaseString = 'Waxing Crescent'
                break
            case 6:
                moonPhaseString = 'Last Quarter'
                break
            case 7:
                moonPhaseString = 'Waxing Gibbous'
                break
            default:
                moonPhaseString = 'Full Moon'
                break
        }

        // Display the final output
        // The final blank lines at the end are for action bar positioning above the hot bar to minimize interference
        player.onScreenDisplay.setActionBar(
            // eslint-disable-next-line prettier/prettier
            `${
                player.name
            }                                                                                             
Player Spawn Point: ${playerSpawnString}
Position / Velocity
X: ${location.x.toFixed(2).padStart(8, ' ')} / ${velocity.x.toFixed(6)}
Y: ${location.y.toFixed(2).padStart(8, ' ')} / ${velocity.y.toFixed(6)}
Z: ${location.z.toFixed(2).padStart(8, ' ')} / ${velocity.z.toFixed(6)}
Chunk (${playerChunkPositionString}) in (${playerChunkString})

Bearing: ${(rotation.y + 180).toFixed(1).padStart(5, '0')}°, Elevation: ${-rotation.x.toFixed(1)}°
Looking at
  Block:  ${blockString}
  Entity: ${entityString}

Dimension: ${player.dimension.id.substring(10, player.dimension.id.length)}
Weather:   ${world.getDimension(player.dimension.id).getWeather()}
Day ${day} ${translateTimeOfDay(world.getTimeOfDay())}
Moon Phase: ${moonPhaseString}




 `
        )
    })
}

// Set up the custom command listeners
let runningDebugFunctionCallback
let debugHasBeenActivatedBefore = false
world.beforeEvents.chatSend.subscribe((eventData) => {
    const player = eventData.sender
    // ESLint thinks this next line is invalid because it erroneously believes eventData.cancel is read only, but it
    //      isn't. This line prevents showing the typed custom command text in the chat window.
    // eslint-disable-next-line no-param-reassign
    eventData.cancel = true
    if (eventData.message === '!debug on' && debugHasBeenActivatedBefore === false) {
        // Must not let this function run if it already has been. If it is run twice, the user will not be able
        //  to clear this callback function from the system and it will run forever.
        runningDebugFunctionCallback = showDebugInfo(player)
        debugHasBeenActivatedBefore = true
    } else if (eventData.message === '!debug off') {
        if (debugHasBeenActivatedBefore) {
            // system.clearRun will throw an error if clearing a function that was never set to run before
            system.clearRun(runningDebugFunctionCallback)
        }
        // Initially, this script called the player.onScreenDisplay.setActionBar command directly.
        //  This started throwing errors when upgrading to @minecraft/server 1.12.0-beta because
        //  you can no longer do that directly. It has to be wrapped in a system.run() call.
        system.run(() => {
            player.onScreenDisplay.setActionBar('Debug Menu Closed')
        })
        debugHasBeenActivatedBefore = false
    }
})
