let i2c_address = 48

enum Motorlist {
  //% block="links"
  M0 = 0,
  //% block="rechts"
  M1 = 1
}

enum Direction {
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

    //% block="motor = | %motor richting = | $richting snelheid = $snelheid"
    //% snelheid.min=0 snelheid.max=255 
    //% group="Motor" weight=65
    export function motor(motor: Motorlist, richting: Direction, snelheid: number) {
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


    //% block="led = |%nr rood = |$rood groen = |$groen blauw = |$blauw"
    //% direction.shadow=timePicker
    //% rood.min=0 rood.max=255
    //% groen.min=0 groen.max=255
    //% blauw.min=0 blauw.max=255
    //% group="LED" weight=68
    export function my_led_rgb(nr: LED_rgb_L_R, rood: number, groen: number, blauw: number) {
       if (nr == 0) {
           i2c_w(8, rood);
           i2c_w(7, groen);
           i2c_w(6, blauw);
       };
       if (nr == 1) {
           i2c_w(9, rood);
           i2c_w(10, groen);
           i2c_w(5, blauw);
       };

    //% weight=69
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    //% advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }

    /**
    * Ultrasonic sensor
    */
    const TRIG_PIN = DigitalPin.P14;
    const ECHO_PIN = DigitalPin.P15;
    pins.setPull(TRIG_PIN, PinPullMode.PullNone);
    let lastTime = 0;
    //% block="Ultrasonic"
    //% group="Ultrasonic Sensor" weight=67
    export function ultra(): number {
        //send trig pulse
        pins.digitalWritePin(TRIG_PIN, 0)
        control.waitMicros(2);
        pins.digitalWritePin(TRIG_PIN, 1)
        control.waitMicros(10);
        pins.digitalWritePin(TRIG_PIN, 0)

        // read echo pulse  max distance : 6m(35000us)
        //2020-7-6 
        // pins.pulseIn():This function has a bug and returns data with large errors.
        let t = pins.pulseIn(ECHO_PIN, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;
        //2020-7-6
        //It would normally divide by 58, because the pins.pulseIn() function has an error, so it's divided by 58
        return Math.round(ret / 58);
    }

    /**
     * photoresistance sensor
     */
    //% block="LDR_L "
    //% group="Photoresistance Sensor" weight=66
    export function PH1(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

    //% block="LDR_R "
    //% group="Photoresistance Sensor" weight=66
    export function PH2(): number {
        return pins.analogReadPin(AnalogPin.P0);
    }

    /**
* return 0b01 or 0b10
* 0b01 is the sensor on the left
* 0b10 is the sensor on the right
*/
    pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
    //% block="Line Tracking"
    //% group="Line Tracking" weight=68
    export function LineTracking(): number {
        let val = pins.digitalReadPin(DigitalPin.P12) << 0 | pins.digitalReadPin(DigitalPin.P13) << 1;
        return val;
    }

    //% block="set servo to angle %angle"
    //% group="Servo" weight=69
    //% angle.min=0 angle.max.max=180
    export function setServo(angle: number): void {
        pins.servoWritePin(AnalogPin.P2, angle)
    }
}

function i2c_w(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(i2c_address, buf)
}
