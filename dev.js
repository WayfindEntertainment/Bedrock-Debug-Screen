/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

function deleteDirectory(deletePath) {
    fs.rmSync(deletePath, { recursive: true, force: true })
}

function copyDirectory(fromPath, toPath) {
    // If the 'toPath' top level directory doesn't already exist, create it.
    if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath)
    }

    // Loop through every folder and file in the 'fromPath'
    fs.readdir(fromPath, (err, files) => {
        files.forEach((file) => {
            const filepath = path.join(fromPath, file)

            // If the file is actually a file, copy it over
            if (fs.statSync(filepath).isFile()) {
                fs.copyFileSync(filepath, path.join(toPath, file))
                console.log('Copied file:   ', file)
            }

            // Otherwise, if it's a directory, create a new folder in the destination and recursively call
            if (fs.statSync(filepath).isDirectory()) {
                copyDirectory(filepath, path.join(toPath, file))
                console.log('Copied folder: ', file)
            }

            // If neither a file or folder, it is an unknown entity and it should get ignored
        })
    })
}

// Dev Input
const projectName = 'Minecraft Bedrock Debug Screen'

const behaviorPack = path.join(path.dirname(__filename), 'Source Behavior Pack')
// const resourcePack = path.join(path.dirname(__filename), 'Source Resource Pack')

// Dev Output
const root = process.env.LOCALAPPDATA
const minecraftLocal =
    'Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang'

const devBehaviorPackLocation = path.join(
    root,
    minecraftLocal,
    'development_behavior_packs',
    projectName
)
// const devResourcePackLocation = path.join(
//     root,
//     minecraftLocal,
//     'development_resource_packs',
//     projectName
// )

console.log('BP: ', devBehaviorPackLocation)
// console.log('RP: ', devResourcePackLocation)

// Remove all files in behavior/resource pack location to start from a clean slate
deleteDirectory(devBehaviorPackLocation)
// deleteDirectory(devResourcePackLocation)

// Copy files
copyDirectory(behaviorPack, devBehaviorPackLocation)
// copyDirectory(resourcePack, devResourcePackLocation)
