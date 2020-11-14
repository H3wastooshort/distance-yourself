def on_button_pressed_a():
    if infected != 1:
        basic.show_string("Met: " + convert_to_text(len(met)))
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global infected
    infected = 1
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    if infected != 0:
        basic.show_string("Infected " + convert_to_text(spread))
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_received_value(name, value):
    global infected, spread
    if infected == 0:
        if name.includes("infected"):
            infected = value
            if value == 1:
                radio.send_value("killer",
                    radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
                basic.show_leds("""
                    # . . . #
                    # # . # #
                    # # # # #
                    # # . # #
                    # . . . #
                    """)
                music.set_tempo(80)
                music.start_melody(music.built_in_melody(Melodies.FUNERAL), MelodyOptions.ONCE)
            else:
                if met.index(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) <= 0:
                    met.append(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
                basic.show_leds("""
                    . . . . .
                    # . . . #
                    . # . # .
                    # . . . #
                    . . . . .
                    """)
    if infected != 0:
        if name.includes("killer"):
            if value == control.device_serial_number():
                spread += 1
                music.play_tone(1500, music.beat(BeatFraction.WHOLE))
                basic.show_leds("""
                    # . . . #
                    # # . # #
                    # # # # #
                    # # . # #
                    # . . . #
                    """)
radio.on_received_value(on_received_value)

spread = 0
met: List[number] = []
infected = 0
radio.set_transmit_power(0)
radio.set_frequency_band(0)
radio.set_group(0)
radio.set_transmit_serial_number(True)
infected = 0

def on_forever():
    radio.send_value("infected", infected)
    if infected == 0:
        basic.show_icon(IconNames.HEART)
    else:
        basic.show_icon(IconNames.SKULL)
basic.forever(on_forever)
