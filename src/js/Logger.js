export default class Logger {
  static log() {
    console.log(...arguments);
  }
  static error() {
    console.error(...arguments);
  }
}
