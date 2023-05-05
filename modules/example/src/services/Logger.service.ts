import { injectable } from "tsyringe";

export enum LogLevel {
  DEBUG,
  INFO,
  LOG,
  WARN,
  ERROR,
}

export enum Colors {
  BLACK,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE,
  GRAY,
}

@injectable()
export default class Logger {
  private name!: string;
  private logLevel: LogLevel = LogLevel.ERROR;

  constructor() {
    const loglevelEnv = process.env.LOG_LEVEL;
    if (loglevelEnv) {
      this.logLevel = Object.values(LogLevel).indexOf(
        loglevelEnv.toUpperCase()
      );
    }
  }

  public setName(name: string) {
    this.name = name;
  }

  /**
   * Logs a messages of level DEBUG
   *
   * @param {...any[]} messages
   * @memberof Logger
   */
  public debug(...messages: any[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      this._log(Colors.GRAY, messages);
    }
  }

  /**
   * Logs a messages of level INFO
   *
   * @param {...any[]} messages
   * @memberof Logger
   */
  public info(...messages: any[]) {
    if (this.logLevel <= LogLevel.INFO) {
      this._log(Colors.WHITE, messages);
    }
  }

  /**
   * Logs a messages of level LOG
   *
   * @param {...any[]} messages
   * @memberof Logger
   */
  public log(...messages: any[]) {
    if (this.logLevel <= LogLevel.LOG) {
      this._log(Colors.WHITE, messages);
    }
  }

  /**
   * Logs a messages of level WARN
   *
   * @param {...any[]} messages
   * @memberof Logger
   */
  public warn(...messages: any[]) {
    if (this.logLevel <= LogLevel.WARN) {
      this._log(Colors.YELLOW, messages);
    }
  }

  /**
   * Logs a messages of level ERROR
   *
   * @param {...any[]} messages
   * @memberof Logger
   */
  public error(...messages: any[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      this._log(Colors.RED, messages);
    }
  }

  private _log(color?: Colors, ...messages: any[]) {
    console.log(
      `\x1b[${color ? "3" + color : "0"}m${new Date().toISOString()} ${
        LogLevel[this.logLevel]
      } [${this.name}] ${messages}\x1b[0m`
    );
  }
}
