const { playlistPayloadSchema } = require('./schema');
const InvariantError = require('../../except/InvariantError');

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = playlistPayloadSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistValidator;
