import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getCustomRepository } from "typeorm"
import { UserRepository } from "../repositories/UserRepository"

interface IAuthRequest {
    email: string;
    password: string;
}

class AuthenticateUserService{

    async execute({email, password}: IAuthRequest) {

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({email});

        if(!user){
            throw new Error("Email/Password incorrect");
        }

        const passMatch = compare(password, user.password);

        if(!passMatch){
            throw new Error("Email/Password incorrect");
        }

        const token = sign({
            email: user.email
        }, "chavesecreta", {
            subject: user.id,
            expiresIn: "1d"
        });

        return token;
    }
}

export { AuthenticateUserService }