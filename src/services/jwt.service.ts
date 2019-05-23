import * as jwt from "jsonwebtoken";
import { Service } from "typedi";

@Service()
export class JwtService {

    createToken(data: object) {
        return jwt.sign(data, process.env.JSON_SECRET);
    }

    private verify(data) {
        return jwt.verify(data, process.env.JSON_SECRET);
    }

    decode(headers) {
        if (headers["authorization"]) {
            const auth = headers["authorization"].split(' ');
            if (/^Bearer$/i.test(auth[0])) {
                const token = auth[1];
                return this.verify(token);
            }
            return false;
        }
        return false;
    }
}
