module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './database/database.db'
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds/setup'
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },

  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './database/test.db'
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds/setup'
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'example'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
