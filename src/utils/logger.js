// Logger utility for React Native with colored output
class Logger {
  constructor() {
    this.isDevelopment = __DEV__; // React Native's dev mode flag
  }

  // API Request Logger
  logRequest(method, url, data, headers) {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    
    console.group(`📤 ${method.toUpperCase()} ${url}`);
    console.log('⏰ Time:', timestamp);
    
    if (data) {
      console.log('📦 Data:', data);
    }
    
    if (headers) {
      console.log('📋 Headers:', this._maskSensitiveData(headers));
    }
    
    console.groupEnd();
  }

  // API Response Logger
  logResponse(method, url, status, data, duration) {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌';
    
    console.group(`📥 ${statusEmoji} ${method.toUpperCase()} ${url} [${status}]`);
    console.log('⏰ Time:', timestamp);
    console.log('⚡ Duration:', duration, 'ms');
    
    if (data) {
      console.log('📦 Data:', data);
    }
    
    console.groupEnd();
  }

  // Error Logger
  logError(error, context = '') {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    
    console.group(`❌ ERROR ${context}`);
    console.log('⏰ Time:', timestamp);
    console.log('📝 Message:', error.message);
    
    if (error.response) {
      console.log('🔢 Status:', error.response.status);
      console.log('📦 Data:', error.response.data);
    }
    
    if (error.stack) {
      console.log('📚 Stack:', error.stack);
    }
    
    console.groupEnd();
  }

  // Screen Navigation Logger
  logNavigation(from, to, params) {
    if (!this.isDevelopment) return;

    console.log(`🧭 Navigation: ${from} → ${to}`, params || '');
  }

  // State Change Logger
  logStateChange(stateName, oldValue, newValue) {
    if (!this.isDevelopment) return;

    console.group(`🔄 State Change: ${stateName}`);
    console.log('Old:', oldValue);
    console.log('New:', newValue);
    console.groupEnd();
  }

  // Authentication Logger
  logAuth(action, details) {
    if (!this.isDevelopment) return;

    const emoji = {
      login: '🔐',
      logout: '🚪',
      register: '📝',
      tokenRefresh: '🔄',
    };

    console.log(`${emoji[action] || '🔑'} Auth: ${action}`, details || '');
  }

  // Storage Logger
  logStorage(action, key, value) {
    if (!this.isDevelopment) return;

    const emoji = action === 'set' ? '💾' : action === 'get' ? '📂' : '🗑️';
    
    console.log(`${emoji} Storage ${action}: ${key}`, 
      value && action === 'set' ? this._maskSensitiveData({ [key]: value }) : ''
    );
  }

  // Performance Logger
  logPerformance(label, duration) {
    if (!this.isDevelopment) return;

    console.log(`⚡ Performance: ${label} took ${duration}ms`);
  }

  // Generic Info Logger
  info(message, data) {
    if (!this.isDevelopment) return;
    console.log('ℹ️', message, data || '');
  }

  // Generic Warning Logger
  warn(message, data) {
    if (!this.isDevelopment) return;
    console.warn('⚠️', message, data || '');
  }

  // Debug Logger
  debug(message, data) {
    if (!this.isDevelopment) return;
    console.debug('🐛', message, data || '');
  }

  // Mask sensitive data
  _maskSensitiveData(obj) {
    const masked = { ...obj };
    const sensitiveKeys = ['password', 'token', 'authorization', 'otp', 'secret'];
    
    Object.keys(masked).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        const value = String(masked[key]);
        masked[key] = value.length > 10 
          ? value.substring(0, 7) + '...' + value.substring(value.length - 4)
          : '***';
      }
    });
    
    return masked;
  }
}

export default new Logger();