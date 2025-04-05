let i2c_address = 48

enum Motorlist {
  //% block="links"
  M0 = 0,
  //% block="rechts"
  M1 = 1
}

enum Richting {
  //% block="vooruit"
  D0 = 0,
  //% block="achteruit"
  D1 = 1
}

enum LED_rgb_L_R {
  //% block="links"
  L0 = 0,
  //% block="rechts"
  L1 = 1
}

//% color="#AA278D"
namespace SmartCar {

    //% block="motor = | $motor richting = | $richting snelheid = $snelheid"
    //% snelheid.min=0 snelheid.max=255 snelheid.defl=100
    //% group="Motor" weight=65
    export function motor(motor: Motorlist, richting: Richting, snelheid: number) {
        switch (motor) {
            case 0:
                if (richting) { 
                    i2c_w(0x01, snelheid);
		    i2c_w(0x02, 0);
                }
                else { 
		    i2c_w(0x01, 0);
                    i2c_w(0x02, snelheid);
                }
                break;
            case 1:
                if (richting) { 
		    i2c_w(0x03, 0);
                    i2c_w(0x04, snelheid);
                }
                else { 
                    i2c_w(0x03, snelheid);
		    i2c_w(0x04, 0);
                }
                break;
        }
    }

    //% weight=10
    //% block="rood $red|groen $green|blauw $blue"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

}

function packRGB(r: number, g: number, b: number): number {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}

function i2c_w(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(i2c_address, buf)
}

