const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../except/InvariantError');
const { mapSongDB } = require('../../utils');
const NotFoundError = require('../../except/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const fecth = await this._pool.query(query);

    if (!fecth.rows[0].id) {
      throw new InvariantError('Song failed to add');
    }

    return fecth.rows[0].id;
  }

  async getSongs(requestParam){
    const { title, performer } = requestParam;

    // eslint-disable-next-line eqeqeq
    if ((title != undefined) && (performer != undefined)){
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
            values: [`%${title}%`, `%${performer}%`],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    if (title) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
            values: [`%${title}%`],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    if (performer) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
            values: [`%${performer}%`],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    const query = {
        text: 'SELECT id, title, performer FROM songs',
    };

    const { rows } = await this._pool.query(query);
    return rows;
}

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const fetch = await this._pool.query(query);

    if (!fetch.rows.length) {
      throw new NotFoundError('Song Not Found');
    }

    return fetch.rows.map(mapSongDB)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };
    const fetch = await this._pool.query(query);

    if (!fetch.rows.length) {
      throw new NotFoundError('Song failed to updated. Id not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const fetch = await this._pool.query(query);

    if (!fetch.rows.length) {
      throw new NotFoundError('Song failed to delete. Id not found');
    }
  }
}

module.exports = SongsService;
