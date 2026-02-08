export {};

const mode = process.argv[2];

if (mode === "server") {
  const { start } = await import("@/main/server");
  await start();
} else if (mode === "worker") {
  const { startWorker } = await import("@/worker");
  startWorker();
} else {
  console.error(`Usage: ${process.argv[1]} <server|worker>`);
  process.exit(1);
}
