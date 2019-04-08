
//% weight=10 color=#31C7D5 icon="\uf1b0" block="乐糖"

namespace Funsugar {
    export enum Motors {
        //%blockId=funbit_motordriver_motor_one
        //% block="A"
        Motor1,
        //%blockId=funbit_motordriver_motor_two
        //% block="B"
        Motor2
    }

    let distanceBuf = 0;
    
	function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    /**
     * Runs the motor at the given speed
     */
    //% block="电机 %motor|速度 %speed"
    //% speed.min=-100 speed.max=100
    export function MotorRun(motor: Motors, speed: number) {
        switch (motor) {
            case Motors.Motor1: /*Motor A uses Pins 13 and 14*/
                 i2cwrite(11, 0, speed);

                break;
            case Motors.Motor2: /*Motor B uses Pins 15 and 10*/
                i2cwrite(11, 2, speed);
				
                break;
        }
    }

    //% blockId=funbit_ultrasonic block="超声波|管脚 %pin"
    //% weight=10
    export function Ultrasonic(pin: DigitalPin): number {

        // send pulse
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(pin, 0);

        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;
        return Math.floor(ret * 10 / 6 / 58);
    }


}
