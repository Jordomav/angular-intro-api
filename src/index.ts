import "reflect-metadata";
import { createConnection, useContainer as ormUseContainer } from "typeorm";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { Container } from "typedi";

import { User } from "./entity/User";
import { JwtService } from "./services/jwt.service";

routingUseContainer(Container);
ormUseContainer(Container);
createConnection().then(async connection => {
    const jwt: JwtService = new JwtService();
    const app = createExpressServer({
        cors: true,
        controllers: [__dirname + '/controllers/*.controller.ts'],
        authorizationChecker: async (action, roles: string[]): Promise<boolean> => {
            const headers: object = action.request.headers;
            const decoded = jwt.decode(headers);
            if (decoded) {
                const user: User = await connection.getRepository(User).findOne(decoded.id);
                if (user && !roles.length) return true;
            }
            return false;
        },
        currentUserChecker: async (action): Promise<User> => {
            const headers: object = action.request.headers;
            const decoded = jwt.decode(headers);
            if (decoded) {
                return await connection.getRepository(User).findOne(decoded.id);
            }
        }
    });
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
}).catch(error => console.log(error));
