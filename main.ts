input.onButtonPressed(Button.A, function () {
    if (infected != 1) {
        basic.showString("Met: " + convertToText(met.length))
    }
})
input.onButtonPressed(Button.AB, function () {
    infected = 1
})
input.onButtonPressed(Button.B, function () {
    if (infected != 0) {
        basic.showString("Infected " + convertToText(spread))
    }
})
radio.onReceivedValue(function (name, value) {
    if (infected == 0) {
        if (name.includes("infected")) {
            infected = value
            if (value == 1) {
                radio.sendValue("killer", radio.receivedPacket(RadioPacketProperty.SerialNumber))
                basic.showLeds(`
                    # . . . #
                    # # . # #
                    # # # # #
                    # # . # #
                    # . . . #
                    `)
                music.setTempo(80)
                music.startMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once)
            } else {
                found = 0
                for (let Index = 0; Index <= met.length; Index++) {
                    if (met[Index] == radio.receivedPacket(RadioPacketProperty.SerialNumber)) {
                        found += 1
                    }
                }
                if (found == 0) {
                    met.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
                }
                basic.showLeds(`
                    . . . . .
                    # . . . #
                    . # . # .
                    # . . . #
                    . . . . .
                    `)
            }
        }
    }
    if (infected != 0) {
        if (name.includes("killer")) {
            if (value == control.deviceSerialNumber()) {
                spread += 1
                music.playTone(1500, music.beat(BeatFraction.Whole))
                basic.showLeds(`
                    # . . . #
                    # # . # #
                    # # # # #
                    # # . # #
                    # . . . #
                    `)
            }
        }
    }
})
let found = 0
let spread = 0
let met: number[] = []
let infected = 0
radio.setTransmitPower(0)
radio.setFrequencyBand(0)
radio.setGroup(0)
radio.setTransmitSerialNumber(true)
infected = 0
basic.forever(function () {
    radio.sendValue("infected", infected)
    if (infected == 0) {
        basic.showIcon(IconNames.Heart)
    } else {
        basic.showIcon(IconNames.Skull)
    }
})
