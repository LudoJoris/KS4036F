let i2c_address = 48

enum Motor {
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

enum LED {
  //% block="links"
  L0 = 0,
  //% block="rechts"
  L1 = 1
}

//% color="#AA278D"
namespace SmartCar {

  //% block="motor = | $motor richting = | $richting snelheid = $snelheid"
  //% snelheid.min=0 snelheid.max=255 snelheid.defl=100
  //% group="Motor" weight=50
  export function motor(motor: Motor, richting: Richting, snelheid: number) {
    if (motor == 0) {
      if (richting == 0) { 
        i2c_w(0x01, 0);
        i2c_w(0x02, snelheid);
      }
      if (richting == 1) { 
        i2c_w(0x01, snelheid);
        i2c_w(0x02, 0);
      }
    }
    if (motor == 1) {
      if (richting == 0) { 
        i2c_w(0x03, snelheid);
        i2c_w(0x04, 0);
      }
      if (richting == 1) { 
        i2c_w(0x03, 0);
        i2c_w(0x04, snelheid);
      }
    }
  }

  //% block="motor = | $motor stop"
  //% group="Motor" weight=66
  export function stop(motor: Motor) {
    if (motor == 0) {
      i2c_w(0x01, 0);
      i2c_w(0x02, 0);
    }
    if (motor == 1) {
      i2c_w(0x03, 0);
      i2c_w(0x04, 0);
    }
  }

  //% block="rood $red|groen $green|blauw $blue"
  //% red.min=0 red.max=255
  //% green.min=0 green.max=255
  //% blue.min=0 blue.max=255
  //% group="LED" weight=60
  export function rgb(red: number, green: number, blue: number): number {
    return packRGB(red, green, blue);
  }

  //% block="LED = | $LED kleur = $rgb" 
  export function set_led(led: LED, rgb: number) {
    let r = 255 - unpackR(rgb);
    let g = 255 - unpackG(rgb);
    let b = 255 - unpackB(rgb);

    if (led == 0) {
      i2c_w(0x09, r);
      i2c_w(0x0a, g);
      i2c_w(0x05, b);
    }
    if (led == 1) {
      i2c_w(0x08, r);
      i2c_w(0x07, g);
      i2c_w(0x06, b);
    }
  }

}

function packRGB(r: number, g: number, b: number): number {
  return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}
function unpackR(rgb: number): number {
  let r = (rgb >> 16) & 0xFF;
  return r;
}
function unpackG(rgb: number): number {
  let g = (rgb >> 8) & 0xFF;
  return g;
}
function unpackB(rgb: number): number {
  let b = (rgb) & 0xFF;
  return b;
}

function i2c_w(reg: number, value: number) {
  let buf = pins.createBuffer(2)
  buf[0] = reg
  buf[1] = value
  pins.i2cWriteBuffer(i2c_address, buf)
}

