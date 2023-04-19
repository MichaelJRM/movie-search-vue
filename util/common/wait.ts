export default async function wait(delayInMs: number) {
  return await new Promise(res => setTimeout(res, delayInMs));
}