import log from 'npmlog'

export class Logger {
  constructor() {
    if (this instanceof Logger) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static enable() {
    this.manage()
  }

  static manage(
    opts = {
      enabled: true,
      level: 'silly',
      enableColor: true,
      enableProgress: true,
    }
  ) {
    const functions = {
      enabled: () => (log.pause = !opts.enabled),
      level: () => (log.level = opts.level),
      enableColor: () => log.enableColor(),
      enableProgress: () => log.enableProgress(),
    }

    Object.keys(opts).forEach((key) => functions[key]())
  }

  static pause() {
    log.pause()
  }

  static unpause() {
    log.resume()
  }

  static silly(prefix, message, ...args) {
    Logger.#areArgsNull(args)
      ? log.silly(prefix, message)
      : log.silly(prefix, message, args)
  }

  static info(prefix, message, ...args) {
    Logger.#areArgsNull(args)
      ? log.info(prefix, message)
      : log.info(prefix, message, args)
  }

  static warn(prefix, message, ...args) {
    Logger.#areArgsNull(args)
      ? log.warn(prefix, message)
      : log.warn(prefix, message, args)
  }

  static error(prefix, message, ...args) {
    Logger.#areArgsNull(args)
      ? log.error(prefix, message)
      : log.error(prefix, message, args)
  }

  static #areArgsNull(args) {
    return (
      args.length == 0 || args.every((arg) => arg == null || arg == undefined)
    )
  }
}
