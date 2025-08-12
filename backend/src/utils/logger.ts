interface LogLevel {
  ERROR: number;
  WARN: number;
  INFO: number;
  DEBUG: number;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL as keyof LogLevel] ?? LOG_LEVELS.INFO;

class Logger {
  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = args.length > 0 ? `${message} ${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')}` : message;
    return `[${timestamp}] [${level}] ${formattedMessage}`;
  }

  error(message: string, ...args: any[]): void {
    if (LOG_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (LOG_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (LOG_LEVEL >= LOG_LEVELS.INFO) {
      console.info(this.formatMessage('INFO', message, ...args));
    }
  }

  debug(message: string, ...args: any[]): void {
    if (LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }
}

export const logger = new Logger();
