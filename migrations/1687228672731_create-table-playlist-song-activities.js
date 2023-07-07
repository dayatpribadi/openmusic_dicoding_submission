/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'varchar(30)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(30)',
        },
        song_id: {
            type: 'varchar(30)',
            notNull: true,
        },
        user_id: {
            type: 'varchar(30)',
            notNull: true,
        },
        action: {
            type: 'text',
            notNull: true,
        },
        time: {
            type: 'text',
            notNull: true,
        },
    });
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities');
};
