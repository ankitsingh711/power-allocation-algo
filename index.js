class Device {
    constructor(name, connectionTime, consumption) {
        this.name = name;
        this.connectionTime = connectionTime;
        this.consumption = Math.min(consumption, 40); // Max 40 units per device
    }
}

class PowerManager {
    constructor() {
        this.MAX_CAPACITY = 100;
        this.SAFE_CAPACITY = 92;
        this.currentPowerUsage = 0;
        this.devices = []; // List to hold active devices
    }

    // Update total power usage
    updateTotalPowerUsage() {
        this.currentPowerUsage = this.devices.reduce((total, device) => total + device.consumption, 0);
    }

    // Allocate power based on FIFO, ensuring no overload
    allocatePower() {
        this.updateTotalPowerUsage();

        // If total power usage exceeds safe capacity, adjust devices
        if (this.currentPowerUsage > this.SAFE_CAPACITY) {
            let availablePower = this.SAFE_CAPACITY;
            for (let device of this.devices) {
                if (availablePower > 0) {
                    // Allocate as much power as possible, but not more than the device's max capacity
                    if (device.consumption <= availablePower) {
                        availablePower -= device.consumption;
                    } else {
                        // Allocate remaining available power to the device
                        device.consumption = availablePower;
                        availablePower = 0;
                    }
                } else {
                    device.consumption = 0; // No power left for further devices
                }
            }
        }
    }

    // Connect a new device with specified consumption
    connectDevice(deviceName, requestedConsumption, connectionTime) {
        let newDevice = new Device(deviceName, connectionTime, requestedConsumption);
        this.devices.push(newDevice);
        this.allocatePower();
    }

    // Disconnect a device and release its power consumption
    disconnectDevice(deviceName) {
        let deviceIndex = this.devices.findIndex(device => device.name === deviceName);
        if (deviceIndex !== -1) {
            this.currentPowerUsage -= this.devices[deviceIndex].consumption;
            this.devices.splice(deviceIndex, 1); // Remove the device
            this.allocatePower();
        }
    }

    // Change a device's power consumption
    changeDeviceConsumption(deviceName, newConsumption) {
        let device = this.devices.find(device => device.name === deviceName);
        if (device) {
            this.currentPowerUsage -= device.consumption;
            device.consumption = Math.min(newConsumption, 40); // Max 40 units per device
            this.currentPowerUsage += device.consumption;
            this.allocatePower();
        }
    }

    // Print current device power allocations
    printDeviceAllocations() {
        this.devices.forEach(device => {
            console.log(`${device.name} is consuming ${device.consumption} units.`);
        });
    }
}

// Example Scenario
let powerManager = new PowerManager();

let t = 0;
powerManager.connectDevice("A", 40, t); // Device A connects at t=0 with 40 units
t = 1;
powerManager.connectDevice("B", 40, t); // Device B connects at t=1 with 40 units
t = 2;
powerManager.connectDevice("C", 40, t); // Device C connects at t=2, but gets 12 units (total 92 max)
t = 3;
powerManager.changeDeviceConsumption("A", 20); // Device A reduces to 20 units at t=3
powerManager.changeDeviceConsumption("C", 32); // Device C increases to 32 units at t=3
t = 4;
powerManager.disconnectDevice("B"); // Device B disconnects at t=4, releasing 40 units

// Print the final allocations
powerManager.printDeviceAllocations();
