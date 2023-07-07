const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../except/InvariantError');
const NotFoundError = require('../../except/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const fetch = await this._pool.query(query);

    if (!fetch.rows[0].id) {
      throw new InvariantError('Album failed to add');
    }

    return fetch.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN albums ON albums.id=songs."albumId" WHERE albums.id=$1',
      values: [id],
    };

    const resultSong = await this._pool.query(querySong);

    return { albums: resultAlbum.rows[0], songs: resultSong.rows };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const fetch = await this._pool.query(query);

    if (!fetch.rows.length) {
      throw new NotFoundError('Failed to update album. ID not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const fetch = await this._pool.query(query);

    if (!fetch.rows.length) {
      throw new NotFoundError('Failed to delete album. ID not found');
    }
  }
}
module.exports = AlbumsService;
