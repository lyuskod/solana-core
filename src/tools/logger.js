import { format } from 'date-fns'
import npmlog from 'npmlog'
import log from 'npmlog'

export class Logger {
  constructor() {
    if (this instanceof Logger) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static {
    log.addLevel('ready', 2, { bold: true, inverse: true, fg: 'grey' })
    log.addLevel('success', 3, { bold: true, inverse: true, fg: 'green' })
    log.addLevel('fail', 4, { bold: true, inverse: true, fg: 'red' })
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

  static ready(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.ready(prefix, message)
      : log.ready(prefix, message, args)
  }

  static success(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.success(prefix, message)
      : log.success(prefix, message, args)
  }

  static silly(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.silly(prefix, message)
      : log.silly(prefix, message, args)
  }

  static info(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.info(prefix, message)
      : log.info(prefix, message, args)
  }

  static warn(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.warn(prefix, message)
      : log.warn(prefix, message, args)
  }

  static error(prefix, message, ...args) {
    message = `[${format(Date.now(), 'MM-dd HH:mm:ss')}] ${message}`
    Logger.#areArgsNull(args)
      ? log.fail(prefix, message)
      : log.fail(prefix, message, args)
  }

  static #areArgsNull(args) {
    return (
      args.length == 0 || args.every((arg) => arg == null || arg == undefined)
    )
  }
}
