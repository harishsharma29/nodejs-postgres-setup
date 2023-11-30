import jwt from 'jsonwebtoken';

const salt = 'YtRGWrInLQenFfexhPapd3IoS5JNjpzs&EIO';

class TokenService {
    /**
     *
     * @param {Object} payload
     * @param {Object} additionDetails
     * @return String
     */
    static issueToken(payload, additionDetails = {}) {
        return jwt.sign(payload, salt, additionDetails);
    }

    /**
     *
     * @param {String} token
     * @param {String} pwdhash
     * @returns
     */
    static verifyToken(token) {
        return jwt.verify(token, salt, {});
    }

    /**
     *
     * @param {Strubg} token
     * @returns
     */
    static decodeToken(token) {
        return jwt.decode(token);
    }
}

export default TokenService;
