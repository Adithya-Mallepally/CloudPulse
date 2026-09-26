const os = require("os");

function collectSystemMetrics() {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;

  // Approximate CPU load calculation
  let totalIdle = 0;
  let totalTick = 0;
  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  const idleRatio = totalTick > 0 ? totalIdle / totalTick : 0.5;
  const cpuUsagePercent = Math.max(0, Math.min(100, (1 - idleRatio) * 100));

  return {
    cpuUsage: parseFloat(cpuUsagePercent.toFixed(2)),
    memoryUsage: parseFloat(memoryUsagePercent.toFixed(2)),
    totalMemoryMB: Math.round(totalMemory / (1024 * 1024)),
    freeMemoryMB: Math.round(freeMemory / (1024 * 1024)),
    uptimeSeconds: Math.round(os.uptime()),
    loadAverage: os.loadavg(),
    timestamp: new Date().toISOString(),
  };
}

module.exports = { collectSystemMetrics };
