const fs = require('fs')
const pkg = require('./package.json');

const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


const data = fs.readFileSync('Mobile - J2ME.dat', 'utf8');
const parser = new XMLParser({
    ignoreAttributes : false
});
let dat = parser.parse(data);


let output = `clrmamepro (
	name "CHIP-8"
	description "libretro database for J2ME. Built from https://github.com/robloach/libretro-database-j2me ."
	version "${pkg.version}"
	homepage "http://github.com/libretro/libretro-database"
)
`

function cleanFilename(name) {
    if (!name) {
        return 'Missing name.jar'
    }
    return name
        .replace('"', '')
}

function addRom(rom) {
    let output = `    rom ( name "${cleanFilename(rom['@_name'])}"`
    if (rom['@_size']) {
        output += ' size ' + rom['@_size']
    }
    if (rom['@_crc']) {
        output += ' crc ' + rom['@_crc']
    }
    output += ' )\n'
    return output
}

function addEntry(entry) {
    if (!entry || !entry.description || !entry.rom) {
        return
    }

    let roms = ''

    if (Array.isArray(entry.rom)) {
        for (let rom of entry.rom) {
            roms += addRom(rom)
        }
    }
    else {
        roms += addRom(entry.rom)
    }

    if (roms == '') {
        return ''
    }
    
    output += `game (
    name "${entry['@_name']}"
${roms})
`
}

for (let machine of dat.datafile.machine) {
    addEntry(machine)
}

fs.writeFileSync('Mobile - J2ME - output.dat', output);